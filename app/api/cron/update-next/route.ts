/**
 * Called by Vercel Cron daily at midnight.
 * Updates the single card whose benefits were updated longest ago.
 * Running daily means ~30 cards are each refreshed once per month.
 */
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';
import { kvGetCards, kvSetCards, kvSetLastCron } from '@/lib/kv';
import type { Benefit } from '@/lib/types';

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function GET(req: NextRequest) {
  // Verify Vercel cron signature — Vercel automatically sets CRON_SECRET
  // and passes it as Authorization: Bearer <secret> on cron requests.
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not set' }, { status: 500 });
  }

  const cards = await kvGetCards();
  if (!cards || cards.length === 0) {
    return NextResponse.json({ skipped: true, reason: 'No cards in KV' });
  }

  // Find the card with a URL that was updated longest ago (or never)
  const candidates = cards.filter((c) => c.officialBenefitsUrl?.trim());
  if (candidates.length === 0) {
    return NextResponse.json({ skipped: true, reason: 'No cards have officialBenefitsUrl' });
  }

  const card = candidates.sort((a, b) => {
    const ta = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
    const tb = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
    return ta - tb; // oldest first
  })[0];

  // --- Fetch benefits via Claude ---
  const systemPrompt = `You are a credit card benefits researcher. Fetch the official benefits page and return ONLY a JSON array of benefits — no markdown, no explanation. Each item must have exactly these fields:
- name: string
- description: string (1-2 sentences)
- value: number (dollar value, 0 if none)
- frequency: "monthly" | "annual" | "once"
- category: "travel" | "dining" | "entertainment" | "shopping" | "credit" | "insurance" | "other"`;

  const messages: MessageParam[] = [
    {
      role: 'user',
      content: `Fetch ${card.officialBenefitsUrl} and extract all cardholder benefits for the ${card.name} issued by ${card.issuer}. Return ONLY the JSON array.`,
    },
  ];

  let response;
  let continuations = 0;

  try {
    while (continuations < 4) {
      response = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 4096,
        system: systemPrompt,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        tools: [{ type: 'web_fetch_20260209', name: 'web_fetch' }] as any,
        messages,
      });

      if (response.stop_reason === 'end_turn') break;
      if (response.stop_reason === 'pause_turn') {
        messages.push({ role: 'assistant', content: response.content });
        continuations++;
        continue;
      }
      break;
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }

  if (!response) {
    return NextResponse.json({ error: 'No response from Claude' }, { status: 500 });
  }

  const textBlock = response.content.find((b) => b.type === 'text');
  const rawText = textBlock && 'text' in textBlock ? textBlock.text.trim() : '';

  let benefits: Omit<Benefit, 'id' | 'usage'>[] | null = null;
  try {
    const parsed = JSON.parse(rawText);
    if (Array.isArray(parsed)) benefits = parsed;
  } catch {
    const match = rawText.match(/\[[\s\S]*\]/);
    if (match) {
      try {
        const parsed = JSON.parse(match[0]);
        if (Array.isArray(parsed)) benefits = parsed;
      } catch { /* ignore */ }
    }
  }

  if (!benefits) {
    return NextResponse.json({
      error: 'Could not parse benefits JSON',
      card: card.name,
    }, { status: 422 });
  }

  // Merge: preserve existing usage history keyed by benefit name
  const usageMap = Object.fromEntries(card.benefits.map((b) => [b.name.toLowerCase(), b.usage]));
  const validCategories = ['travel', 'dining', 'entertainment', 'shopping', 'credit', 'insurance', 'other'];
  const validFrequencies = ['monthly', 'annual', 'once'];

  const updatedBenefits: Benefit[] = benefits
    .filter((b) => b && typeof b.name === 'string' && b.name.trim())
    .map((b) => ({
      id: crypto.randomUUID(),
      name: String(b.name).trim(),
      description: String(b.description || '').trim(),
      value: typeof b.value === 'number' ? Math.max(0, b.value) : 0,
      frequency: (validFrequencies.includes(String(b.frequency)) ? b.frequency : 'annual') as Benefit['frequency'],
      category: (validCategories.includes(String(b.category)) ? b.category : 'other') as Benefit['category'],
      usage: usageMap[String(b.name).toLowerCase()] ?? [],
    }));

  const updatedCards = cards.map((c) =>
    c.id === card.id
      ? { ...c, benefits: updatedBenefits, lastUpdated: new Date().toISOString() }
      : c
  );

  await kvSetCards(updatedCards);
  await kvSetLastCron(new Date().toISOString());

  return NextResponse.json({
    updated: card.name,
    benefitCount: updatedBenefits.length,
    nextUpdateDue: candidates
      .filter((c) => c.id !== card.id)
      .sort((a, b) => {
        const ta = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
        const tb = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
        return ta - tb;
      })[0]?.name ?? 'none',
  });
}

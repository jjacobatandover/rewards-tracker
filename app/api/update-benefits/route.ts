import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured. Add it to your .env.local file.' },
      { status: 500 }
    );
  }

  const { cardName, issuer, officialUrl } = await req.json();

  const systemPrompt = `You are a credit card benefits researcher. Your job is to fetch the official benefits page for a credit card and return a precise, structured JSON array of all cardholder benefits.

IMPORTANT: After fetching the page, respond with ONLY a JSON array (no markdown code fences, no explanation). Each element must have exactly these fields:
- name: string (short, clear benefit name)
- description: string (1-2 sentence explanation of exactly what the benefit is)
- value: number (dollar value; 0 if no clear monetary amount)
- frequency: "monthly" | "annual" | "once"
- category: "travel" | "dining" | "entertainment" | "shopping" | "credit" | "insurance" | "other"

Focus on concrete, redeemable benefits (credits, lounge access, insurance). Include all monetary credits. Omit generic rewards earning rates.`;

  const userMessage = `Fetch this URL and extract all cardholder benefits for the ${cardName} issued by ${issuer}: ${officialUrl}

Return ONLY the JSON array of benefits. No other text.`;

  const messages: MessageParam[] = [{ role: 'user', content: userMessage }];

  let response;
  let continuations = 0;
  const maxContinuations = 4;

  try {
    while (continuations < maxContinuations) {
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
    console.error('Claude API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch benefits' },
      { status: 500 }
    );
  }

  if (!response) {
    return NextResponse.json({ error: 'No response from Claude' }, { status: 500 });
  }

  const textBlock = response.content.find((b) => b.type === 'text');
  const rawText = textBlock && 'text' in textBlock ? textBlock.text.trim() : '';

  // Try to extract JSON array from the response
  let benefits = null;

  // Direct parse attempt
  try {
    const parsed = JSON.parse(rawText);
    if (Array.isArray(parsed)) benefits = parsed;
  } catch {
    // Try to extract JSON from within text (e.g., wrapped in markdown)
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) benefits = parsed;
      } catch {
        // Could not parse
      }
    }
  }

  if (!benefits) {
    return NextResponse.json(
      { error: 'Could not parse benefits from the response. The page may be behind a login or structured differently.' },
      { status: 422 }
    );
  }

  // Sanitize and validate each benefit
  const validCategories = ['travel', 'dining', 'entertainment', 'shopping', 'credit', 'insurance', 'other'];
  const validFrequencies = ['monthly', 'annual', 'once'];

  const sanitized = benefits
    .filter((b: Record<string, unknown>) => b && typeof b.name === 'string' && b.name.trim())
    .map((b: Record<string, unknown>) => ({
      name: String(b.name).trim(),
      description: String(b.description || '').trim(),
      value: typeof b.value === 'number' ? Math.max(0, b.value) : 0,
      frequency: validFrequencies.includes(String(b.frequency)) ? b.frequency : 'annual',
      category: validCategories.includes(String(b.category)) ? b.category : 'other',
    }));

  return NextResponse.json({ benefits: sanitized, count: sanitized.length });
}

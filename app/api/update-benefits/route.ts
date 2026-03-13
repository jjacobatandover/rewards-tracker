import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Perks that are card features, not trackable credits — exclude from results
const PERK_KEYWORDS = [
  'priority pass', 'lounge access', 'centurion lounge', 'sky club', 'admirals club',
  'lounge buddy', 'plaza premium', 'capital one lounge', 'alaska lounge',
  'rental car insurance', 'trip cancellation', 'trip interruption', 'purchase protection',
  'extended warranty', 'cell phone protection', 'travel insurance', 'baggage insurance',
  'fraud protection', 'elite status', 'gold status', 'platinum status', 'diamond status',
  'discoverist', 'globalist', 'preferred boarding', 'inflight savings', 'points back',
  'miles back', 'rewards earning', 'bonus points earning', 'pay with points',
];

function isPerk(name: string, description: string): boolean {
  const text = `${name} ${description}`.toLowerCase();
  return PERK_KEYWORDS.some((kw) => text.includes(kw));
}

const SYSTEM_PROMPT = `You are a credit card benefits researcher. You fetch multiple sources to find the most accurate and current benefits for a credit card.

Focus ONLY on concrete, trackable monetary credits and reimbursements — things the cardholder must actively use or redeem:
- Statement credits (travel, dining, entertainment, streaming, gym, etc.)
- Annual/monthly fee reimbursements
- Bonus certificates (free nights, companion fares, anniversary points with dollar value)

DO NOT include:
- Lounge access (Priority Pass, Centurion, Sky Club, etc.) — these are perks, not credits
- Insurance coverages (rental car, trip cancellation, purchase protection)
- Earning rates (3x on dining, etc.)
- Elite status benefits
- Preferred boarding or inflight discounts

After fetching the sources, respond with ONLY a JSON array. No markdown, no explanation. Each item:
{
  "name": "short descriptive name",
  "description": "1-2 sentences: exactly what it covers, how to redeem",
  "value": 300,
  "frequency": "monthly" | "annual" | "once",
  "category": "travel" | "dining" | "entertainment" | "shopping" | "credit" | "other",
  "source": "thepointsguy" | "nerdwallet" | "issuer" | "multiple"
}`;

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured. Add it to your .env.local file.' },
      { status: 500 }
    );
  }

  const { cardName, issuer, officialUrl } = await req.json();

  // Build slug for TPG/NerdWallet URLs
  const slug = cardName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const userMessage = `Research the current benefits for the "${cardName}" by ${issuer}.

Please fetch these sources in order:
1. The Points Guy review: https://thepointsguy.com/credit-cards/${slug}/
2. NerdWallet review: https://www.nerdwallet.com/reviews/credit-cards (search for "${cardName}")
3. Official issuer page: ${officialUrl}

Cross-reference all three sources. Focus on CURRENT, ACTIVE benefits only — note if a source says a benefit was recently added or removed.

Return ONLY the JSON array of trackable credits/certificates. No lounge access, no insurance, no earning rates.`;

  const messages: MessageParam[] = [{ role: 'user', content: userMessage }];

  let response;
  let continuations = 0;

  try {
    while (continuations < 4) {
      response = await client.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
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

  let benefits = null;
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
    return NextResponse.json(
      { error: 'Could not parse benefits. The page may be behind a login or structured differently.' },
      { status: 422 }
    );
  }

  const validCategories = ['travel', 'dining', 'entertainment', 'shopping', 'credit', 'other'];
  const validFrequencies = ['monthly', 'annual', 'once'];

  const sanitized = benefits
    .filter((b: Record<string, unknown>) => {
      if (!b || typeof b.name !== 'string' || !b.name.trim()) return false;
      // Filter out perks that slipped through
      if (isPerk(String(b.name), String(b.description ?? ''))) return false;
      return true;
    })
    .map((b: Record<string, unknown>) => ({
      name: String(b.name).trim(),
      description: String(b.description || '').trim(),
      value: typeof b.value === 'number' ? Math.max(0, b.value) : 0,
      frequency: validFrequencies.includes(String(b.frequency)) ? b.frequency : 'annual',
      category: validCategories.includes(String(b.category)) ? b.category : 'other',
      source: b.source ?? 'unknown',
    }));

  return NextResponse.json({ benefits: sanitized, count: sanitized.length });
}

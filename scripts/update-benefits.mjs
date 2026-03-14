#!/usr/bin/env node
/**
 * Updates card benefits in lib/cardData.ts using Claude AI + web_fetch.
 * Run this locally, review `git diff lib/cardData.ts`, then push.
 *
 * Usage:
 *   node scripts/update-benefits.mjs                           # update stale cards (>30 days)
 *   node scripts/update-benefits.mjs "Chase Sapphire Reserve" # update one specific card
 *   node scripts/update-benefits.mjs --all                    # force update every card
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARD_DATA_PATH = join(__dirname, '../lib/cardData.ts');
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

// ─── String helpers ──────────────────────────────────────────────────────────

function esc(s) {
  return String(s ?? '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function formatBenefitsArray(benefits) {
  const lines = ['['];
  for (const b of benefits) {
    lines.push(`      {`);
    lines.push(`        name: '${esc(b.name)}',`);
    lines.push(`        description: '${esc(b.description)}',`);
    lines.push(`        value: ${Number(b.value) || 0}, frequency: '${b.frequency}', category: '${b.category}',`);
    lines.push(`      },`);
  }
  lines.push('    ]');
  return lines.join('\n');
}

// ─── File manipulation ───────────────────────────────────────────────────────

function extractCards(content) {
  const cards = [];
  const nameRegex = /    name: '([^']+)'/g;
  let match;
  while ((match = nameRegex.exec(content)) !== null) {
    const idx = match.index;
    const name = match[1];
    const snippet = content.slice(idx, idx + 700);
    const urlMatch = snippet.match(/officialBenefitsUrl: '([^']+)'/);
    const issuerMatch = snippet.match(/issuer: '([^']+)'/);
    const updatedMatch = snippet.match(/benefitsUpdated: '([^']+)'/);
    if (urlMatch && issuerMatch) {
      cards.push({
        name,
        issuer: issuerMatch[1],
        url: urlMatch[1],
        benefitsUpdated: updatedMatch?.[1] ?? null,
      });
    }
  }
  return cards;
}

function replaceBenefitsInFile(content, cardName, newBenefits, now) {
  // Find this card's position
  const nameStr = `    name: '${cardName}'`;
  const cardIdx = content.indexOf(nameStr);
  if (cardIdx === -1) throw new Error(`Card not found in file: ${cardName}`);

  // Find benefits: [ after the card name
  const benefitsKeyIdx = content.indexOf('    benefits: [', cardIdx);
  const arrStart = benefitsKeyIdx + '    benefits: '.length; // points to '['

  // Balanced bracket walk to find end of array
  let depth = 0;
  let i = arrStart;
  for (; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') {
      depth--;
      if (depth === 0) { i++; break; }
    }
  }

  // Replace the benefits array
  let updated = content.slice(0, arrStart) + formatBenefitsArray(newBenefits) + content.slice(i);

  // Update or insert benefitsUpdated field
  const updatedField = `    benefitsUpdated: '${now}',`;
  const existingIdx = updated.indexOf('    benefitsUpdated:', cardIdx);
  const cardEnd = updated.indexOf('\n  },\n', cardIdx);

  if (existingIdx !== -1 && existingIdx < cardEnd) {
    // Replace existing value
    const lineEnd = updated.indexOf('\n', existingIdx);
    updated = updated.slice(0, existingIdx) + updatedField + updated.slice(lineEnd);
  } else {
    // Insert after officialBenefitsUrl line
    const urlLineStart = updated.indexOf('    officialBenefitsUrl:', cardIdx);
    const urlLineEnd = updated.indexOf('\n', urlLineStart);
    updated = updated.slice(0, urlLineEnd + 1) + updatedField + '\n' + updated.slice(urlLineEnd + 1);
  }

  return updated;
}

// ─── Claude fetch ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a credit card benefits researcher. Fetch the official benefits page and return ONLY a JSON array — no markdown, no explanation, no code fences. Each item must have exactly:
- name: string
- description: string (1–2 sentences, plain text)
- value: number (dollar amount, 0 if perk with no fixed value)
- frequency: "monthly" | "annual" | "once"
- category: "travel" | "dining" | "entertainment" | "shopping" | "credit" | "insurance" | "other"`;

const VALID_CATS = ['travel', 'dining', 'entertainment', 'shopping', 'credit', 'insurance', 'other'];
const VALID_FREQS = ['monthly', 'annual', 'once'];

async function fetchBenefits(cardName, issuer, url) {
  const messages = [{
    role: 'user',
    content: `Fetch ${url} and extract every cardholder benefit for the ${cardName} issued by ${issuer}. Return ONLY the JSON array.`,
  }];

  let response;
  let continuations = 0;

  while (continuations < 5) {
    response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: [{ type: 'web_fetch_20260209', name: 'web_fetch' }],
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

  const textBlock = response?.content?.find(b => b.type === 'text');
  const rawText = textBlock?.text?.trim() ?? '';

  let parsed = null;
  try { parsed = JSON.parse(rawText); } catch {
    const m = rawText.match(/\[[\s\S]*\]/);
    if (m) { try { parsed = JSON.parse(m[0]); } catch {} }
  }

  if (!Array.isArray(parsed)) throw new Error('Could not parse JSON array from Claude response');

  return parsed
    .filter(b => b && typeof b.name === 'string' && b.name.trim())
    .map(b => ({
      name: String(b.name).trim(),
      description: String(b.description ?? '').trim(),
      value: typeof b.value === 'number' ? Math.max(0, b.value) : 0,
      frequency: VALID_FREQS.includes(String(b.frequency)) ? b.frequency : 'annual',
      category: VALID_CATS.includes(String(b.category)) ? b.category : 'other',
    }));
}

// ─── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const forceAll = args.includes('--all');
const targetName = args.find(a => !a.startsWith('--'));

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('Error: ANTHROPIC_API_KEY environment variable is not set.');
  process.exit(1);
}

let fileContent = readFileSync(CARD_DATA_PATH, 'utf8');
const allCards = extractCards(fileContent);

let cardsToUpdate;
if (targetName) {
  cardsToUpdate = allCards.filter(c => c.name.toLowerCase().includes(targetName.toLowerCase()));
  if (cardsToUpdate.length === 0) {
    console.error(`No card found matching: "${targetName}"`);
    console.log('Available cards:');
    allCards.forEach(c => console.log(`  ${c.name}`));
    process.exit(1);
  }
} else if (forceAll) {
  cardsToUpdate = allCards;
} else {
  cardsToUpdate = allCards.filter(c => {
    if (!c.benefitsUpdated) return true;
    return Date.now() - new Date(c.benefitsUpdated).getTime() > THIRTY_DAYS_MS;
  });
}

if (cardsToUpdate.length === 0) {
  console.log('✓ All cards updated within the last 30 days. Use --all to force refresh.');
  process.exit(0);
}

console.log(`Updating ${cardsToUpdate.length} card(s):\n`);
cardsToUpdate.forEach(c => {
  const age = c.benefitsUpdated
    ? `last updated ${Math.floor((Date.now() - new Date(c.benefitsUpdated).getTime()) / 86400000)}d ago`
    : 'never updated';
  console.log(`  • ${c.name} (${age})`);
});
console.log('');

const now = new Date().toISOString();
let updatedCount = 0;

for (const card of cardsToUpdate) {
  process.stdout.write(`Fetching ${card.name}... `);
  try {
    const benefits = await fetchBenefits(card.name, card.issuer, card.url);
    fileContent = replaceBenefitsInFile(fileContent, card.name, benefits, now);
    updatedCount++;
    console.log(`✓ ${benefits.length} benefits`);
  } catch (err) {
    console.log(`✗ ${err.message}`);
  }
}

if (updatedCount > 0) {
  writeFileSync(CARD_DATA_PATH, fileContent, 'utf8');
  console.log(`\n✓ Wrote ${updatedCount} update(s) to lib/cardData.ts`);
  console.log('  Review:  git diff lib/cardData.ts');
  console.log('  Commit:  git add lib/cardData.ts && git commit -m "update card benefits" && git push');
} else {
  console.log('\nNo updates written.');
}

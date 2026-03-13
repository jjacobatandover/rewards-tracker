/**
 * Vercel KV wrapper with graceful localStorage fallback for local dev.
 * KV is only available when KV_REST_API_URL is configured in the environment.
 */

import type { CreditCard } from './types';

const CARDS_KEY = 'perks-tracker:cards';
const LAST_CRON_KEY = 'perks-tracker:last-cron';

function isKvAvailable(): boolean {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function kvGetCards(): Promise<CreditCard[] | null> {
  if (!isKvAvailable()) return null;
  try {
    const { kv } = await import('@vercel/kv');
    const data = await kv.get<CreditCard[]>(CARDS_KEY);
    return data ?? null;
  } catch (err) {
    console.error('[KV] getCards failed:', err);
    return null;
  }
}

export async function kvSetCards(cards: CreditCard[]): Promise<void> {
  if (!isKvAvailable()) return;
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(CARDS_KEY, cards);
  } catch (err) {
    console.error('[KV] setCards failed:', err);
  }
}

export async function kvGetLastCron(): Promise<string | null> {
  if (!isKvAvailable()) return null;
  try {
    const { kv } = await import('@vercel/kv');
    return await kv.get<string>(LAST_CRON_KEY);
  } catch {
    return null;
  }
}

export async function kvSetLastCron(iso: string): Promise<void> {
  if (!isKvAvailable()) return;
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(LAST_CRON_KEY, iso);
  } catch (err) {
    console.error('[KV] setLastCron failed:', err);
  }
}

export { isKvAvailable };

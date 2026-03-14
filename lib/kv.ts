/**
 * Upstash Redis wrapper (replaces deprecated @vercel/kv).
 * Supports both old Vercel KV env var names (KV_REST_API_*) and
 * new Upstash env var names (UPSTASH_REDIS_REST_*).
 */

import type { CreditCard } from './types';

const CARDS_KEY = 'perks-tracker:cards';

function isKvAvailable(): boolean {
  return !!(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

async function getRedis() {
  const { Redis } = await import('@upstash/redis');
  return new Redis({
    url: (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL)!,
    token: (process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN)!,
  });
}

export async function kvGetCards(): Promise<CreditCard[] | null> {
  if (!isKvAvailable()) return null;
  try {
    const redis = await getRedis();
    const data = await redis.get<CreditCard[]>(CARDS_KEY);
    return data ?? null;
  } catch (err) {
    console.error('[KV] getCards failed:', err);
    return null;
  }
}

export async function kvSetCards(cards: CreditCard[]): Promise<void> {
  if (!isKvAvailable()) return;
  try {
    const redis = await getRedis();
    await redis.set(CARDS_KEY, cards);
  } catch (err) {
    console.error('[KV] setCards failed:', err);
  }
}

export async function kvSetLastCron(iso: string): Promise<void> {
  if (!isKvAvailable()) return;
  try {
    const redis = await getRedis();
    await redis.set('perks-tracker:last-cron', iso);
  } catch (err) {
    console.error('[KV] setLastCron failed:', err);
  }
}

export { isKvAvailable };

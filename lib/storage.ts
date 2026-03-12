import type { CreditCard } from './types';

const STORAGE_KEY = 'rewards-tracker-v1';

export function loadCards(): CreditCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CreditCard[];
  } catch {
    return [];
  }
}

export function saveCards(cards: CreditCard[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

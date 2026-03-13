import type { CreditCard } from './types';

const STORAGE_KEY = 'rewards-tracker-v1';

// Benefit names that are perks (not trackable credits) — strip from saved data
const PERK_BENEFIT_NAMES = [
  'priority pass select membership',
  'priority pass select (unlimited guests)',
  'priority pass select',
  'centurion lounge access',
  'capital one lounge access',
  'delta sky club access',
  'alaska lounge+ discounted passes',
];

function isPerkBenefit(name: string): boolean {
  return PERK_BENEFIT_NAMES.includes(name.toLowerCase().trim());
}

export function loadCards(): CreditCard[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const cards = JSON.parse(raw) as CreditCard[];
    // Strip any perk-only benefits that shouldn't be tracked
    return cards.map((c) => ({
      ...c,
      benefits: c.benefits.filter((b) => !isPerkBenefit(b.name)),
    }));
  } catch {
    return [];
  }
}

export function saveCards(cards: CreditCard[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

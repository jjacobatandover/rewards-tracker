import type { CreditCard, Settings } from './types';

const STORAGE_KEY = 'rewards-tracker-v1';
const SETTINGS_KEY = 'rewards-tracker-settings-v1';

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
    const cards = JSON.parse(raw) as (Omit<CreditCard, 'holder'> & { holder: string })[];
    const result: CreditCard[] = [];
    for (const c of cards) {
      const base = {
        ...c,
        benefits: c.benefits.filter((b) => !isPerkBenefit(b.name)),
      };
      // Migrate legacy 'both' cards → split into two separate cards
      if (c.holder === 'both') {
        result.push({ ...base, id: crypto.randomUUID(), holder: 'me' });
        result.push({ ...base, id: crypto.randomUUID(), holder: 'spouse' });
      } else {
        result.push({ ...base, holder: c.holder === 'spouse' ? 'spouse' : 'me' });
      }
    }
    return result;
  } catch {
    return [];
  }
}

export function saveCards(cards: CreditCard[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
}

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return { p1Name: 'Me', p2Name: 'Spouse' };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { p1Name: 'Me', p2Name: 'Spouse' };
    return { p1Name: 'Me', p2Name: 'Spouse', ...JSON.parse(raw) };
  } catch {
    return { p1Name: 'Me', p2Name: 'Spouse' };
  }
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

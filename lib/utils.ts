import type { Benefit, BenefitFrequency } from './types';

export function getCurrentPeriod(frequency: BenefitFrequency): string {
  const now = new Date();
  if (frequency === 'monthly') {
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }
  if (frequency === 'annual') {
    return String(now.getFullYear());
  }
  return 'used';
}

export function isBenefitUsed(benefit: Benefit): boolean {
  if (benefit.usage.length === 0) return false;
  if (benefit.frequency === 'once') return true;
  const period = getCurrentPeriod(benefit.frequency);
  return benefit.usage.some((u) => u.period === period);
}

export function getCardStats(benefits: Benefit[]) {
  let totalValue = 0;
  let usedValue = 0;

  for (const b of benefits) {
    if (b.value === 0) continue;
    if (b.frequency === 'monthly') {
      totalValue += b.value * 12;
      const usedMonths = new Set(
        b.usage
          .filter((u) => u.period.startsWith(String(new Date().getFullYear())))
          .map((u) => u.period)
      ).size;
      usedValue += b.value * usedMonths;
    } else {
      totalValue += b.value;
      if (isBenefitUsed(b)) usedValue += b.value;
    }
  }

  return { totalValue, usedValue, remainingValue: totalValue - usedValue };
}

export function formatCurrency(n: number): string {
  if (n === 0) return '$0';
  return `$${n % 1 === 0 ? n : n.toFixed(2)}`;
}

export const CATEGORY_LABELS: Record<string, string> = {
  travel: 'Travel',
  dining: 'Dining',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  credit: 'Credits',
  insurance: 'Insurance',
  other: 'Other',
};

export const CATEGORY_COLORS: Record<string, string> = {
  travel: 'bg-blue-900/40 text-blue-300 border border-blue-700/30',
  dining: 'bg-orange-900/40 text-orange-300 border border-orange-700/30',
  entertainment: 'bg-purple-900/40 text-purple-300 border border-purple-700/30',
  shopping: 'bg-green-900/40 text-green-300 border border-green-700/30',
  credit: 'bg-yellow-900/40 text-yellow-300 border border-yellow-700/30',
  insurance: 'bg-slate-700/40 text-slate-300 border border-slate-600/30',
  other: 'bg-gray-800/40 text-gray-400 border border-gray-700/30',
};

'use client';

import { useMemo } from 'react';
import type { CreditCard, Benefit, BenefitCategory } from '@/lib/types';
import { BenefitItem } from './BenefitItem';
import { getCardStats, formatCurrency, CATEGORY_LABELS, isBenefitUsed, getCurrentPeriod } from '@/lib/utils';

interface Props {
  cards: CreditCard[];
  onUpdateCard: (card: CreditCard) => void;
}

const CATEGORY_ORDER: BenefitCategory[] = [
  'travel', 'dining', 'entertainment', 'shopping', 'credit', 'insurance', 'other',
];

export function MultiCardView({ cards, onUpdateCard }: Props) {
  const totals = useMemo(() => {
    return cards.reduce(
      (acc, c) => {
        const s = getCardStats(c.benefits);
        acc.annualFees += c.annualFee;
        acc.totalValue += s.totalValue;
        acc.usedValue += s.usedValue;
        return acc;
      },
      { annualFees: 0, totalValue: 0, usedValue: 0 }
    );
  }, [cards]);

  const netValue = totals.usedValue - totals.annualFees;
  const pct = totals.totalValue > 0 ? Math.min(100, (totals.usedValue / totals.totalValue) * 100) : 0;

  // Flatten all benefits with card context, grouped by category
  const benefitsByCategory = useMemo(() => {
    const groups: Partial<Record<BenefitCategory, { card: CreditCard; benefit: Benefit }[]>> = {};
    for (const card of cards) {
      for (const benefit of card.benefits) {
        if (!groups[benefit.category]) groups[benefit.category] = [];
        groups[benefit.category]!.push({ card, benefit });
      }
    }
    return groups;
  }, [cards]);

  function handleToggle(cardId: string, benefitId: string, used: boolean) {
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;
    const now = new Date().toISOString();
    const updated = card.benefits.map((b) => {
      if (b.id !== benefitId) return b;
      if (used) {
        const period = getCurrentPeriod(b.frequency);
        if (b.usage.some((u) => u.period === period)) return b;
        return { ...b, usage: [...b.usage, { period, usedDate: now }] };
      } else {
        if (b.frequency === 'once') return { ...b, usage: [] };
        const period = getCurrentPeriod(b.frequency);
        return { ...b, usage: b.usage.filter((u) => u.period !== period) };
      }
    });
    onUpdateCard({ ...card, benefits: updated });
  }

  const holderLabel = () => {
    const holders = new Set(cards.map((c) => c.holder));
    if (holders.size === 1) {
      const h = [...holders][0];
      return h === 'me' ? 'Me' : h === 'spouse' ? 'Spouse' : 'Both';
    }
    return 'Combined';
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-lg font-semibold text-white">{holderLabel()} — {cards.length} Cards</h1>
        </div>
        <p className="text-xs text-gray-500">
          {cards.map((c) => c.name).join(' · ')}
        </p>

        {/* Aggregate stats */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          <StatBox label="Total Fees" value={formatCurrency(totals.annualFees)} />
          <StatBox label="Total Value" value={formatCurrency(totals.totalValue)} />
          <StatBox label="Used This Year" value={formatCurrency(totals.usedValue)} accent />
          <StatBox
            label="Net Value"
            value={formatCurrency(Math.abs(netValue))}
            sub={netValue >= 0 ? 'ahead' : 'behind'}
            positive={netValue >= 0}
          />
        </div>

        {totals.totalValue > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{Math.round(pct)}% used across all cards</span>
              <span>{formatCurrency(totals.totalValue - totals.usedValue)} remaining</span>
            </div>
            <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Per-card quick stats */}
      <div className="px-5 py-3 border-b border-[#2a2a2a] flex gap-2 overflow-x-auto">
        {cards.map((c) => {
          const s = getCardStats(c.benefits);
          return (
            <div key={c.id} className="flex-shrink-0 flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] rounded-lg px-3 py-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              <div>
                <p className="text-xs font-medium text-gray-200 max-w-[120px] truncate">{c.name}</p>
                <p className="text-[10px] text-amber-400">{formatCurrency(s.remainingValue)} left</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Benefits list */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {CATEGORY_ORDER
          .filter((cat) => benefitsByCategory[cat]?.length)
          .map((cat) => (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                {CATEGORY_LABELS[cat]}
              </h3>
              <div className="space-y-2">
                {benefitsByCategory[cat]!.map(({ card, benefit }) => (
                  <div key={`${card.id}-${benefit.id}`}>
                    {/* Card label above each benefit */}
                    <p className="text-[10px] text-gray-600 mb-0.5 pl-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: card.color }} />
                      {card.name}
                    </p>
                    <BenefitItem
                      benefit={benefit}
                      onToggle={(id, used) => handleToggle(card.id, id, used)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

        {cards.every((c) => c.benefits.length === 0) && (
          <p className="text-center text-sm text-gray-500 py-10">No benefits loaded yet.</p>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value, sub, accent, positive }: {
  label: string; value: string; sub?: string; accent?: boolean; positive?: boolean;
}) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-base font-semibold mt-0.5 ${accent ? 'text-amber-400' : 'text-white'}`}>{value}</p>
      {sub && <p className={`text-xs mt-0.5 ${positive ? 'text-green-400' : 'text-red-400'}`}>{sub}</p>}
    </div>
  );
}

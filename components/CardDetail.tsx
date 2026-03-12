'use client';

import { useState, useMemo } from 'react';
import type { CreditCard, Benefit, BenefitCategory } from '@/lib/types';
import { BenefitItem } from './BenefitItem';
import {
  getCardStats,
  isBenefitUsed,
  getCurrentPeriod,
  formatCurrency,
  CATEGORY_LABELS,
} from '@/lib/utils';

interface Props {
  card: CreditCard;
  onUpdateCard: (card: CreditCard) => void;
  onDeleteCard: (cardId: string) => void;
}

export function CardDetail({ card, onUpdateCard, onDeleteCard }: Props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [filter, setFilter] = useState<'all' | 'unused' | 'used'>('all');

  const stats = useMemo(() => getCardStats(card.benefits), [card.benefits]);

  const benefitsByCategory = useMemo(() => {
    const filtered = card.benefits.filter((b) => {
      if (filter === 'used') return isBenefitUsed(b);
      if (filter === 'unused') return !isBenefitUsed(b);
      return true;
    });

    const groups: Partial<Record<BenefitCategory, Benefit[]>> = {};
    for (const b of filtered) {
      if (!groups[b.category]) groups[b.category] = [];
      groups[b.category]!.push(b);
    }
    return groups;
  }, [card.benefits, filter]);

  const categoryOrder: BenefitCategory[] = [
    'travel', 'dining', 'entertainment', 'shopping', 'credit', 'insurance', 'other',
  ];

  function handleToggle(benefitId: string, used: boolean) {
    const now = new Date().toISOString();
    const updated = card.benefits.map((b) => {
      if (b.id !== benefitId) return b;
      if (used) {
        const period = getCurrentPeriod(b.frequency);
        // Avoid duplicate periods
        const alreadyHas = b.usage.some((u) => u.period === period);
        if (alreadyHas) return b;
        return { ...b, usage: [...b.usage, { period, usedDate: now }] };
      } else {
        // Remove current period usage
        const period = getCurrentPeriod(b.frequency);
        if (b.frequency === 'once') {
          return { ...b, usage: [] };
        }
        return { ...b, usage: b.usage.filter((u) => u.period !== period) };
      }
    });
    onUpdateCard({ ...card, benefits: updated });
  }

  async function handleUpdateBenefits() {
    if (!card.officialBenefitsUrl) {
      setUpdateMsg({ type: 'error', text: 'No official URL configured for this card.' });
      return;
    }

    setIsUpdating(true);
    setUpdateMsg(null);

    try {
      const res = await fetch('/api/update-benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardName: card.name,
          issuer: card.issuer,
          officialUrl: card.officialBenefitsUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setUpdateMsg({ type: 'error', text: data.error || 'Update failed.' });
        return;
      }

      // Merge fetched benefits with existing ones, preserving usage history
      const existingUsageMap = Object.fromEntries(card.benefits.map((b) => [b.name.toLowerCase(), b.usage]));

      const mergedBenefits: Benefit[] = data.benefits.map(
        (b: Omit<Benefit, 'id' | 'usage'>) => ({
          ...b,
          id: crypto.randomUUID(),
          usage: existingUsageMap[b.name.toLowerCase()] ?? [],
        })
      );

      onUpdateCard({
        ...card,
        benefits: mergedBenefits,
        lastUpdated: new Date().toISOString(),
      });

      setUpdateMsg({ type: 'success', text: `Updated! Found ${data.count} benefits.` });
    } catch (err) {
      setUpdateMsg({ type: 'error', text: 'Network error. Make sure ANTHROPIC_API_KEY is set.' });
    } finally {
      setIsUpdating(false);
      setTimeout(() => setUpdateMsg(null), 5000);
    }
  }

  const netValue = stats.usedValue - card.annualFee;
  const pctUsed = stats.totalValue > 0 ? Math.min(100, (stats.usedValue / stats.totalValue) * 100) : 0;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Card header */}
      <div className="p-5 border-b border-[#2a2a2a]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: card.color }}
              />
              <h1 className="text-lg font-semibold text-white leading-tight">{card.name}</h1>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
              <span>{card.issuer}</span>
              <span>·</span>
              <span className="capitalize">{card.holder === 'spouse' ? 'Spouse' : card.holder === 'both' ? 'Both' : 'Me'}</span>
              {card.lastFourDigits && (
                <>
                  <span>·</span>
                  <span>···· {card.lastFourDigits}</span>
                </>
              )}
              {card.lastUpdated && (
                <>
                  <span>·</span>
                  <span>Updated {new Date(card.lastUpdated).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleUpdateBenefits}
              disabled={isUpdating}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Fetch latest benefits from official card page (requires API key)"
            >
              {isUpdating ? (
                <>
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Fetching…
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Update Benefits
                </>
              )}
            </button>
            <button
              onClick={() => {
                if (confirm(`Remove ${card.name}?`)) onDeleteCard(card.id);
              }}
              className="text-xs px-3 py-1.5 rounded-md bg-red-900/20 border border-red-800/30 text-red-400 hover:bg-red-900/30 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>

        {updateMsg && (
          <div
            className={`mt-2 text-xs px-3 py-2 rounded-md ${
              updateMsg.type === 'success'
                ? 'bg-green-900/30 border border-green-700/30 text-green-300'
                : 'bg-red-900/30 border border-red-700/30 text-red-300'
            }`}
          >
            {updateMsg.text}
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          <StatBox label="Annual Fee" value={formatCurrency(card.annualFee)} />
          <StatBox label="Total Value" value={formatCurrency(stats.totalValue)} />
          <StatBox label="Used This Year" value={formatCurrency(stats.usedValue)} accent />
          <StatBox
            label="Net Value"
            value={formatCurrency(Math.abs(netValue))}
            sub={netValue >= 0 ? 'ahead' : 'behind'}
            positive={netValue >= 0}
          />
        </div>

        {/* Progress bar */}
        {stats.totalValue > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{Math.round(pctUsed)}% of annual value used</span>
              <span>{formatCurrency(stats.remainingValue)} remaining</span>
            </div>
            <div className="h-1.5 bg-[#2a2a2a] rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${pctUsed}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-5 py-3 border-b border-[#2a2a2a]">
        {(['all', 'unused', 'used'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1 rounded-md capitalize transition-colors ${
              filter === f
                ? 'bg-[#2a2a2a] text-white'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Benefits list */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {card.benefits.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">
            <p>No benefits loaded yet.</p>
            <p className="mt-1 text-xs">Click &ldquo;Update Benefits&rdquo; to fetch from the official card page.</p>
          </div>
        ) : (
          categoryOrder
            .filter((cat) => benefitsByCategory[cat]?.length)
            .map((cat) => (
              <div key={cat}>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  {CATEGORY_LABELS[cat]}
                </h3>
                <div className="space-y-2">
                  {benefitsByCategory[cat]!.map((b) => (
                    <BenefitItem key={b.id} benefit={b} onToggle={handleToggle} />
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  sub,
  accent,
  positive,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-base font-semibold mt-0.5 ${accent ? 'text-amber-400' : 'text-white'}`}>
        {value}
      </p>
      {sub && (
        <p className={`text-xs mt-0.5 ${positive ? 'text-green-400' : 'text-red-400'}`}>{sub}</p>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import type { CreditCard, Settings } from '@/lib/types';
import { getCardStats, formatCurrency } from '@/lib/utils';

type Filter = 'all' | 'me' | 'spouse';

interface Props {
  cards: CreditCard[];
  selectedId: string | null;
  onSelectId: (id: string) => void;
  onAddCard: () => void;
  settings: Settings;
}

export function CardSidebar({ cards, selectedId, onSelectId, onAddCard, settings }: Props) {
  const [filter, setFilter] = useState<Filter>('all');

  const meCards = cards.filter((c) => c.holder === 'me');
  const spouseCards = cards.filter((c) => c.holder === 'spouse');

  const visibleCards = (
    filter === 'me' ? meCards :
    filter === 'spouse' ? spouseCards :
    cards
  ).slice().sort((a, b) => {
    const aLeft = getCardStats(a.benefits).remainingValue;
    const bLeft = getCardStats(b.benefits).remainingValue;
    return bLeft - aLeft;
  });

  const counts: Record<Filter, number> = {
    all: cards.length,
    me: meCards.length,
    spouse: spouseCards.length,
  };

  return (
    <aside className="w-64 flex-shrink-0 border-r border-[#2a2a2a] flex flex-col h-full">
      {/* Filter tabs */}
      <div className="px-3 pt-3 pb-2 border-b border-[#2a2a2a]">
        <div className="flex gap-1">
          {(['all', 'me', 'spouse'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-md text-xs capitalize transition-colors ${
                filter === f ? 'bg-[#2a2a2a] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f === 'me' ? settings.p1Name : f === 'spouse' ? settings.p2Name : 'All'}
              {counts[f] > 0 && (
                <span className="ml-1 text-[10px] text-gray-500">{counts[f]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {visibleCards.length === 0 && (
          <p className="text-xs text-gray-600 text-center pt-8">No cards here.</p>
        )}
        {visibleCards.map((card) => {
          const stats = getCardStats(card.benefits);
          const isSelected = card.id === selectedId;
          return (
            <button
              key={card.id}
              onClick={() => onSelectId(card.id)}
              className={`w-full text-left rounded-lg overflow-hidden border transition-all ${
                isSelected
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-[#2a2a2a] bg-[#141414] hover:border-[#3a3a3a] hover:bg-[#1a1a1a]'
              }`}
            >
              <div className="flex">
                <div className="w-1 flex-shrink-0" style={{ backgroundColor: card.color }} />
                <div className="flex-1 p-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-amber-400' : 'bg-transparent'
                    }`} />
                    <span className="text-xs font-medium text-gray-200 truncate leading-tight">
                      {card.name}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between pl-3.5">
                    <span className="text-xs text-gray-500">
                      {card.holder === 'spouse' ? settings.p2Name : settings.p1Name}
                      {card.lastFourDigits ? ` ···· ${card.lastFourDigits}` : ''}
                    </span>
                    {stats.remainingValue > 0 && (
                      <span className="text-xs text-amber-400 font-medium">
                        {formatCurrency(stats.remainingValue)} left
                      </span>
                    )}
                  </div>
                  {stats.totalValue > 0 && (
                    <div className="mt-1.5 h-1 bg-[#2a2a2a] rounded-full overflow-hidden ml-3.5">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, (stats.usedValue / stats.totalValue) * 100)}%`,
                          backgroundColor: card.color,
                          opacity: 0.7,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-[#2a2a2a]">
        <button
          onClick={onAddCard}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-dashed border-[#3a3a3a] text-xs text-gray-400 hover:text-gray-200 hover:border-amber-500/40 transition-colors"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Card
        </button>
      </div>
    </aside>
  );
}

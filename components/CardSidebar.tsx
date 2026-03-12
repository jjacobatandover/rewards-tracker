'use client';

import type { CreditCard } from '@/lib/types';
import { getCardStats, formatCurrency } from '@/lib/utils';

interface Props {
  cards: CreditCard[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddCard: () => void;
}

export function CardSidebar({ cards, selectedId, onSelect, onAddCard }: Props) {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-[#2a2a2a] flex flex-col h-full">
      <div className="p-4 border-b border-[#2a2a2a]">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">My Cards</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {cards.length === 0 && (
          <p className="text-xs text-gray-600 text-center pt-8">No cards added yet.</p>
        )}
        {cards.map((card) => {
          const stats = getCardStats(card.benefits);
          const isSelected = card.id === selectedId;
          return (
            <button
              key={card.id}
              onClick={() => onSelect(card.id)}
              className={`w-full text-left rounded-lg p-3 border transition-all ${
                isSelected
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-[#2a2a2a] bg-[#141414] hover:border-[#3a3a3a] hover:bg-[#1a1a1a]'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: card.color }}
                />
                <span className="text-xs font-medium text-gray-200 truncate leading-tight">
                  {card.name}
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">
                  {card.holder === 'spouse' ? 'Spouse' : card.holder === 'both' ? 'Both' : 'Me'}
                </span>
                {stats.remainingValue > 0 && (
                  <span className="text-xs text-amber-400 font-medium">
                    {formatCurrency(stats.remainingValue)} left
                  </span>
                )}
              </div>
              {/* Mini progress */}
              {stats.totalValue > 0 && (
                <div className="mt-2 h-1 bg-[#2a2a2a] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500/70 rounded-full"
                    style={{
                      width: `${Math.min(100, (stats.usedValue / stats.totalValue) * 100)}%`,
                    }}
                  />
                </div>
              )}
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

'use client';

import { useState } from 'react';
import type { CreditCard, CardHolder, Benefit } from '@/lib/types';
import { CARD_TEMPLATES } from '@/lib/cardData';

interface Selection {
  holder: CardHolder;
}

interface Props {
  onAdd: (cards: CreditCard[]) => void;
  onClose: () => void;
}

export function AddCardModal({ onAdd, onClose }: Props) {
  // Map of template name → holder selection (only entries for checked cards)
  const [selected, setSelected] = useState<Record<string, Selection>>({});

  const checkedNames = Object.keys(selected);
  const count = checkedNames.length;

  function toggleCard(name: string) {
    setSelected((prev) => {
      if (prev[name]) {
        const next = { ...prev };
        delete next[name];
        return next;
      }
      return { ...prev, [name]: { holder: 'me' } };
    });
  }

  function setHolder(name: string, holder: CardHolder) {
    setSelected((prev) => ({ ...prev, [name]: { holder } }));
  }

  function handleAdd() {
    const cards: CreditCard[] = checkedNames.map((name) => {
      const template = CARD_TEMPLATES.find((t) => t.name === name)!;
      const benefits: Benefit[] = template.benefits.map((b) => ({
        ...b,
        id: crypto.randomUUID(),
        usage: [],
      }));
      return {
        id: crypto.randomUUID(),
        name: template.name,
        issuer: template.issuer,
        holder: selected[name].holder,
        annualFee: template.annualFee,
        benefits,
        color: template.color,
        officialBenefitsUrl: template.officialBenefitsUrl,
        lastUpdated: new Date().toISOString(),
      };
    });
    onAdd(cards);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-lg mx-4 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a] flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-white">Add Credit Cards</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {count === 0 ? 'Select one or more cards' : `${count} card${count > 1 ? 's' : ''} selected`}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Card list */}
        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {CARD_TEMPLATES.map((t) => {
            const isChecked = !!selected[t.name];
            const holder = selected[t.name]?.holder ?? 'me';
            return (
              <div
                key={t.name}
                className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                  isChecked
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'border-[#2a2a2a] bg-[#111] hover:border-[#3a3a3a]'
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleCard(t.name)}
                  className={`w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                    isChecked ? 'bg-amber-500 border-amber-500' : 'border-[#444] bg-transparent'
                  }`}
                >
                  {isChecked && (
                    <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>

                {/* Color dot + name */}
                <button
                  onClick={() => toggleCard(t.name)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left"
                >
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color }} />
                  <span className={`text-sm truncate ${isChecked ? 'text-gray-100' : 'text-gray-400'}`}>
                    {t.name}
                  </span>
                  <span className="text-xs text-gray-600 flex-shrink-0">
                    {t.annualFee > 0 ? `$${t.annualFee}` : 'No fee'}
                  </span>
                </button>

                {/* Holder toggle — only active when checked */}
                <div className={`flex gap-1 flex-shrink-0 transition-opacity ${isChecked ? 'opacity-100' : 'opacity-25 pointer-events-none'}`}>
                  {(['me', 'spouse', 'both'] as CardHolder[]).map((h) => (
                    <button
                      key={h}
                      onClick={() => setHolder(t.name, h)}
                      className={`px-2 py-0.5 rounded text-[10px] capitalize border transition-colors ${
                        holder === h && isChecked
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                          : 'border-[#333] text-gray-500 hover:border-[#444]'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-[#2a2a2a] flex-shrink-0">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg text-sm text-gray-400 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={count === 0}
            className="flex-1 py-2 rounded-lg text-sm font-medium bg-amber-500 text-black hover:bg-amber-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {count === 0 ? 'Add Card' : count === 1 ? 'Add 1 Card' : `Add ${count} Cards`}
          </button>
        </div>
      </div>
    </div>
  );
}

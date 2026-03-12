'use client';

import { useState } from 'react';
import type { CreditCard, CardHolder, Benefit } from '@/lib/types';
import { CARD_TEMPLATES, CUSTOM_CARD_TEMPLATE } from '@/lib/cardData';

interface Props {
  onAdd: (card: CreditCard) => void;
  onClose: () => void;
}

export function AddCardModal({ onAdd, onClose }: Props) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>(CARD_TEMPLATES[0].name);
  const [holder, setHolder] = useState<CardHolder>('me');
  const [lastFour, setLastFour] = useState('');
  const [customUrl, setCustomUrl] = useState('');

  const isCustom = selectedTemplate === 'custom';
  const template = isCustom
    ? CUSTOM_CARD_TEMPLATE
    : CARD_TEMPLATES.find((t) => t.name === selectedTemplate) ?? CARD_TEMPLATES[0];

  function handleAdd() {
    const benefits: Benefit[] = template.benefits.map((b) => ({
      ...b,
      id: crypto.randomUUID(),
      usage: [],
    }));

    const card: CreditCard = {
      id: crypto.randomUUID(),
      name: template.name,
      issuer: template.issuer,
      holder,
      annualFee: template.annualFee,
      benefits,
      color: template.color,
      officialBenefitsUrl: isCustom ? customUrl : template.officialBenefitsUrl,
      lastFourDigits: lastFour.trim() || undefined,
      lastUpdated: new Date().toISOString(),
    };

    onAdd(card);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
          <h2 className="text-base font-semibold text-white">Add Credit Card</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Card selection */}
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Card</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-amber-500/50"
            >
              {CARD_TEMPLATES.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
              <option value="custom">✏️ Custom Card…</option>
            </select>
          </div>

          {/* Card preview */}
          {!isCustom && template && (
            <div
              className="rounded-lg p-3 text-xs text-white/70 space-y-1"
              style={{ backgroundColor: template.color + '33', borderColor: template.color + '55', border: '1px solid' }}
            >
              <div className="flex justify-between">
                <span>Annual Fee</span>
                <span className="text-white">{template.annualFee === 0 ? 'None' : `$${template.annualFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Pre-loaded benefits</span>
                <span className="text-white">{template.benefits.length}</span>
              </div>
            </div>
          )}

          {/* Custom URL (for custom cards) */}
          {isCustom && (
            <div>
              <label className="text-xs font-medium text-gray-400 block mb-1.5">Official Benefits URL</label>
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          )}

          {/* Holder */}
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">Card Holder</label>
            <div className="flex gap-2">
              {(['me', 'spouse', 'both'] as CardHolder[]).map((h) => (
                <button
                  key={h}
                  onClick={() => setHolder(h)}
                  className={`flex-1 py-1.5 rounded-lg text-xs capitalize border transition-colors ${
                    holder === h
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'bg-[#111] border-[#2a2a2a] text-gray-400 hover:border-[#3a3a3a]'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Last 4 digits */}
          <div>
            <label className="text-xs font-medium text-gray-400 block mb-1.5">
              Last 4 Digits <span className="text-gray-600">(optional)</span>
            </label>
            <input
              type="text"
              maxLength={4}
              value={lastFour}
              onChange={(e) => setLastFour(e.target.value.replace(/\D/g, ''))}
              placeholder="1234"
              className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t border-[#2a2a2a]">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm text-gray-400 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-2 rounded-lg text-sm font-medium bg-amber-500 text-black hover:bg-amber-400 transition-colors"
          >
            Add Card
          </button>
        </div>
      </div>
    </div>
  );
}

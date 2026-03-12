'use client';

import { useState, useEffect } from 'react';
import type { CreditCard } from '@/lib/types';
import { loadCards, saveCards } from '@/lib/storage';
import { CardSidebar } from '@/components/CardSidebar';
import { CardDetail } from '@/components/CardDetail';
import { AddCardModal } from '@/components/AddCardModal';

export default function Home() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage
  useEffect(() => {
    const loaded = loadCards();
    setCards(loaded);
    if (loaded.length > 0) setSelectedId(loaded[0].id);
    setMounted(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (mounted) saveCards(cards);
  }, [cards, mounted]);

  function handleAddCard(card: CreditCard) {
    setCards((prev) => [...prev, card]);
    setSelectedId(card.id);
  }

  function handleUpdateCard(updated: CreditCard) {
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  function handleDeleteCard(id: string) {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? null);
      return next;
    });
  }

  const selectedCard = cards.find((c) => c.id === selectedId) ?? null;

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2a2a2a] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-amber-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">Perks Tracker</h1>
            <p className="text-xs text-gray-500">Credit card benefits</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {cards.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {cards.length} card{cards.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Add Card
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        <CardSidebar
          cards={cards}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onAddCard={() => setShowAddModal(true)}
        />

        <main className="flex-1 overflow-hidden">
          {selectedCard ? (
            <CardDetail
              card={selectedCard}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-base font-medium text-gray-300">No cards yet</h2>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                Add your credit cards to track perks, credits, and benefits for you and your spouse.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-5 flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add Your First Card
              </button>
            </div>
          )}
        </main>
      </div>

      {showAddModal && (
        <AddCardModal onAdd={handleAddCard} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

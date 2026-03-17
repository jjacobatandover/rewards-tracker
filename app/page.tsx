'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { CreditCard, Settings } from '@/lib/types';
import { loadCards, saveCards, loadSettings, saveSettings } from '@/lib/storage';
import { CardSidebar } from '@/components/CardSidebar';
import { CardDetail } from '@/components/CardDetail';
import { AddCardModal } from '@/components/AddCardModal';
import { SettingsModal } from '@/components/SettingsModal';

export default function Home() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<Settings>({ p1Name: 'Me', p2Name: 'Spouse' });
  const [mounted, setMounted] = useState(false);
  const [kvAvailable, setKvAvailable] = useState(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    async function init() {
      let loaded: CreditCard[] = [];
      try {
        const res = await fetch('/api/cards');
        if (res.ok) {
          const data = await res.json();
          if (data.kvAvailable && Array.isArray(data.cards) && data.cards.length > 0) {
            loaded = data.cards;
            setKvAvailable(true);
            saveCards(loaded);
          } else if (data.kvAvailable) {
            setKvAvailable(true);
            const local = loadCards();
            if (local.length > 0) {
              loaded = local;
              await fetch('/api/cards', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cards: local }),
              });
            }
          }
        }
      } catch { /* fallback to local */ }

      if (loaded.length === 0) loaded = loadCards();

      setCards(loaded);
      setSettings(loadSettings());
      if (loaded.length > 0) setSelectedId(loaded[0].id);
      setMounted(true);
      isInitialLoad.current = false;
    }
    init();
  }, []);

  const syncToServer = useCallback((updatedCards: CreditCard[]) => {
    if (!kvAvailable) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    syncTimeoutRef.current = setTimeout(() => {
      fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cards: updatedCards }),
      }).catch(() => {});
    }, 1500);
  }, [kvAvailable]);

  useEffect(() => {
    if (!mounted || isInitialLoad.current) return;
    saveCards(cards);
    syncToServer(cards);
  }, [cards, mounted, syncToServer]);

  function handleSaveSettings(updated: Settings) {
    setSettings(updated);
    saveSettings(updated);
  }

  function handleAddCard(newCards: CreditCard[]) {
    setCards((prev) => [...prev, ...newCards]);
    if (newCards.length > 0) setSelectedId(newCards[0].id);
  }

  function handleUpdateCard(updated: CreditCard) {
    setCards((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  function handleDeleteCard(id: string) {
    setCards((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (selectedId === id) setSelectedId(next.length > 0 ? next[0].id : null);
      return next;
    });
  }

  const selectedCard = cards.find((c) => c.id === selectedId) ?? null;

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-500">Loading your cards…</p>
        </div>
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
          {kvAvailable && (
            <div className="flex items-center gap-1.5" title="Synced across devices via Vercel KV">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-gray-500">Synced</span>
            </div>
          )}
          {cards.length > 0 && (
            <span className="text-xs text-gray-500">{cards.length} card{cards.length !== 1 ? 's' : ''}</span>
          )}
          <button
            onClick={() => setShowSettings(true)}
            title="Settings"
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#2a2a2a] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
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
          onSelectId={setSelectedId}
          onAddCard={() => setShowAddModal(true)}
          settings={settings}
        />

        <main className="flex-1 overflow-hidden">
          {!selectedCard ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-base font-medium text-gray-300">
                {cards.length === 0 ? 'No cards yet' : 'Select a card'}
              </h2>
              <p className="text-sm text-gray-500 mt-1 max-w-xs">
                {cards.length === 0
                  ? 'Add your credit cards to track perks and credits.'
                  : 'Pick a card from the sidebar.'}
              </p>
              {cards.length === 0 && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-5 flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Add Your First Card
                </button>
              )}
            </div>
          ) : (
            <CardDetail
              card={selectedCard}
              settings={settings}
              onUpdateCard={handleUpdateCard}
              onDeleteCard={handleDeleteCard}
            />
          )}
        </main>
      </div>

      {showAddModal && (
        <AddCardModal settings={settings} onAdd={handleAddCard} onClose={() => setShowAddModal(false)} />
      )}
      {showSettings && (
        <SettingsModal settings={settings} onSave={handleSaveSettings} onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}

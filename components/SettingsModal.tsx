'use client';

import { useState } from 'react';
import type { Settings } from '@/lib/types';

interface Props {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onSave, onClose }: Props) {
  const [p1Name, setP1Name] = useState(settings.p1Name);
  const [p2Name, setP2Name] = useState(settings.p2Name);

  function handleSave() {
    onSave({
      p1Name: p1Name.trim() || 'Me',
      p2Name: p2Name.trim() || 'Spouse',
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-sm mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a]">
          <h2 className="text-base font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-gray-500">Customize how cardholders are labeled throughout the app.</p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Person 1 (you)</label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                placeholder="Me"
                maxLength={20}
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Person 2 (spouse / partner)</label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                placeholder="Spouse"
                maxLength={20}
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-[#2a2a2a]">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-lg text-sm text-gray-400 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-lg text-sm font-medium bg-amber-500 text-black hover:bg-amber-400 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

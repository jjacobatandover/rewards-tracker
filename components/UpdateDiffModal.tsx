'use client';

import type { Benefit } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export interface BenefitDiff {
  added: Omit<Benefit, 'id' | 'usage'>[];
  removed: Benefit[];
  changed: { before: Benefit; after: Omit<Benefit, 'id' | 'usage'> }[];
  unchanged: Benefit[];
}

interface Props {
  cardName: string;
  diff: BenefitDiff;
  onConfirm: () => void;
  onCancel: () => void;
}

export function diffBenefits(
  current: Benefit[],
  incoming: Omit<Benefit, 'id' | 'usage'>[]
): BenefitDiff {
  const normalize = (s: string) => s.toLowerCase().trim();

  const currentMap = new Map(current.map((b) => [normalize(b.name), b]));
  const incomingMap = new Map(incoming.map((b) => [normalize(b.name), b]));

  const added: Omit<Benefit, 'id' | 'usage'>[] = [];
  const removed: Benefit[] = [];
  const changed: { before: Benefit; after: Omit<Benefit, 'id' | 'usage'> }[] = [];
  const unchanged: Benefit[] = [];

  // Check incoming against current
  for (const [key, inB] of incomingMap) {
    const curB = currentMap.get(key);
    if (!curB) {
      added.push(inB);
    } else if (curB.value !== inB.value || curB.frequency !== inB.frequency) {
      changed.push({ before: curB, after: inB });
    } else {
      unchanged.push(curB);
    }
  }

  // Check current against incoming (to find removed)
  for (const [key, curB] of currentMap) {
    if (!incomingMap.has(key)) {
      removed.push(curB);
    }
  }

  return { added, removed, changed, unchanged };
}

export function UpdateDiffModal({ cardName, diff, onConfirm, onCancel }: Props) {
  const hasChanges = diff.added.length > 0 || diff.removed.length > 0 || diff.changed.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl w-full max-w-lg mx-4 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#2a2a2a] flex-shrink-0">
          <div>
            <h2 className="text-base font-semibold text-white">Review Benefit Updates</h2>
            <p className="text-xs text-gray-500 mt-0.5">{cardName}</p>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-300">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {!hasChanges ? (
            <div className="text-center py-6">
              <div className="w-10 h-10 rounded-full bg-green-900/30 border border-green-700/30 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-sm text-gray-300">No changes detected</p>
              <p className="text-xs text-gray-500 mt-1">Benefits are up to date ({diff.unchanged.length} benefits confirmed)</p>
            </div>
          ) : (
            <>
              {diff.added.length > 0 && (
                <Section
                  title={`${diff.added.length} New Benefit${diff.added.length !== 1 ? 's' : ''}`}
                  color="green"
                  icon="+"
                >
                  {diff.added.map((b, i) => (
                    <DiffRow key={i} name={b.name} description={b.description} value={b.value} frequency={b.frequency} type="added" />
                  ))}
                </Section>
              )}

              {diff.removed.length > 0 && (
                <Section
                  title={`${diff.removed.length} Removed Benefit${diff.removed.length !== 1 ? 's' : ''}`}
                  color="red"
                  icon="−"
                >
                  {diff.removed.map((b) => (
                    <DiffRow key={b.id} name={b.name} description={b.description} value={b.value} frequency={b.frequency} type="removed" />
                  ))}
                </Section>
              )}

              {diff.changed.length > 0 && (
                <Section
                  title={`${diff.changed.length} Changed Benefit${diff.changed.length !== 1 ? 's' : ''}`}
                  color="amber"
                  icon="~"
                >
                  {diff.changed.map(({ before, after }, i) => (
                    <div key={i} className="rounded-md border border-amber-700/30 bg-amber-900/10 p-2.5 space-y-1">
                      <p className="text-xs font-medium text-amber-300">{before.name}</p>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-500 line-through">
                          {formatCurrency(before.value)}/{before.frequency === 'monthly' ? 'mo' : 'yr'}
                        </span>
                        <svg className="w-3 h-3 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="text-amber-300 font-medium">
                          {formatCurrency(after.value)}/{after.frequency === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      </div>
                    </div>
                  ))}
                </Section>
              )}

              {diff.unchanged.length > 0 && (
                <p className="text-xs text-gray-600 text-center">
                  {diff.unchanged.length} benefit{diff.unchanged.length !== 1 ? 's' : ''} unchanged
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-5 border-t border-[#2a2a2a] flex-shrink-0">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-sm text-gray-400 border border-[#2a2a2a] hover:border-[#3a3a3a] transition-colors"
          >
            {hasChanges ? 'Discard' : 'Close'}
          </button>
          {hasChanges && (
            <button
              onClick={onConfirm}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-amber-500 text-black hover:bg-amber-400 transition-colors"
            >
              Apply Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, color, icon, children }: {
  title: string;
  color: 'green' | 'red' | 'amber';
  icon: string;
  children: React.ReactNode;
}) {
  const colors = {
    green: 'text-green-400 bg-green-900/20 border-green-700/30',
    red: 'text-red-400 bg-red-900/20 border-red-700/30',
    amber: 'text-amber-400 bg-amber-900/20 border-amber-700/30',
  };
  return (
    <div>
      <div className={`flex items-center gap-2 text-xs font-semibold mb-2 px-2 py-1 rounded-md border w-fit ${colors[color]}`}>
        <span>{icon}</span>
        <span>{title}</span>
      </div>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function DiffRow({ name, description, value, frequency, type }: {
  name: string; description: string; value: number; frequency: string; type: 'added' | 'removed';
}) {
  const isAdded = type === 'added';
  return (
    <div className={`rounded-md p-2.5 border ${isAdded ? 'border-green-700/30 bg-green-900/10' : 'border-red-700/30 bg-red-900/10'}`}>
      <div className="flex items-center justify-between">
        <p className={`text-xs font-medium ${isAdded ? 'text-green-300' : 'text-red-300'}`}>{name}</p>
        {value > 0 && (
          <span className={`text-xs font-semibold ${isAdded ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(value)}/{frequency === 'monthly' ? 'mo' : 'yr'}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
  );
}

'use client';

import { Benefit } from '@/lib/types';
import { isBenefitUsed, getCurrentPeriod, formatCurrency } from '@/lib/utils';

interface Props {
  benefit: Benefit;
  onToggle: (benefitId: string, used: boolean) => void;
}

export function BenefitItem({ benefit, onToggle }: Props) {
  const used = isBenefitUsed(benefit);

  const freqLabel =
    benefit.frequency === 'monthly' ? '/mo' : benefit.frequency === 'annual' ? '/yr' : ' (one-time)';

  const usedEntry = used
    ? benefit.usage.find((u) => u.period === getCurrentPeriod(benefit.frequency))
    : null;

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
        used
          ? 'border-[#222] bg-[#111] opacity-55'
          : 'border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#3a3a3a]'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(benefit.id, !used)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          used
            ? 'bg-amber-500 border-amber-500'
            : 'border-[#444] bg-transparent hover:border-amber-400'
        }`}
        title={used ? 'Mark as unused' : 'Mark as used'}
      >
        {used && (
          <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium text-sm ${used ? 'line-through text-gray-500' : 'text-gray-100'}`}>
            {benefit.name}
          </span>
          {benefit.value > 0 && (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              used
                ? 'text-gray-500 bg-transparent border border-[#333]'
                : 'text-amber-400 bg-amber-900/20 border border-amber-700/30'
            }`}>
              {formatCurrency(benefit.value)}{freqLabel}
            </span>
          )}
        </div>
        <p className={`text-xs mt-0.5 ${used ? 'text-gray-600' : 'text-gray-400'}`}>
          {benefit.description}
        </p>
        {usedEntry && (
          <p className="text-[10px] text-gray-600 mt-1">
            Used {new Date(usedEntry.usedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  );
}

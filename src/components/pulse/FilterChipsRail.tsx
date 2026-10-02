import React from 'react';
import { usePulse } from '../../context/PulseContext';
import type { QuickFilterId } from '../../types/pulse';
import { SlidersHorizontal, Sparkles } from 'lucide-react';

interface QuickFilterOption {
  id: QuickFilterId;
  label: string;
  icon?: string;
}

const FILTER_OPTIONS: QuickFilterOption[] = [
  { id: 'NEAR_ME', label: 'Near Me', icon: '📍' },
  { id: 'TOP_RATED', label: 'Top Rated ★4.8+', icon: '⭐' },
  { id: 'OPEN_NOW', label: 'Live Tables Now', icon: '♠️' },
  { id: 'PREMIUM', label: 'High Roller VIP', icon: '💎' },
  { id: 'OFFERS', label: 'High Hand Bonuses', icon: '🎁' },
  { id: 'TRENDING', label: 'Hot Action PLO', icon: '🔥' },
  { id: 'NEW', label: 'RFID Smart Felt', icon: '⚡' },
  { id: 'UNDER_500', label: 'Mid Stakes (100/200)', icon: '🏷️' }
];

export const FilterChipsRail: React.FC = () => {
  const { activeFilterChip, setActiveFilterChip, setIsFilterSheetOpen, filters } = usePulse();

  const isCustomFilterActive = filters.pureVeg || filters.outdoorSeating || filters.openNow || filters.hasOffers;

  return (
    <div className="pulse-filter-chips-rail-wrapper">
      <div className="pulse-filter-chips-rail">
        {/* Filter Sheet Trigger Pill */}
        <button
          type="button"
          onClick={() => setIsFilterSheetOpen(true)}
          className={`pulse-filter-chip-btn filter-trigger ${isCustomFilterActive ? 'active' : ''}`}
        >
          <SlidersHorizontal size={13} />
          <span>Filters</span>
          {isCustomFilterActive && <span className="pulse-filter-active-dot" />}
        </button>

        {/* Quick Filter Chips */}
        {FILTER_OPTIONS.map(opt => {
          const isSelected = activeFilterChip === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveFilterChip(opt.id)}
              className={`pulse-filter-chip-btn ${isSelected ? 'active' : ''}`}
            >
              {opt.icon && <span className="pulse-filter-icon">{opt.icon}</span>}
              <span>{opt.label}</span>
              {isSelected && <Sparkles size={11} className="pulse-chip-sparkle" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

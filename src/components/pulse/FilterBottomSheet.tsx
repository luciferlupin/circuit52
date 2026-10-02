import React from 'react';
import { usePulse } from '../../context/PulseContext';
import { X, Check, Star } from 'lucide-react';

export const FilterBottomSheet: React.FC = () => {
  const {
    isFilterSheetOpen,
    setIsFilterSheetOpen,
    filters,
    setFilters,
    resetFilters,
    restaurants
  } = usePulse();

  if (!isFilterSheetOpen) return null;

  // Calculate matching items count
  const matchingCount = restaurants.filter(r => {
    if (filters.openNow && !r.isOpen) return false;
    if (filters.minRating && r.rating < filters.minRating) return false;
    if (filters.maxDistanceKm && r.distanceKm > filters.maxDistanceKm) return false;
    if (filters.hasOffers && !r.featuredOffer) return false;
    return true;
  }).length;

  return (
    <div className="pulse-modal-overlay" onClick={() => setIsFilterSheetOpen(false)}>
      <div className="pulse-filter-sheet" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="pulse-sheet-handle" />

        {/* Header */}
        <div className="pulse-filter-header">
          <div>
            <h3 className="pulse-filter-title">Filters</h3>
            <p className="pulse-filter-sub">Tailor your dining & experiences</p>
          </div>
          <button
            type="button"
            className="pulse-close-btn"
            onClick={() => setIsFilterSheetOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Filter Options */}
        <div className="pulse-filter-scroll-body">
          {/* Distance Slider */}
          <div className="pulse-filter-group">
            <div className="pulse-filter-group-header">
              <label>Maximum Distance</label>
              <span className="pulse-filter-val-badge">{filters.maxDistanceKm} km</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={filters.maxDistanceKm}
              onChange={e => setFilters(prev => ({ ...prev, maxDistanceKm: Number(e.target.value) }))}
              className="pulse-range-slider"
            />
            <div className="pulse-slider-labels">
              <span>1 km</span>
              <span>10 km</span>
              <span>20 km</span>
            </div>
          </div>

          {/* Rating Chips */}
          <div className="pulse-filter-group">
            <label className="pulse-filter-label">Minimum Rating</label>
            <div className="pulse-filter-chips-grid">
              {[4.5, 4.0, 3.5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  className={`pulse-fchip ${filters.minRating === rating ? 'active' : ''}`}
                  onClick={() => setFilters(prev => ({ ...prev, minRating: rating }))}
                >
                  <Star size={13} fill="#fbbf24" color="#fbbf24" />
                  <span>★ {rating}+ Rating</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Toggles */}
          <div className="pulse-filter-group">
            <label className="pulse-filter-label">Preferences & Highlights</label>
            <div className="pulse-filter-toggles-list">
              <label className="pulse-toggle-row">
                <div>
                  <div className="pulse-toggle-title">Open Now Only</div>
                  <div className="pulse-toggle-desc">Show only spots ready to welcome you right now</div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.openNow}
                  onChange={e => setFilters(prev => ({ ...prev, openNow: e.target.checked }))}
                  className="pulse-checkbox"
                />
              </label>

              <label className="pulse-toggle-row">
                <div>
                  <div className="pulse-toggle-title">Great Offers & Discounts</div>
                  <div className="pulse-toggle-desc">Venues with active Pulse Pay perks or bank offers</div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.hasOffers}
                  onChange={e => setFilters(prev => ({ ...prev, hasOffers: e.target.checked }))}
                  className="pulse-checkbox"
                />
              </label>

              <label className="pulse-toggle-row">
                <div>
                  <div className="pulse-toggle-title">Rooftop & Outdoor Seating</div>
                  <div className="pulse-toggle-desc">Terraces, open skies, and glasshouse gardens</div>
                </div>
                <input
                  type="checkbox"
                  checked={filters.outdoorSeating}
                  onChange={e => setFilters(prev => ({ ...prev, outdoorSeating: e.target.checked }))}
                  className="pulse-checkbox"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Sticky Actions Footer */}
        <div className="pulse-filter-footer">
          <button
            type="button"
            className="pulse-filter-clear-btn"
            onClick={resetFilters}
          >
            Clear All
          </button>
          <button
            type="button"
            className="pulse-primary-cta-btn"
            onClick={() => setIsFilterSheetOpen(false)}
          >
            <Check size={16} />
            <span>Show {matchingCount} Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};

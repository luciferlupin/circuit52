import React from 'react';
import { usePulse } from '../../context/PulseContext';
import { LOCATIONS } from '../../data/pulseData';
import { X, MapPin, CheckCircle2, Compass } from 'lucide-react';

export const LocationSelectorModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    currentLocation,
    setCurrentLocation
  } = usePulse();

  if (!isLocationModalOpen) return null;

  return (
    <div className="pulse-modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
      <div className="pulse-location-sheet" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="pulse-sheet-handle" />

        {/* Header */}
        <div className="pulse-location-sheet-header">
          <div>
            <h3 className="pulse-location-sheet-title">Select Location</h3>
            <p className="pulse-location-sheet-sub">Live poker clubs & tourneys near you</p>
          </div>
          <button
            type="button"
            className="pulse-close-btn"
            onClick={() => setIsLocationModalOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Location Auto-Detect Button */}
        <div
          className="pulse-detect-location-box"
          onClick={() => {
            setCurrentLocation(LOCATIONS[0]);
            setIsLocationModalOpen(false);
          }}
        >
          <div className="pulse-detect-icon-box">
            <Compass size={18} />
          </div>
          <div className="pulse-detect-meta">
            <span className="pulse-detect-title">Use Current GPS Location</span>
            <span className="pulse-detect-sub">Auto-verified: Indiranagar, Bengaluru</span>
          </div>
        </div>

        {/* Popular Metro Cities List */}
        <div className="pulse-cities-list">
          <span className="pulse-cities-group-label">POPULAR POKER HUBS</span>

          {LOCATIONS.map(loc => {
            const isSelected = currentLocation.id === loc.id;
            const clubCountBadge = loc.city === 'Bengaluru'
              ? '5 Live Clubs'
              : loc.city === 'Goa'
              ? '3 Offshore Casinos'
              : loc.city === 'Delhi NCR'
              ? '3 High Roller Lounges'
              : '4 World Series Venues';

            return (
              <div
                key={loc.id}
                className={`pulse-city-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setCurrentLocation(loc);
                  setIsLocationModalOpen(false);
                }}
              >
                <div className="pulse-city-info">
                  <div className="pulse-city-name-row">
                    <MapPin size={15} className="pulse-city-pin" />
                    <strong>{loc.name}</strong>
                    <span className="pulse-city-badge-chip">{clubCountBadge}</span>
                  </div>
                  <div className="pulse-city-spots">
                    {loc.city}, {loc.state} • {loc.popularSpots.slice(0, 2).join(', ')}
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle2 size={18} className="pulse-city-check" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

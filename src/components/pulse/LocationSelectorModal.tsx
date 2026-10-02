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
            <h3 className="pulse-location-sheet-title">Select Your City & Area</h3>
            <p className="pulse-location-sheet-sub">Discover live poker clubs, tournaments and felts near you</p>
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
        <div className="pulse-detect-location-box" onClick={() => alert('GPS location verified: Indiranagar, Bengaluru')}>
          <div className="pulse-detect-icon-box">
            <Compass size={18} />
          </div>
          <div className="pulse-detect-meta">
            <span className="pulse-detect-title">Use Current GPS Location</span>
            <span className="pulse-detect-sub">Accuracy within 25 meters</span>
          </div>
        </div>

        {/* Popular Metro Cities List */}
        <div className="pulse-cities-list">
          <span className="pulse-cities-group-label">POPULAR HUBS</span>

          {LOCATIONS.map(loc => {
            const isSelected = currentLocation.id === loc.id;

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
                    <span className="pulse-city-state">• {loc.city}, {loc.state}</span>
                  </div>
                  <div className="pulse-city-spots">
                    Popular: {loc.popularSpots.join(', ')}
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

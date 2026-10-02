import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import { NotificationModal } from './NotificationModal';
import {
  MapPin,
  ChevronDown,
  Bell,
  Search,
  Mic,
  SlidersHorizontal
} from 'lucide-react';

export const PulseHeader: React.FC = () => {
  const {
    currentLocation,
    setIsLocationModalOpen,
    setIsSearchModalOpen,
    setIsFilterSheetOpen,
    setActiveTab,
    bookings
  } = usePulse();

  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const upcomingCount = bookings.filter(b => b.status === 'UPCOMING').length;

  return (
    <header className="pulse-header">
      {/* Top Location & Actions Row */}
      <div className="pulse-header-top">
        {/* Location Dropdown */}
        <div
          className="pulse-location-btn"
          onClick={() => setIsLocationModalOpen(true)}
          title="Change location"
        >
          <div className="pulse-location-icon-box">
            <MapPin size={15} />
          </div>
          <div className="pulse-location-text">
            <div className="pulse-location-title-row">
              <span className="pulse-location-title">{currentLocation.name}</span>
              <ChevronDown size={14} className="pulse-chevron" />
            </div>
            <span className="pulse-location-sub">
              {currentLocation.city}, {currentLocation.state}
            </span>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="pulse-header-actions">
          {/* Notification / Alert Icon */}
          <button
            className="pulse-icon-btn"
            onClick={() => setIsNotifOpen(true)}
            title="Live Table Notifications & Alerts"
          >
            <Bell size={18} />
            <span className="pulse-badge-dot">{upcomingCount > 0 ? upcomingCount : 2}</span>
          </button>

          {/* User Profile Avatar */}
          <div
            className="pulse-avatar-btn"
            onClick={() => setActiveTab('PROFILE')}
            title="User Profile"
          >
            <span>AM</span>
          </div>
        </div>
      </div>

      {/* Large Premium Search Bar */}
      <div className="pulse-search-container">
        <div
          className="pulse-search-bar"
          onClick={() => setIsSearchModalOpen(true)}
        >
          <Search size={18} className="pulse-search-icon" />
          <span className="pulse-search-placeholder">
            Search clubs, stakes, tourneys...
          </span>
          <div className="pulse-search-end-actions">
            <button
              type="button"
              className="pulse-mic-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsSearchModalOpen(true);
              }}
              title="Voice Search"
            >
              <Mic size={16} />
            </button>
            <div className="pulse-search-divider" />
            <button
              type="button"
              className="pulse-filter-toggle-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsFilterSheetOpen(true);
              }}
              title="Filter by Stakes, Game Type, Amenities"
            >
              <SlidersHorizontal size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Live Notifications Modal */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </header>
  );
};

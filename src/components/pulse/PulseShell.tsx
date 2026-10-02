import React from 'react';
import { usePulse } from '../../context/PulseContext';
import { PulseHeader } from './PulseHeader';
import { CategoryRail } from './CategoryRail';
import { HeroCarousel } from './HeroCarousel';
import { FilterChipsRail } from './FilterChipsRail';
import { RestaurantFeed } from './RestaurantFeed';
import { MoviesFeed } from './MoviesFeed';
import { EventsFeed } from './EventsFeed';
import { BookingsView } from './BookingsView';
import { SavedView } from './SavedView';
import { ProfileView } from './ProfileView';
import { OffersView } from './OffersView';

// Modals & Bottom Sheets
import { RestaurantDetailModal } from './RestaurantDetailModal';
import { TableBookingSheet } from './TableBookingSheet';
import { MovieDetailModal } from './MovieDetailModal';
import { SeatSelectionSheet } from './SeatSelectionSheet';
import { EventDetailModal } from './EventDetailModal';
import { UniversalSearchModal } from './UniversalSearchModal';
import { FilterBottomSheet } from './FilterBottomSheet';
import { CheckoutSheet } from './CheckoutSheet';
import { DigitalTicketModal } from './DigitalTicketModal';
import { BookingSuccessModal } from './BookingSuccessModal';
import { LocationSelectorModal } from './LocationSelectorModal';
import { FloatingBottomNav } from './FloatingBottomNav';

import { Smartphone, Monitor } from 'lucide-react';

export const PulseShell: React.FC = () => {
  const {
    activeTab,
    activeCategory,
    isPhoneFrameMode,
    setIsPhoneFrameMode
  } = usePulse();

  return (
    <div className={`pulse-viewport-container ${isPhoneFrameMode ? 'phone-mode' : 'fluid-mode'}`}>
      {/* Desktop Mode Switcher Floating Pill */}
      <div className="pulse-desktop-mode-switcher">
        <button
          type="button"
          className="pulse-mode-toggle-btn"
          onClick={() => setIsPhoneFrameMode(prev => !prev)}
          title="Toggle between iPhone 16 Pro mockup and full width layout"
        >
          {isPhoneFrameMode ? (
            <>
              <Monitor size={14} />
              <span>Full Screen</span>
            </>
          ) : (
            <>
              <Smartphone size={14} />
              <span>iPhone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Main Phone Shell Wrapper */}
      <div className={`pulse-phone-shell ${isPhoneFrameMode ? 'framed' : 'edge-to-edge'}`}>
        {/* Dynamic Island Status Bar */}
        <div className="pulse-status-bar">
          <span className="pulse-time-clock">9:41</span>
          {/* Dynamic Island Pill */}
          <div className="pulse-dynamic-island">
            <span className="pulse-dynamic-dot" />
            <span className="pulse-dynamic-label">PULSE LIVE</span>
          </div>
          <div className="pulse-status-icons">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="pulse-scrollable-canvas">
          {/* TAB 1: HOME FEED */}
          {activeTab === 'HOME' && (
            <div className="pulse-home-view">
              <PulseHeader />
              <CategoryRail />
              <HeroCarousel />
              <FilterChipsRail />

              {/* Dynamic Content Under Selected Category */}
              <div className="pulse-category-content-container">
                {activeCategory === 'DINING' && <RestaurantFeed />}
                {activeCategory === 'MOVIES' && <MoviesFeed />}
                {activeCategory === 'EVENTS' && <EventsFeed />}
                {activeCategory === 'NIGHTLIFE' && (
                  <>
                    <RestaurantFeed />
                    <EventsFeed />
                  </>
                )}
                {activeCategory === 'ACTIVITIES' && <EventsFeed />}
                {activeCategory === 'EXPERIENCES' && <EventsFeed />}
              </div>
            </div>
          )}

          {/* TAB 2: EXPLORE (All Categories Combined) */}
          {activeTab === 'EXPLORE' && (
            <div className="pulse-explore-view">
              <PulseHeader />
              <OffersView />
            </div>
          )}

          {/* TAB 3: BOOKINGS */}
          {activeTab === 'BOOKINGS' && <BookingsView />}

          {/* TAB 4: SAVED */}
          {activeTab === 'SAVED' && <SavedView />}

          {/* TAB 5: PROFILE */}
          {activeTab === 'PROFILE' && <ProfileView />}
        </div>

        {/* Floating Bottom Tab Bar */}
        <FloatingBottomNav />

        {/* Global Sheets & Modals */}
        <RestaurantDetailModal />
        <TableBookingSheet />
        <MovieDetailModal />
        <SeatSelectionSheet />
        <EventDetailModal />
        <UniversalSearchModal />
        <FilterBottomSheet />
        <CheckoutSheet />
        <DigitalTicketModal />
        <BookingSuccessModal />
        <LocationSelectorModal />
      </div>
    </div>
  );
};

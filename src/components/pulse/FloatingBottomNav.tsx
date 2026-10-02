import React from 'react';
import { usePulse } from '../../context/PulseContext';
import type { BottomTab } from '../../types/pulse';
import {
  Flame,
  Compass,
  Ticket,
  Bookmark,
  User
} from 'lucide-react';

interface TabItem {
  id: BottomTab;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const FloatingBottomNav: React.FC = () => {
  const { activeTab, setActiveTab, bookings, savedItemIds } = usePulse();

  const upcomingCount = bookings.filter(b => b.status === 'UPCOMING').length;

  const tabs: TabItem[] = [
    {
      id: 'HOME',
      label: 'Home',
      icon: <Flame size={19} />
    },
    {
      id: 'EXPLORE',
      label: 'Explore',
      icon: <Compass size={19} />
    },
    {
      id: 'BOOKINGS',
      label: 'Bookings',
      icon: <Ticket size={19} />,
      badge: upcomingCount > 0 ? upcomingCount : undefined
    },
    {
      id: 'SAVED',
      label: 'Saved',
      icon: <Bookmark size={19} />,
      badge: savedItemIds.length > 0 ? savedItemIds.length : undefined
    },
    {
      id: 'PROFILE',
      label: 'Profile',
      icon: <User size={19} />
    }
  ];

  return (
    <nav className="pulse-floating-bottom-nav">
      <div className="pulse-nav-island">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={`pulse-nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-label={tab.label}
            >
              <div className="pulse-nav-icon-wrapper">
                {tab.icon}
                {tab.badge !== undefined && (
                  <span className="pulse-nav-badge">{tab.badge}</span>
                )}
              </div>
              <span className="pulse-nav-label">{tab.label}</span>
              {isActive && <div className="pulse-nav-indicator-pill" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

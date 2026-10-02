import React from 'react';
import { usePulse } from '../../context/PulseContext';
import type { PrimaryCategory } from '../../types/pulse';

interface CategoryItem {
  id: PrimaryCategory;
  name: string;
  tagline: string;
  badge?: string;
  icon: string;
  gradient: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'DINING',
    name: 'Dining',
    tagline: 'Book Tables',
    icon: '🍽️',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #0a1638 100%)'
  },
  {
    id: 'MOVIES',
    name: 'Movies',
    tagline: 'IMAX & 4DX',
    badge: 'NEW',
    icon: '🎬',
    gradient: 'linear-gradient(135deg, #1d4ed8 0%, #050d24 100%)'
  },
  {
    id: 'EVENTS',
    name: 'Events',
    tagline: 'Live Gigs',
    badge: 'HOT',
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #0c1c4d 100%)'
  },
  {
    id: 'NIGHTLIFE',
    name: 'Nightlife',
    tagline: 'Rooftops & Bars',
    icon: '🍸',
    gradient: 'linear-gradient(135deg, #1e40af 0%, #030816 100%)'
  },
  {
    id: 'ACTIVITIES',
    name: 'Activities',
    tagline: 'Workshops & Sports',
    icon: '🎯',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #060e22 100%)'
  },
  {
    id: 'EXPERIENCES',
    name: 'Experiences',
    tagline: 'Yachting & Spas',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #2563eb 0%, #081330 100%)'
  }
];

export const CategoryRail: React.FC = () => {
  const { activeCategory, setActiveCategory } = usePulse();

  return (
    <div className="pulse-category-rail-container">
      <div className="pulse-category-rail">
        {CATEGORIES.map(cat => {
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`pulse-category-card ${isSelected ? 'active' : ''}`}
            >
              {/* Category Icon Bubble with Gradient Glow */}
              <div
                className="pulse-category-icon-bubble"
                style={{ background: cat.gradient }}
              >
                <span className="pulse-category-emoji">{cat.icon}</span>
                {cat.badge && (
                  <span className="pulse-category-pill-badge">{cat.badge}</span>
                )}
              </div>

              {/* Title & Tagline */}
              <div className="pulse-category-meta">
                <span className="pulse-category-name">{cat.name}</span>
                <span className="pulse-category-tagline">{cat.tagline}</span>
              </div>

              {/* Active Indicator Bar */}
              {isSelected && <div className="pulse-category-active-bar" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

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
    name: 'Cash Games',
    tagline: 'NLH & PLO',
    badge: 'LIVE',
    icon: '♠️',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
  },
  {
    id: 'MOVIES',
    name: 'Tourneys',
    tagline: 'Daily Majors',
    badge: 'HOT',
    icon: '🏆',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
  },
  {
    id: 'EVENTS',
    name: 'Series Gigs',
    tagline: 'Satellites',
    badge: 'NEW',
    icon: '⚡',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)'
  },
  {
    id: 'NIGHTLIFE',
    name: 'VIP Salons',
    tagline: 'High Limit',
    badge: 'VIP',
    icon: '💎',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)'
  },
  {
    id: 'ACTIVITIES',
    name: 'PLO & Mixed',
    tagline: '5-Card Omaha',
    icon: '🃏',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
  },
  {
    id: 'EXPERIENCES',
    name: 'Private Felt',
    tagline: 'VIP Sessions',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
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

import React from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  Ticket,
  CreditCard,
  Bookmark,
  Tag,
  Gift,
  Bell,
  HelpCircle,
  Settings,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { setActiveTab, bookings, savedItemIds, offers } = usePulse();

  const menuRows = [
    {
      id: 'bookings',
      label: 'My Bookings & Passes',
      icon: <Ticket size={18} style={{ color: '#3b82f6' }} />,
      badge: `${bookings.filter(b => b.status === 'UPCOMING').length} active`,
      onClick: () => setActiveTab('BOOKINGS')
    },
    {
      id: 'saved',
      label: 'Saved Places & Wishlist',
      icon: <Bookmark size={18} style={{ color: '#60a5fa' }} />,
      badge: `${savedItemIds.length} saved`,
      onClick: () => setActiveTab('SAVED')
    },
    {
      id: 'payments',
      label: 'Payments & Pulse Pay',
      icon: <CreditCard size={18} style={{ color: '#2563eb' }} />,
      sub: 'UPI, saved cards & wallets',
      onClick: () => alert('Payments settings: Default UPI linked (GPay)')
    },
    {
      id: 'offers',
      label: 'Exclusive Offers & Vouchers',
      icon: <Tag size={18} style={{ color: '#93c5fd' }} />,
      badge: `${offers.length} active`,
      onClick: () => alert('View active coupons in checkout')
    },
    {
      id: 'gift',
      label: 'Gift Cards & Pulse Credits',
      icon: <Gift size={18} style={{ color: '#3b82f6' }} />,
      sub: 'Balance: ₹4,500',
      onClick: () => alert('Gift card balance: ₹4,500')
    },
    {
      id: 'notifications',
      label: 'Notification Preferences',
      icon: <Bell size={18} style={{ color: '#60a5fa' }} />,
      onClick: () => alert('Instant booking and seat offer notifications are enabled')
    },
    {
      id: 'help',
      label: '24/7 Concierge & Support',
      icon: <HelpCircle size={18} style={{ color: '#2563eb' }} />,
      onClick: () => alert('Pulse Concierge support is active. Connecting you with our priority agent...')
    },
    {
      id: 'settings',
      label: 'Account Settings & Privacy',
      icon: <Settings size={18} style={{ color: '#64748b' }} />,
      onClick: () => alert('Settings: Dark theme active, biometric login enabled')
    }
  ];

  return (
    <div className="pulse-profile-page">
      {/* Header Profile Identity Card */}
      <div className="pulse-profile-hero-card">
        <div className="pulse-profile-avatar-large">
          <span>AM</span>
          <div className="pulse-profile-verified-badge">
            <ShieldCheck size={14} />
          </div>
        </div>

        <div className="pulse-profile-meta">
          <h2 className="pulse-profile-name">Alex Morgan</h2>
          <div className="pulse-profile-contact">+91 98450 19284 • alex.morgan@pulse.city</div>
          <div className="pulse-profile-tier-pill">
            <Sparkles size={12} />
            <span>PULSE BLACK VIP MEMBER</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="pulse-profile-stats-grid">
        <div className="pulse-stat-card" onClick={() => setActiveTab('BOOKINGS')}>
          <span className="pulse-stat-num">{bookings.length}</span>
          <span className="pulse-stat-label">Total Bookings</span>
        </div>
        <div className="pulse-stat-card" onClick={() => setActiveTab('SAVED')}>
          <span className="pulse-stat-num">{savedItemIds.length}</span>
          <span className="pulse-stat-label">Saved Spots</span>
        </div>
        <div className="pulse-stat-card">
          <span className="pulse-stat-num" style={{ color: '#60a5fa' }}>₹1,450</span>
          <span className="pulse-stat-label">Total Saved</span>
        </div>
      </div>

      {/* Clean Menu Rows */}
      <div className="pulse-profile-menu-group">
        {menuRows.map(row => (
          <div
            key={row.id}
            className="pulse-profile-row-item"
            onClick={row.onClick}
          >
            <div className="pulse-profile-row-left">
              <div className="pulse-profile-icon-box">{row.icon}</div>
              <div>
                <div className="pulse-profile-row-label">{row.label}</div>
                {row.sub && <div className="pulse-profile-row-sub">{row.sub}</div>}
              </div>
            </div>

            <div className="pulse-profile-row-right">
              {row.badge && <span className="pulse-profile-badge">{row.badge}</span>}
              <ChevronRight size={16} className="pulse-profile-arrow" />
            </div>
          </div>
        ))}
      </div>

      {/* Version Note */}
      <div className="pulse-version-note">
        Pulse City Experience Engine v3.4.0 (Production Build)
      </div>
    </div>
  );
};

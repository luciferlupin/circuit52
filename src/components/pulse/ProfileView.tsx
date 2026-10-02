import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import { SettingsModal } from './SettingsModal';
import {
  Ticket,
  CreditCard,
  Bookmark,
  Tag,
  Bell,
  HelpCircle,
  Settings,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Flame,
  Award,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  progress: string;
  isUnlocked: boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ace-high',
    icon: '♠️',
    title: 'Ace High Clubber',
    desc: 'Played in 5 distinct licensed poker clubs',
    progress: '5 / 5',
    isUnlocked: true
  },
  {
    id: 'high-roller',
    icon: '💎',
    title: 'High Roller Elite',
    desc: 'Single session buy-in of ₹50,000 or greater',
    progress: 'Unlocked',
    isUnlocked: true
  },
  {
    id: 'smart-felt',
    icon: '⚡',
    title: 'RFID Stream Master',
    desc: 'Completed 10 sessions on RFID smart tables',
    progress: '8 / 10',
    isUnlocked: false
  },
  {
    id: 'final-table',
    icon: '🏆',
    title: 'Final Table Hero',
    desc: 'Made the final table in a Circuit 52 Major',
    progress: 'Top 3 Finish',
    isUnlocked: true
  },
  {
    id: 'plo-action',
    icon: '🃏',
    title: 'Omaha Bomb Specialist',
    desc: 'Won 25 double-board bomb pot hands',
    progress: '19 / 25',
    isUnlocked: false
  }
];

export const ProfileView: React.FC = () => {
  const { setActiveTab, bookings, savedItemIds, offers } = usePulse();
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [hasRolledChip, setHasRolledChip] = useState<boolean>(false);
  const [chipReward, setChipReward] = useState<string>('');

  const handleRollChip = () => {
    if (hasRolledChip) return;
    const rewards = [
      '₹500 Tournament Reload Match + 250 XP',
      'Complimentary Craft Cocktail at Wynn Felt',
      'VIP Valet Pass + 150 High-Roller Points',
      'Double XP on tonight’s Cash Game Session'
    ];
    const picked = rewards[Math.floor(Math.random() * rewards.length)];
    setChipReward(picked);
    setHasRolledChip(true);
  };

  const menuRows = [
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: <Ticket size={17} style={{ color: '#ffffff' }} />,
      bgColor: '#3b82f6',
      badge: `${bookings.filter(b => b.status === 'UPCOMING').length} active`,
      onClick: () => setActiveTab('BOOKINGS')
    },
    {
      id: 'saved',
      label: 'Saved Clubs & Tourneys',
      icon: <Bookmark size={17} style={{ color: '#ffffff' }} />,
      bgColor: '#0ea5e9',
      badge: `${savedItemIds.length} saved`,
      onClick: () => setActiveTab('SAVED')
    },
    {
      id: 'payments',
      label: 'Vault & Table Credits',
      icon: <CreditCard size={17} style={{ color: '#ffffff' }} />,
      bgColor: '#10b981',
      sub: '₹25,000 balance • UPI active',
      onClick: () => alert('Vault Balance: ₹25,000 High-Roller Credit • UPI auto-settle active')
    },
    {
      id: 'offers',
      label: 'Exclusive Club Perks',
      icon: <Tag size={17} style={{ color: '#ffffff' }} />,
      bgColor: '#f59e0b',
      badge: `${offers.length} offers`,
      onClick: () => alert(`Active Offers: ${offers.map(o => o.code).join(', ')}`)
    },
    {
      id: 'notifications',
      label: 'Notifications & Alerts',
      icon: <Bell size={17} style={{ color: '#ffffff' }} />,
      bgColor: '#f43f5e',
      sub: 'Waitlist alerts & seat calls',
      onClick: () => setIsSettingsOpen(true)
    },
    {
      id: 'settings',
      label: 'Privacy & Security',
      icon: <Settings size={17} style={{ color: '#ffffff' }} />,
      bgColor: '#8b5cf6',
      sub: 'Incognito stream • Face ID',
      onClick: () => setIsSettingsOpen(true)
    },
    {
      id: 'help',
      label: 'VIP Floor Concierge',
      icon: <HelpCircle size={17} style={{ color: '#ffffff' }} />,
      bgColor: '#6366f1',
      sub: '24/7 dedicated floor host',
      onClick: () => alert('Circuit 52 VIP Concierge: Connecting you with Floor Host on Duty...')
    }
  ];

  return (
    <div className="pulse-profile-page">
      {/* Top Header Row with Settings Action */}
      <div className="pulse-profile-top-bar">
        <div>
          <h2 className="pulse-page-title">VIP Player Profile</h2>
          <p className="pulse-page-sub">Circuit 52 Black Card Status & Club Privileges</p>
        </div>
        <button
          type="button"
          className="pulse-profile-settings-btn"
          onClick={() => setIsSettingsOpen(true)}
          aria-label="Open Settings"
          title="Club Preferences & House Rules"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Header Profile Identity Card */}
      <div className="pulse-profile-hero-card">
        <div className="pulse-profile-avatar-large">
          <span>AM</span>
          <div className="pulse-profile-verified-badge">
            <ShieldCheck size={14} />
          </div>
        </div>

        <div className="pulse-profile-meta">
          <h2 className="pulse-profile-name">Alex "Ace" Morgan</h2>
          <div className="pulse-profile-contact">+91 98450 19284 • alex.morgan@circuit52.club</div>
          <div className="pulse-profile-tier-pill">
            <Sparkles size={12} />
            <span>CIRCUIT 52 VIP BLACK CARD</span>
          </div>
        </div>
      </div>

      {/* GAMIFICATION 1: Level Progression & XP Bar */}
      <div className="pulse-gamification-card">
        <div className="pulse-gamify-header">
          <div className="pulse-gh-left">
            <div className="pulse-level-badge">
              <span>LVL</span>
              <strong>24</strong>
            </div>
            <div>
              <div className="pulse-tier-title">Black Card Master</div>
              <div className="pulse-xp-text">8,450 / 10,000 XP</div>
            </div>
          </div>
          <span className="pulse-xp-to-go">+1,550 XP to Grandmaster</span>
        </div>

        {/* Glowing XP Progress Track */}
        <div className="pulse-xp-track">
          <div className="pulse-xp-fill" style={{ width: '84.5%' }}>
            <div className="pulse-xp-shimmer" />
          </div>
        </div>

        <div className="pulse-gamify-perk">
          <Sparkles size={12} color="#f59e0b" />
          <span>Perk: Floor Concierge & 0% Rake on First 100 Hands</span>
        </div>
      </div>

      {/* GAMIFICATION 2: 7-Day Table Streak Tracker */}
      <div className="pulse-streak-card">
        <div className="pulse-streak-header">
          <div className="pulse-streak-left">
            <Flame size={20} className="pulse-streak-flame" style={{ color: '#f59e0b' }} />
            <div>
              <div className="pulse-streak-title">7-Day Table Streak</div>
              <div className="pulse-streak-sub">+350 Reload Credits Earned</div>
            </div>
          </div>
          <span className="pulse-streak-badge">ACTIVE</span>
        </div>

        {/* 7 Days Dots */}
        <div className="pulse-streak-days-row">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
            <div key={day} className={`pulse-streak-day-box ${idx <= 6 ? 'completed' : ''} ${idx === 6 ? 'today' : ''}`}>
              <span className="pulse-s-day-name">{day}</span>
              <div className="pulse-s-dot">
                <CheckCircle2 size={12} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* GAMIFICATION 3: Interactive Daily Lucky Chip Roll */}
      <div className="pulse-mystery-chip-card">
        <div className="pulse-mc-top">
          <div className="pulse-mc-icon-box">
            <Award size={22} color="#60a5fa" />
          </div>
          <div>
            <h4 className="pulse-mc-title">Daily High-Roller Mystery Chip</h4>
            <p className="pulse-mc-sub">Roll once daily for instant tournament reloads and VIP perks</p>
          </div>
        </div>

        {hasRolledChip ? (
          <div className="pulse-mc-reward-revealed">
            <Sparkles size={18} className="pulse-reward-sparkle" />
            <div>
              <div className="pulse-reward-title">CLAIMED TODAY</div>
              <div className="pulse-reward-val">{chipReward}</div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="pulse-roll-chip-btn"
            onClick={handleRollChip}
          >
            <Sparkles size={15} />
            <span>Roll Daily Lucky Chip</span>
          </button>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="pulse-profile-stats-grid">
        <div className="pulse-stat-card" onClick={() => setActiveTab('BOOKINGS')}>
          <span className="pulse-stat-num">{bookings.length}</span>
          <span className="pulse-stat-label">Table Passes</span>
        </div>
        <div className="pulse-stat-card" onClick={() => setActiveTab('SAVED')}>
          <span className="pulse-stat-num">{savedItemIds.length}</span>
          <span className="pulse-stat-label">Saved Clubs</span>
        </div>
        <div className="pulse-stat-card">
          <span className="pulse-stat-num" style={{ color: '#60a5fa' }}>₹25,000</span>
          <span className="pulse-stat-label">Vault Balance</span>
        </div>
      </div>

      {/* GAMIFICATION 4: Badges & Achievements Showcase */}
      <div className="pulse-achievements-section">
        <div className="pulse-section-header">
          <h4 className="pulse-detail-section-title">Badges & Milestones</h4>
          <span className="pulse-badge-count-text">3 / 5 Unlocked</span>
        </div>

        <div className="pulse-achievements-carousel">
          {ACHIEVEMENTS.map(ach => (
            <div key={ach.id} className={`pulse-achievement-card ${ach.isUnlocked ? 'unlocked' : 'locked'}`}>
              <div className="pulse-ach-icon-circle">
                <span>{ach.icon}</span>
                {!ach.isUnlocked && <Lock size={12} className="pulse-ach-lock" />}
              </div>
              <div className="pulse-ach-name">{ach.title}</div>
              <div className="pulse-ach-desc">{ach.desc}</div>
              <div className="pulse-ach-progress-pill">{ach.progress}</div>
            </div>
          ))}
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
              <div className="pulse-profile-icon-box" style={{ background: row.bgColor, borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {row.icon}
              </div>
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

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Version Note */}
      <div className="pulse-version-note">
        Circuit 52 Mobile Operating System v2.4.0 (Production Build)
      </div>
    </div>
  );
};

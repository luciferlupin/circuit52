import React from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  X,
  Bell,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Flame,
  Award
} from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  type: 'SEAT_READY' | 'TOURNAMENT' | 'STREAK' | 'BONUS';
  title: string;
  message: string;
  timeAgo: string;
  isUnread: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const { setActiveTab, setActiveCategory, setSelectedRestaurant, restaurants } = usePulse();

  if (!isOpen) return null;

  const notifications: NotificationItem[] = [
    {
      id: 'notif-1',
      type: 'SEAT_READY',
      title: 'Table 2 Seat Available • Wynn Grand',
      message: 'A seat has opened at Table 2 (₹200/₹500 PLO-5). 180s priority hold is active for you.',
      timeAgo: 'Just now',
      isUnread: true,
      actionLabel: 'View Table',
      onAction: () => {
        onClose();
        setSelectedRestaurant(restaurants[0]);
      }
    },
    {
      id: 'notif-2',
      type: 'STREAK',
      title: '7-Day Table Streak Maintained! 🔥',
      message: 'You have earned +350 High Roller Reload Credits for your 7th consecutive day at Circuit 52 clubs.',
      timeAgo: '2 hours ago',
      isUnread: true,
      actionLabel: 'View Profile',
      onAction: () => {
        onClose();
        setActiveTab('PROFILE');
      }
    },
    {
      id: 'notif-3',
      type: 'TOURNAMENT',
      title: 'Aria ₹50L GTD Championship',
      message: 'Late registration flight closing in 20 minutes. 14 seats remaining on Flight 1B.',
      timeAgo: '4 hours ago',
      isUnread: false,
      actionLabel: 'Browse Tourneys',
      onAction: () => {
        onClose();
        setActiveCategory('MOVIES');
        setActiveTab('HOME');
      }
    },
    {
      id: 'notif-4',
      type: 'BONUS',
      title: 'VIP Black Card Reload Bonus',
      message: '100% Reload Bonus Match up to ₹10,000 has been credited to your Circuit 52 Vault balance.',
      timeAgo: 'Yesterday',
      isUnread: false
    }
  ];

  return (
    <div className="pulse-modal-overlay" onClick={onClose}>
      <div className="pulse-notifications-sheet" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="pulse-sheet-handle" />

        {/* Header */}
        <div className="pulse-notifications-header">
          <div className="pulse-nh-left">
            <Bell size={18} className="pulse-nh-icon" />
            <div>
              <h3 className="pulse-notifications-title">Live Table Notifications</h3>
              <span className="pulse-notifications-sub">Seat alerts, waitlists and club bonuses</span>
            </div>
          </div>
          <button type="button" className="pulse-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="pulse-notifications-scroll-body">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`pulse-notif-item ${n.isUnread ? 'unread' : ''}`}
              onClick={n.onAction}
            >
              <div className="pulse-notif-icon-col">
                {n.type === 'SEAT_READY' && (
                  <div className="pulse-ni-bubble green">
                    <Sparkles size={16} />
                  </div>
                )}
                {n.type === 'STREAK' && (
                  <div className="pulse-ni-bubble flame">
                    <Flame size={16} />
                  </div>
                )}
                {n.type === 'TOURNAMENT' && (
                  <div className="pulse-ni-bubble blue">
                    <Award size={16} />
                  </div>
                )}
                {n.type === 'BONUS' && (
                  <div className="pulse-ni-bubble gold">
                    <CheckCircle2 size={16} />
                  </div>
                )}
              </div>

              <div className="pulse-notif-content-col">
                <div className="pulse-notif-title-row">
                  <span className="pulse-notif-title">{n.title}</span>
                  <span className="pulse-notif-time">{n.timeAgo}</span>
                </div>
                <p className="pulse-notif-msg">{n.message}</p>

                {n.actionLabel && (
                  <div className="pulse-notif-action-row">
                    <span className="pulse-notif-action-text">{n.actionLabel}</span>
                    <ChevronRight size={13} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pulse-notifications-footer">
          <button
            type="button"
            className="pulse-notif-clear-btn"
            onClick={() => alert('All notifications marked as read')}
          >
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
};

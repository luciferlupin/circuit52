import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  Calendar,
  Ticket,
  MapPin,
  RotateCcw,
  XCircle,
  Sparkles
} from 'lucide-react';

export const BookingsView: React.FC = () => {
  const { bookings, setActiveTicket, cancelBooking, setActiveTab } = usePulse();
  const [filterStatus, setFilterStatus] = useState<'UPCOMING' | 'PAST' | 'CANCELLED'>('UPCOMING');

  const filtered = bookings.filter(b => b.status === filterStatus);

  return (
    <div className="pulse-bookings-page">
      {/* Top Header */}
      <div className="pulse-page-header">
        <h2 className="pulse-page-title">My Bookings</h2>
        <p className="pulse-page-sub">Tickets, table reservations and digital admission passes</p>
      </div>

      {/* Status Segment Tabs */}
      <div className="pulse-segmented-tabs">
        {(['UPCOMING', 'PAST', 'CANCELLED'] as const).map(status => {
          const count = bookings.filter(b => b.status === status).length;
          return (
            <button
              key={status}
              type="button"
              className={`pulse-seg-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              <span>{status === 'UPCOMING' ? 'Upcoming' : status === 'PAST' ? 'Past' : 'Cancelled'}</span>
              <span className="pulse-seg-count">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Bookings List */}
      <div className="pulse-bookings-list">
        {filtered.length === 0 ? (
          <div className="pulse-empty-state-card">
            <Ticket size={36} className="pulse-empty-icon" />
            <h4>No {filterStatus.toLowerCase()} bookings found</h4>
            <p>Ready to discover something extraordinary in your city?</p>
            <button
              type="button"
              className="pulse-primary-cta-btn"
              onClick={() => setActiveTab('HOME')}
            >
              <Sparkles size={15} />
              <span>Explore Top Picks</span>
            </button>
          </div>
        ) : (
          filtered.map(booking => (
            <div key={booking.id} className="pulse-booking-ticket-card">
              {/* Card Top */}
              <div className="pulse-btc-top-row">
                <img src={booking.imageUrl} alt={booking.title} className="pulse-btc-thumb" />
                <div className="pulse-btc-info">
                  <div className="pulse-btc-type-row">
                    <span className="pulse-btc-type-badge">{booking.type}</span>
                    <span className={`pulse-btc-status-pill ${booking.status.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="pulse-btc-title">{booking.title}</h3>
                  <div className="pulse-btc-venue">{booking.venue}</div>
                </div>
              </div>

              {/* Schedule Info Matrix */}
              <div className="pulse-btc-meta-matrix">
                <div>
                  <span className="pulse-btc-meta-label">DATE & TIME</span>
                  <div className="pulse-btc-meta-val">
                    <Calendar size={13} />
                    <span>{booking.date} • {booking.time}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="pulse-btc-meta-label">ALLOCATION</span>
                  <div className="pulse-btc-meta-val">
                    <span>{booking.details.split('•')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Booking Code Bar */}
              <div className="pulse-btc-code-bar">
                <span>Pass Code: <strong className="mono">{booking.bookingCode}</strong></span>
                {booking.totalAmount > 0 ? (
                  <span className="pulse-btc-amount">Paid: ₹{booking.totalAmount.toLocaleString()}</span>
                ) : (
                  <span className="pulse-btc-amount free">Free Reservation</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pulse-btc-actions-row">
                <button
                  type="button"
                  className="pulse-btc-action-btn primary"
                  onClick={() => setActiveTicket(booking)}
                >
                  <Ticket size={14} />
                  <span>View Pass</span>
                </button>

                <button
                  type="button"
                  className="pulse-btc-action-btn"
                  onClick={() => alert(`Directions to: ${booking.venue}`)}
                >
                  <MapPin size={14} />
                  <span>Directions</span>
                </button>

                {booking.status === 'UPCOMING' && (
                  <button
                    type="button"
                    className="pulse-btc-action-btn danger"
                    onClick={() => {
                      if (confirm(`Cancel reservation for ${booking.title}?`)) {
                        cancelBooking(booking.id);
                      }
                    }}
                  >
                    <XCircle size={14} />
                    <span>Cancel</span>
                  </button>
                )}

                {booking.status !== 'UPCOMING' && (
                  <button
                    type="button"
                    className="pulse-btc-action-btn"
                    onClick={() => setActiveTab('HOME')}
                  >
                    <RotateCcw size={14} />
                    <span>Rebook</span>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

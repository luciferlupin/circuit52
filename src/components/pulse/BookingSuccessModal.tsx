import React from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  CheckCircle2,
  Calendar,
  Ticket,
  MapPin,
  Sparkles
} from 'lucide-react';

export const BookingSuccessModal: React.FC = () => {
  const {
    latestSuccessBooking,
    clearSuccess,
    setActiveTicket
  } = usePulse();

  if (!latestSuccessBooking) return null;

  return (
    <div className="pulse-modal-overlay celebration" onClick={clearSuccess}>
      <div className="pulse-success-modal-card" onClick={e => e.stopPropagation()}>
        {/* Animated Celebration Icon */}
        <div className="pulse-success-celebration-bubble">
          <CheckCircle2 size={42} className="pulse-success-check-icon" />
          <div className="pulse-success-glow-ring" />
        </div>

        <span className="pulse-success-pill-tag">
          <Sparkles size={13} /> RESERVATION CONFIRMED
        </span>

        <h3 className="pulse-success-title">You're All Set!</h3>
        <p className="pulse-success-subtitle">
          Your booking has been registered and verified instantly.
        </p>

        {/* Booking Card Details */}
        <div className="pulse-success-summary-card">
          <div className="pulse-success-venue-name">{latestSuccessBooking.title}</div>
          <div className="pulse-success-venue-address">{latestSuccessBooking.venue}</div>

          <div className="pulse-success-details-row">
            <div>
              <span className="pulse-ss-label">DATE & TIME</span>
              <span className="pulse-ss-val">{latestSuccessBooking.date}, {latestSuccessBooking.time}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="pulse-ss-label">DETAILS</span>
              <span className="pulse-ss-val">{latestSuccessBooking.details}</span>
            </div>
          </div>

          <div className="pulse-success-booking-id-row">
            <span>BOOKING ID</span>
            <strong className="mono">{latestSuccessBooking.bookingCode}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pulse-success-actions-col">
          <button
            type="button"
            className="pulse-primary-cta-btn full-width"
            onClick={() => {
              const b = latestSuccessBooking;
              clearSuccess();
              setActiveTicket(b);
            }}
          >
            <Ticket size={16} />
            <span>View Digital Pass & QR</span>
          </button>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              className="pulse-btn-outline"
              onClick={() => alert('Event added to Google Calendar & Apple Calendar')}
            >
              <Calendar size={14} />
              <span>Add to Calendar</span>
            </button>
            <button
              type="button"
              className="pulse-btn-outline"
              onClick={() => alert(`Directions opened for: ${latestSuccessBooking.venue}`)}
            >
              <MapPin size={14} />
              <span>Directions</span>
            </button>
          </div>

          <button
            type="button"
            className="pulse-link-dismiss"
            onClick={clearSuccess}
          >
            Back to Discovery Feed
          </button>
        </div>
      </div>
    </div>
  );
};

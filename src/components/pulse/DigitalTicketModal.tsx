import React from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  X,
  Share2,
  MapPin,
  Download
} from 'lucide-react';

export const DigitalTicketModal: React.FC = () => {
  const { activeTicket, setActiveTicket } = usePulse();

  if (!activeTicket) return null;

  return (
    <div className="pulse-modal-overlay" onClick={() => setActiveTicket(null)}>
      <div className="pulse-ticket-modal-card" onClick={e => e.stopPropagation()}>
        {/* Top Header */}
        <div className="pulse-ticket-top-bar">
          <div className="pulse-ticket-status-pill">
            <span className="pulse-dot-live" />
            <span>CONFIRMED ENTRY PASS</span>
          </div>
          <button
            type="button"
            className="pulse-close-btn"
            onClick={() => setActiveTicket(null)}
          >
            <X size={18} />
          </button>
        </div>

        {/* The Digital Pass Container */}
        <div className="pulse-digital-pass-body">
          {/* Animated Security Shimmer Hologram Ribbon */}
          <div className="pulse-ticket-security-ribbon">
            <span className="pulse-shimmer-track" />
            <span className="pulse-security-text">
              ● CIRCUIT 52 VIP PASS • OFFICIAL RFID SEAT ADMISSION • DO NOT DUPLICATE ●
            </span>
          </div>

          {/* Ticket Header & Image */}
          <div className="pulse-ticket-hero-row">
            <img src={activeTicket.imageUrl} alt={activeTicket.title} className="pulse-ticket-thumb" />
            <div>
              <span className="pulse-ticket-type-tag">{activeTicket.type} PASS</span>
              <h3 className="pulse-ticket-event-name">{activeTicket.title}</h3>
              <div className="pulse-ticket-venue-text">{activeTicket.venue}</div>
            </div>
          </div>

          {/* Cutout Notch Divider */}
          <div className="pulse-ticket-cutout-divider">
            <div className="pulse-cutout-notch left" />
            <div className="pulse-dashed-line" />
            <div className="pulse-cutout-notch right" />
          </div>

          {/* Date, Time & Seat Details Matrix */}
          <div className="pulse-ticket-meta-grid">
            <div className="pulse-ticket-meta-cell">
              <span className="pulse-t-label">DATE</span>
              <span className="pulse-t-val">{activeTicket.date}</span>
            </div>
            <div className="pulse-ticket-meta-cell">
              <span className="pulse-t-label">TIME</span>
              <span className="pulse-t-val highlight">{activeTicket.time}</span>
            </div>
            <div className="pulse-ticket-meta-cell full-width">
              <span className="pulse-t-label">SEAT / TABLE ALLOCATION</span>
              <span className="pulse-t-val">{activeTicket.details}</span>
            </div>
          </div>

          {/* High-Contrast Dynamic QR Code Box */}
          <div className="pulse-ticket-qr-section">
            <div className="pulse-qr-code-frame">
              <img
                src={activeTicket.qrCodeUrl}
                alt="QR Pass"
                className="pulse-qr-code-img"
              />
              <div className="pulse-qr-scan-bar" />
            </div>

            <div className="pulse-ticket-booking-code">
              BOOKING ID: <strong>{activeTicket.bookingCode}</strong>
            </div>

            <div className="pulse-ticket-scan-hint">
              Scan at venue entrance counter for contactless admission
            </div>
          </div>
        </div>

        {/* Ticket Action Buttons */}
        <div className="pulse-ticket-footer-actions">
          <button
            type="button"
            className="pulse-ticket-action-btn primary"
            onClick={() => alert('Pass saved to Apple Wallet / Google Wallet')}
          >
            <Download size={15} />
            <span>Add to Wallet</span>
          </button>

          <button
            type="button"
            className="pulse-ticket-action-btn"
            onClick={() => alert(`Directions to: ${activeTicket.venue}`)}
          >
            <MapPin size={15} />
            <span>Directions</span>
          </button>

          <button
            type="button"
            className="pulse-ticket-action-btn"
            onClick={() => alert(`Sharing ticket: ${activeTicket.bookingCode}`)}
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

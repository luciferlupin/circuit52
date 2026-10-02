import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  X,
  Share2,
  Bookmark,
  Calendar,
  MapPin,
  Users,
  ShieldCheck,
  Ticket
} from 'lucide-react';

export const EventDetailModal: React.FC = () => {
  const {
    selectedEvent,
    setSelectedEvent,
    savedItemIds,
    toggleSaveItem,
    bookEventTicket
  } = usePulse();

  const [ticketQuantity, setTicketQuantity] = useState<number>(2);

  if (!selectedEvent) return null;

  const isSaved = savedItemIds.includes(selectedEvent.id);

  return (
    <div className="pulse-detail-overlay" onClick={() => setSelectedEvent(null)}>
      <div className="pulse-detail-sheet event" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="pulse-sheet-handle" />

        {/* Hero Artwork Header */}
        <div className="pulse-event-detail-hero">
          <img
            src={selectedEvent.artworkUrl}
            alt={selectedEvent.title}
            className="pulse-event-detail-img"
          />
          <div className="pulse-backdrop-gradient" />

          {/* Floating actions */}
          <div className="pulse-gallery-overlay-bar">
            <button
              type="button"
              className="pulse-gallery-circle-btn"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="pulse-gallery-right-actions">
              <button
                type="button"
                className="pulse-gallery-circle-btn"
                onClick={() => alert(`Share event: ${selectedEvent.title}`)}
                aria-label="Share"
              >
                <Share2 size={16} />
              </button>
              <button
                type="button"
                className={`pulse-gallery-circle-btn ${isSaved ? 'saved' : ''}`}
                onClick={() => toggleSaveItem(selectedEvent.id)}
                aria-label="Save"
              >
                <Bookmark size={16} fill={isSaved ? '#3b82f6' : 'none'} color={isSaved ? '#3b82f6' : '#fff'} />
              </button>
            </div>
          </div>

          <div className="pulse-event-hero-badge-overlay">
            <span className="pulse-badge-recent">{selectedEvent.category}</span>
            <span className="pulse-badge-live">
              <Users size={12} /> {(selectedEvent.interestedCount / 1000).toFixed(1)}k Interested
            </span>
          </div>
        </div>

        {/* Event Body Details */}
        <div className="pulse-event-detail-body">
          <h2 className="pulse-event-main-title">{selectedEvent.title}</h2>

          <div className="pulse-event-meta-cards-row">
            <div className="pulse-event-meta-card">
              <Calendar size={18} className="pulse-meta-icon" />
              <div>
                <div className="pulse-event-meta-title">DATE & TIME</div>
                <div className="pulse-event-meta-val">{selectedEvent.fullDateTime}</div>
              </div>
            </div>

            <div className="pulse-event-meta-card">
              <MapPin size={18} className="pulse-meta-icon" />
              <div>
                <div className="pulse-event-meta-title">VENUE LOCATION</div>
                <div className="pulse-event-meta-val">{selectedEvent.venue} ({selectedEvent.distanceKm} km away)</div>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="pulse-detail-section">
            <h4 className="pulse-detail-section-title">About this Invitational / Series Event</h4>
            <p className="pulse-detail-about-text">{selectedEvent.about}</p>
          </div>

          {/* Artists / Hosts Lineup */}
          {selectedEvent.artists && selectedEvent.artists.length > 0 && (
            <div className="pulse-detail-section">
              <h4 className="pulse-detail-section-title">Featured Pros, Hosts & Commentators</h4>
              <div className="pulse-artists-list">
                {selectedEvent.artists.map((artist, idx) => (
                  <div key={idx} className="pulse-artist-item">
                    <div className="pulse-artist-avatar">
                      {artist.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="pulse-artist-name">{artist.name}</div>
                      <div className="pulse-artist-role">{artist.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedule */}
          {selectedEvent.schedule && selectedEvent.schedule.length > 0 && (
            <div className="pulse-detail-section">
              <h4 className="pulse-detail-section-title">Blind Structure & Event Timeline</h4>
              <div className="pulse-schedule-timeline">
                {selectedEvent.schedule.map((item, idx) => (
                  <div key={idx} className="pulse-timeline-row">
                    <span className="pulse-timeline-time">{item.time}</span>
                    <span className="pulse-timeline-dot" />
                    <span className="pulse-timeline-act">{item.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Things to Know & Terms */}
          <div className="pulse-detail-section">
            <h4 className="pulse-detail-section-title">Things to Know</h4>
            <div className="pulse-terms-box">
              {selectedEvent.terms.map((term, i) => (
                <div key={i} className="pulse-term-row">
                  <ShieldCheck size={14} className="pulse-term-icon" />
                  <span>{term}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sticky Booking CTA */}
        <div className="pulse-event-sticky-bar">
          <div>
            <div className="pulse-event-price-label">Buy-in / Pass Price</div>
            <div className="pulse-event-price-amount">
              ₹{selectedEvent.priceStarting.toLocaleString()}
              <span className="pulse-price-note"> / pass</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* Quantity Selector */}
            <select
              value={ticketQuantity}
              onChange={e => setTicketQuantity(Number(e.target.value))}
              className="pulse-ticket-qty-select"
            >
              {[1, 2, 3, 4, 5, 6].map(n => (
                <option key={n} value={n}>{n} {n === 1 ? 'Pass' : 'Passes'}</option>
              ))}
            </select>

            <button
              type="button"
              className="pulse-primary-cta-btn"
              onClick={() => bookEventTicket(selectedEvent, ticketQuantity)}
            >
              <Ticket size={16} />
              <span>Secure Seat / Pass</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

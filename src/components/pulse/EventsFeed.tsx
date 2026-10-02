import React from 'react';
import { usePulse } from '../../context/PulseContext';
import type { EventItem } from '../../types/pulse';
import { Users, Ticket } from 'lucide-react';

export const EventsFeed: React.FC = () => {
  const { events, setSelectedEvent, experiences } = usePulse();

  const seriesEvents = events.filter(e => e.category === 'MUSIC' || e.category === 'EXPERIENCES');
  const bountyEvents = events.filter(e => e.category === 'PARTIES' || e.category === 'EXPERIENCES' || e.id === 'evt-3');

  const renderEventCard = (evt: EventItem) => {
    return (
      <div
        key={evt.id}
        className="pulse-event-card"
        onClick={() => setSelectedEvent(evt)}
      >
        {/* Artwork Container */}
        <div className="pulse-event-artwork-box">
          <img
            src={evt.artworkUrl}
            alt={evt.title}
            className="pulse-event-img"
            loading="lazy"
          />

          {/* Date Badge Top Left */}
          <div className="pulse-event-date-badge">
            {evt.dateBadge}
          </div>

          {/* Category Tag Top Right */}
          <div className="pulse-event-cat-tag">
            {evt.category}
          </div>

          {/* Interested Count Bottom Pill */}
          <div className="pulse-event-interested-pill">
            <Users size={12} />
            <span>{(evt.interestedCount / 1000).toFixed(1)}k Interested</span>
          </div>
        </div>

        {/* Card Details */}
        <div className="pulse-event-info">
          <h4 className="pulse-event-title">{evt.title}</h4>
          <p className="pulse-event-venue">{evt.venue} • {evt.distanceKm} km</p>

          <div className="pulse-event-footer-row">
            <div className="pulse-event-price">
              <span className="pulse-price-sub">Starting from</span>
              <span className="pulse-price-bold">₹{evt.priceStarting.toLocaleString()}</span>
            </div>

            <button
              type="button"
              className="pulse-event-book-pill-btn"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedEvent(evt);
              }}
            >
              <Ticket size={13} />
              <span>Book Pass</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pulse-events-feed">
      {/* SECTION 1: High Stakes Series & Invitational Nights */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">High Stakes Series & Invitational Nights</h3>
            <p className="pulse-section-subtitle">Mega satellites, uncapped PLO-5 cash nights & VIP felt</p>
          </div>
        </div>

        <div className="pulse-events-grid">
          {(seriesEvents.length > 0 ? seriesEvents : events).map(renderEventCard)}
        </div>
      </section>

      {/* SECTION 2: Bounties, Satellites & Special Gigs */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Bounties, Satellites & Special Gigs</h3>
            <p className="pulse-section-subtitle">Celebrity guest pro bounties and national series satellites</p>
          </div>
        </div>

        <div className="pulse-events-grid">
          {(bountyEvents.length > 0 ? bountyEvents : events).map(renderEventCard)}
        </div>
      </section>

      {/* SECTION 3: Handpicked VIP Felts & Masterclasses */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">VIP Private Felts & Masterclasses</h3>
            <p className="pulse-section-subtitle">Private host sessions, 1-on-1 solver coaching & luxury dining</p>
          </div>
        </div>

        <div className="pulse-horizontal-cards-row">
          {experiences.map(exp => (
            <div
              key={exp.id}
              className="pulse-experience-card"
              onClick={() => alert(`Experience: ${exp.title}`)}
            >
              <div className="pulse-exp-img-box">
                <img src={exp.imageUrl} alt={exp.title} className="pulse-exp-img" />
                <span className="pulse-exp-duration">{exp.duration}</span>
              </div>
              <div className="pulse-exp-content">
                <span className="pulse-exp-cat">{exp.category}</span>
                <h4 className="pulse-exp-title">{exp.title}</h4>
                <div className="pulse-exp-rating">
                  ★ {exp.rating} ({exp.reviewsCount} reviews) • {exp.area}
                </div>
                <div className="pulse-exp-price">
                  ₹{exp.pricePerPerson.toLocaleString()} <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>/ person</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

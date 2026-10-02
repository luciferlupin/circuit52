import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  X,
  Star,
  Clock,
  Play,
  Share2,
  Bookmark,
  MapPin
} from 'lucide-react';

const DATES = [
  { label: 'Today', date: '02 Oct' },
  { label: 'Tomorrow', date: '03 Oct' },
  { label: 'Fri 04', date: '04 Oct' },
  { label: 'Sat 05', date: '05 Oct' }
];

export const MovieDetailModal: React.FC = () => {
  const {
    selectedMovie,
    setSelectedMovie,
    savedItemIds,
    toggleSaveItem,
    openSeatSelector
  } = usePulse();

  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<string>('ALL');
  const [showTrailer, setShowTrailer] = useState<boolean>(false);

  if (!selectedMovie) return null;

  const isSaved = savedItemIds.includes(selectedMovie.id);

  return (
    <div className="pulse-detail-overlay" onClick={() => setSelectedMovie(null)}>
      <div className="pulse-detail-sheet movie" onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div className="pulse-sheet-handle" />

        {/* Cinematic Backdrop Header */}
        <div className="pulse-movie-backdrop-header">
          <img
            src={selectedMovie.backdropUrl}
            alt={selectedMovie.title}
            className="pulse-movie-backdrop-img"
          />
          <div className="pulse-backdrop-gradient" />

          {/* Floating actions */}
          <div className="pulse-gallery-overlay-bar">
            <button
              type="button"
              className="pulse-gallery-circle-btn"
              onClick={() => setSelectedMovie(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="pulse-gallery-right-actions">
              <button
                type="button"
                className="pulse-gallery-circle-btn"
                onClick={() => alert(`Share: ${selectedMovie.title}`)}
                aria-label="Share"
              >
                <Share2 size={16} />
              </button>
              <button
                type="button"
                className={`pulse-gallery-circle-btn ${isSaved ? 'saved' : ''}`}
                onClick={() => toggleSaveItem(selectedMovie.id)}
                aria-label="Save"
              >
                <Bookmark size={16} fill={isSaved ? '#3b82f6' : 'none'} color={isSaved ? '#3b82f6' : '#fff'} />
              </button>
            </div>
          </div>

          {/* Play Trailer Floating Button */}
          <button
            type="button"
            className="pulse-trailer-play-btn"
            onClick={() => setShowTrailer(true)}
          >
            <Play size={20} fill="#fff" />
            <span>Stream Highlights</span>
          </button>
        </div>

        {/* Movie Info Section */}
        <div className="pulse-movie-detail-body">
          <div className="pulse-movie-main-row">
            <img
              src={selectedMovie.posterUrl}
              alt={selectedMovie.title}
              className="pulse-movie-detail-poster"
            />
            <div className="pulse-movie-meta-col">
              <div className="pulse-movie-rating-row">
                <div className="pulse-rating-box">
                  <Star size={12} fill="#93c5fd" color="#93c5fd" />
                  <span>{selectedMovie.rating.toFixed(1)}</span>
                </div>
                <span className="pulse-votes-text">{selectedMovie.votesCount} Entries</span>
              </div>

              <h2 className="pulse-movie-detail-title">{selectedMovie.title}</h2>

              <div className="pulse-movie-pills-row">
                <span className="pulse-cert-pill">{selectedMovie.certification}</span>
                <span className="pulse-runtime-pill">
                  <Clock size={11} /> {selectedMovie.runtime}
                </span>
                <span className="pulse-lang-pill">{selectedMovie.language}</span>
              </div>

              <div className="pulse-movie-genre-text">
                {selectedMovie.genre.join(', ')}
              </div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="pulse-detail-section">
            <h4 className="pulse-detail-section-title">Tournament Structure & Format</h4>
            <p className="pulse-detail-about-text">{selectedMovie.synopsis}</p>
          </div>

          {/* Cast & Crew */}
          <div className="pulse-detail-section">
            <h4 className="pulse-detail-section-title">Featured Pros & Tournament Director</h4>
            <div className="pulse-cast-carousel">
              <div className="pulse-cast-card">
                <div className="pulse-cast-avatar">TD</div>
                <span className="pulse-cast-name">{selectedMovie.crew.director}</span>
                <span className="pulse-cast-role">Tournament Director</span>
              </div>
              {selectedMovie.cast.map((c, i) => (
                <div key={i} className="pulse-cast-card">
                  <div className="pulse-cast-avatar">{c.name.slice(0, 2).toUpperCase()}</div>
                  <span className="pulse-cast-name">{c.name}</span>
                  <span className="pulse-cast-role">{c.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CINEMA LISTINGS & SHOWTIME SELECTION */}
          <div className="pulse-detail-section" id="cinemas-section">
            <div className="pulse-section-header">
              <div>
                <h4 className="pulse-detail-section-title">Select Host Club & Starting Flight</h4>
                <p className="pulse-section-subtitle">Real-time seat availability & RFID table buy-ins</p>
              </div>
            </div>

            {/* Date Selector Row */}
            <div className="pulse-cinema-dates-row">
              {DATES.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  className={`pulse-cinema-date-btn ${selectedDate === d.label ? 'active' : ''}`}
                  onClick={() => setSelectedDate(d.label)}
                >
                  <span className="pulse-c-day">{d.label}</span>
                  <span className="pulse-c-date">{d.date}</span>
                </button>
              ))}
            </div>

            {/* Format Filter Chips */}
            <div className="pulse-format-filter-chips">
              {(['ALL', 'IMAX', '4DX', '3D', '2D'] as const).map(fmt => (
                <button
                  key={fmt}
                  type="button"
                  className={`pulse-fmt-chip ${selectedFormatFilter === fmt ? 'active' : ''}`}
                  onClick={() => setSelectedFormatFilter(fmt)}
                >
                  {fmt}
                </button>
              ))}
            </div>

            {/* Cinema Cards List */}
            <div className="pulse-cinemas-list">
              {selectedMovie.cinemas.map(cinema => {
                const filteredShowtimes = cinema.showtimes.filter(st => {
                  if (selectedFormatFilter !== 'ALL' && st.format !== selectedFormatFilter) return false;
                  return true;
                });

                if (filteredShowtimes.length === 0) return null;

                return (
                  <div key={cinema.id} className="pulse-cinema-card">
                    <div className="pulse-cinema-header">
                      <div>
                        <h4 className="pulse-cinema-name">{cinema.name}</h4>
                        <div className="pulse-cinema-meta">
                          <MapPin size={12} />
                          <span>{cinema.area} • {cinema.distanceKm} km away</span>
                        </div>
                      </div>

                      <div className="pulse-cinema-formats">
                        {cinema.formats.map((f, idx) => (
                          <span key={idx} className="pulse-cinema-fmt-tag">{f}</span>
                        ))}
                      </div>
                    </div>

                    {/* Showtimes Grid */}
                    <div className="pulse-showtimes-grid">
                      {filteredShowtimes.map(st => (
                        <button
                          key={st.id}
                          type="button"
                          className="pulse-showtime-pill"
                          onClick={() => openSeatSelector(selectedMovie, cinema, st)}
                        >
                          <span className="pulse-st-time">{st.time}</span>
                          <div className="pulse-st-sub">
                            <span className="pulse-st-fmt">{st.format}</span>
                            <span className="pulse-st-price">₹{st.price}</span>
                          </div>
                          {st.availability === 'FAST_FILLING' && (
                            <span className="pulse-st-status orange">Fast Filling</span>
                          )}
                          {st.availability === 'ALMOST_FULL' && (
                            <span className="pulse-st-status red">Almost Full</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trailer Modal Simulation */}
        {showTrailer && (
          <div className="pulse-modal-overlay" onClick={() => setShowTrailer(false)}>
            <div className="pulse-trailer-box" onClick={e => e.stopPropagation()}>
              <div className="pulse-trailer-header">
                <span>Official Tournament Livestream & Highlight Reel</span>
                <button type="button" onClick={() => setShowTrailer(false)} className="pulse-close-btn">
                  <X size={16} />
                </button>
              </div>
              <div className="pulse-trailer-video-mock">
                <img src={selectedMovie.backdropUrl} alt="trailer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div className="pulse-trailer-play-center">
                  <Play size={48} fill="#fff" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

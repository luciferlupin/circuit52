import React from 'react';
import { usePulse } from '../../context/PulseContext';
import type { Movie } from '../../types/pulse';
import { Star, Ticket, Sparkles } from 'lucide-react';

export const MoviesFeed: React.FC = () => {
  const { movies, setSelectedMovie } = usePulse();

  const nowShowing = movies.filter(m => m.status === 'NOW_SHOWING');
  const trending = movies.filter(m => m.status === 'TRENDING');

  const renderMovieCard = (movie: Movie) => {
    return (
      <div
        key={movie.id}
        className="pulse-movie-card"
        onClick={() => setSelectedMovie(movie)}
      >
        {/* Poster Box */}
        <div className="pulse-movie-poster-box">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="pulse-movie-poster"
            loading="lazy"
          />

          {/* Top Rating Pill */}
          <div className="pulse-movie-rating-badge">
            <Star size={11} fill="#60a5fa" color="#60a5fa" />
            <span>{movie.rating.toFixed(1)}</span>
            <span className="pulse-votes-count">({movie.votesCount})</span>
          </div>

          {/* Bottom Overlay Pills */}
          <div className="pulse-movie-bottom-tags">
            <span className="pulse-cert-pill">{movie.certification}</span>
            <span className="pulse-format-tag">DEEPSTACK • PKO</span>
          </div>
        </div>

        {/* Info */}
        <div className="pulse-movie-info">
          <h4 className="pulse-movie-title">{movie.title}</h4>
          <div className="pulse-movie-genre">
            {movie.genre.slice(0, 2).join(' • ')} • {movie.runtime}
          </div>

          <button
            type="button"
            className="pulse-book-movie-btn"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedMovie(movie);
            }}
          >
            <Ticket size={13} />
            <span>Register Seat</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pulse-movies-feed">
      {/* SECTION 1: Daily & Weekend Poker Tournaments */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Daily & Weekend Tournaments</h3>
            <p className="pulse-section-subtitle">GTD prize pools, deepstack structures & live streams</p>
          </div>
        </div>

        <div className="pulse-movies-grid">
          {nowShowing.map(renderMovieCard)}
        </div>
      </section>

      {/* SECTION 2: Championship Major Banner */}
      <div className="pulse-imax-banner" onClick={() => setSelectedMovie(movies[0])}>
        <div className="pulse-imax-content">
          <span className="pulse-badge-recent">CHAMPIONSHIP MAJOR</span>
          <h3>₹50 Lakh GTD Aria Weekend Deepstack</h3>
          <p>100k starting chips • 25-minute levels • Feature table</p>
          <button type="button" className="pulse-primary-cta-btn">
            <Sparkles size={13} />
            <span>Register Tournament Seat</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: Trending Poker Majors & Satellites */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Trending Poker Majors & Satellites</h3>
            <p className="pulse-section-subtitle">High roller tournaments & national qualifiers</p>
          </div>
        </div>

        <div className="pulse-movies-grid">
          {(trending.length > 0 ? trending : movies).map(renderMovieCard)}
        </div>
      </section>
    </div>
  );
};

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
            <span className="pulse-format-tag">IMAX • 4DX</span>
          </div>
        </div>

        {/* Info */}
        <div className="pulse-movie-info">
          <h4 className="pulse-movie-title">{movie.title}</h4>
          <div className="pulse-movie-genre">
            {movie.genre.slice(0, 2).join(' / ')} • {movie.language.split(' ')[0]}
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
            <span>Book Tickets</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pulse-movies-feed">
      {/* SECTION 1: Now Showing in Cinemas */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Now Showing</h3>
            <p className="pulse-section-subtitle">Laser IMAX, 4DX, and Dolby Atmos screenings near you</p>
          </div>
        </div>

        <div className="pulse-movies-grid">
          {nowShowing.map(renderMovieCard)}
        </div>
      </section>

      {/* SECTION 2: IMAX & Premium Formats Promo */}
      <div className="pulse-imax-banner" onClick={() => setSelectedMovie(movies[0])}>
        <div className="pulse-imax-content">
          <span className="pulse-badge-recent">EXCLUSIVE FORMAT</span>
          <h3>IMAX with Laser: Unprecedented Contrast</h3>
          <p>Dual 4K laser projection systems with 12-channel next-generation sound.</p>
          <button type="button" className="btn btn-primary btn-sm">
            <Sparkles size={13} />
            <span>Book IMAX Screenings</span>
          </button>
        </div>
      </div>

      {/* SECTION 3: Trending & Recommended */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Trending & Recommended</h3>
            <p className="pulse-section-subtitle">Highest rated theatrical releases this week</p>
          </div>
        </div>

        <div className="pulse-movies-grid">
          {(trending.length > 0 ? trending : movies).map(renderMovieCard)}
        </div>
      </section>
    </div>
  );
};

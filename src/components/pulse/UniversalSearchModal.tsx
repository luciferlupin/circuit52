import React, { useMemo } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  Search,
  X,
  Mic,
  TrendingUp,
  History,
  Star,
  Trophy,
  Flame,
  Ticket
} from 'lucide-react';

const TRENDING_TAGS = [
  '₹100/₹200 NLH Cash',
  'Wynn High Roller Lounge',
  '₹50L Aria Deepstack',
  'PLO-5 Action Rooms',
  "Bobby's Room VIP Felt",
  'RFID Smart Tables',
  '₹200/₹500 Stakes'
];

export const UniversalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    searchQuery,
    setSearchQuery,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    restaurants,
    movies,
    events,
    setSelectedRestaurant,
    setSelectedMovie,
    setSelectedEvent
  } = usePulse();

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase();

    const matchedRestaurants = restaurants.filter(
      r => r.name.toLowerCase().includes(q) ||
           r.cuisine.some(c => c.toLowerCase().includes(q)) ||
           r.area.toLowerCase().includes(q)
    );

    const matchedMovies = movies.filter(
      m => m.title.toLowerCase().includes(q) ||
           m.genre.some(g => g.toLowerCase().includes(q)) ||
           m.language.toLowerCase().includes(q)
    );

    const matchedEvents = events.filter(
      e => e.title.toLowerCase().includes(q) ||
           e.category.toLowerCase().includes(q) ||
           e.venue.toLowerCase().includes(q)
    );

    return {
      restaurants: matchedRestaurants,
      movies: matchedMovies,
      events: matchedEvents,
      totalCount: matchedRestaurants.length + matchedMovies.length + matchedEvents.length
    };
  }, [searchQuery, restaurants, movies, events]);

  if (!isSearchModalOpen) return null;

  const handleSelectSearch = (term: string) => {
    setSearchQuery(term);
    addRecentSearch(term);
  };

  return (
    <div className="pulse-search-fullscreen-overlay">
      {/* Top Search Input Header */}
      <div className="pulse-search-header-bar">
        <div className="pulse-search-input-wrapper">
          <Search size={18} className="pulse-search-icon" />
          <input
            type="text"
            placeholder="Search poker rooms, cash stakes (100/200, PLO), tourneys..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') addRecentSearch(searchQuery);
            }}
            autoFocus
            className="pulse-search-native-input"
          />
          {searchQuery && (
            <button
              type="button"
              className="pulse-clear-input-btn"
              onClick={() => setSearchQuery('')}
            >
              <X size={16} />
            </button>
          )}
          <Mic size={17} className="pulse-mic-icon" />
        </div>

        <button
          type="button"
          className="pulse-search-cancel-btn"
          onClick={() => {
            setIsSearchModalOpen(false);
            setSearchQuery('');
          }}
        >
          Cancel
        </button>
      </div>

      {/* Main Search Body */}
      <div className="pulse-search-results-scroll">
        {/* BEFORE TYPING: Recent & Trending */}
        {!searchQuery.trim() && (
          <div className="pulse-search-empty-state">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="pulse-search-section">
                <div className="pulse-search-section-header">
                  <span className="pulse-search-section-title">
                    <History size={14} /> RECENT SEARCHES
                  </span>
                  <button
                    type="button"
                    className="pulse-clear-recents-link"
                    onClick={clearRecentSearches}
                  >
                    Clear All
                  </button>
                </div>

                <div className="pulse-recent-chips-list">
                  {recentSearches.map((item, idx) => (
                    <div
                      key={idx}
                      className="pulse-recent-chip"
                      onClick={() => handleSelectSearch(item)}
                    >
                      <History size={13} style={{ color: 'var(--text-dim)' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Near You */}
            <div className="pulse-search-section">
              <span className="pulse-search-section-title">
                <TrendingUp size={14} /> TRENDING ACTION
              </span>

              <div className="pulse-trending-chips-wrap">
                {TRENDING_TAGS.map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="pulse-trending-pill"
                    onClick={() => handleSelectSearch(tag)}
                  >
                    <span className="pulse-trend-num">#{idx + 1}</span>
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WHILE TYPING: Live Categorized Results */}
        {searchQuery.trim() && searchResults && (
          <div className="pulse-live-search-results">
            {searchResults.totalCount === 0 ? (
              <div className="pulse-no-results-box">
                <div className="pulse-no-results-emoji">♠️</div>
                <h4>No results found for "{searchQuery}"</h4>
                <p>Try searching for "Wynn", "Aria", "PLO", "100/200" or "Deepstack"</p>
              </div>
            ) : (
              <>
                {/* 1. RESTAURANTS RESULTS */}
                {searchResults.restaurants.length > 0 && (
                  <div className="pulse-search-category-group">
                    <div className="pulse-search-group-header">
                      <Flame size={14} />
                      <span>POKER CLUBS & ROOMS ({searchResults.restaurants.length})</span>
                    </div>

                    <div className="pulse-search-group-items">
                      {searchResults.restaurants.map(rest => (
                        <div
                          key={rest.id}
                          className="pulse-search-item-row"
                          onClick={() => {
                            addRecentSearch(rest.name);
                            setSelectedRestaurant(rest);
                            setIsSearchModalOpen(false);
                          }}
                        >
                          <img src={rest.imageUrl} alt={rest.name} className="pulse-search-thumb" />
                          <div className="pulse-search-item-meta">
                            <div className="pulse-search-item-title">{rest.name}</div>
                            <div className="pulse-search-item-sub">
                              {rest.cuisine.slice(0, 2).join(' • ')} • {rest.area}
                            </div>
                          </div>
                          <div className="pulse-rating-box">
                            <span>{rest.rating}</span>
                            <Star size={10} fill="#93c5fd" color="#93c5fd" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. MOVIES RESULTS */}
                {searchResults.movies.length > 0 && (
                  <div className="pulse-search-category-group">
                    <div className="pulse-search-group-header">
                      <Trophy size={14} />
                      <span>TOURNAMENTS & CHAMPIONSHIPS ({searchResults.movies.length})</span>
                    </div>

                    <div className="pulse-search-group-items">
                      {searchResults.movies.map(mov => (
                        <div
                          key={mov.id}
                          className="pulse-search-item-row"
                          onClick={() => {
                            addRecentSearch(mov.title);
                            setSelectedMovie(mov);
                            setIsSearchModalOpen(false);
                          }}
                        >
                          <img src={mov.posterUrl} alt={mov.title} className="pulse-search-thumb poster" />
                          <div className="pulse-search-item-meta">
                            <div className="pulse-search-item-title">{mov.title}</div>
                            <div className="pulse-search-item-sub">
                              {mov.genre.join(', ')} • {mov.runtime}
                            </div>
                          </div>
                          <button
                            type="button"
                            className="pulse-search-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMovie(mov);
                              setIsSearchModalOpen(false);
                            }}
                          >
                            Register
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. EVENTS RESULTS */}
                {searchResults.events.length > 0 && (
                  <div className="pulse-search-category-group">
                    <div className="pulse-search-group-header">
                      <Ticket size={14} />
                      <span>SERIES & SPECIAL GIGS ({searchResults.events.length})</span>
                    </div>

                    <div className="pulse-search-group-items">
                      {searchResults.events.map(evt => (
                        <div
                          key={evt.id}
                          className="pulse-search-item-row"
                          onClick={() => {
                            addRecentSearch(evt.title);
                            setSelectedEvent(evt);
                            setIsSearchModalOpen(false);
                          }}
                        >
                          <img src={evt.artworkUrl} alt={evt.title} className="pulse-search-thumb" />
                          <div className="pulse-search-item-meta">
                            <div className="pulse-search-item-title">{evt.title}</div>
                            <div className="pulse-search-item-sub">
                              {evt.dateBadge} • {evt.venue}
                            </div>
                          </div>
                          <span className="pulse-search-price">From ₹{evt.priceStarting.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

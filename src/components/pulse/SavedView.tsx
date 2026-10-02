import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import { Bookmark, Plus, Star } from 'lucide-react';

export const SavedView: React.FC = () => {
  const {
    savedItemIds,
    savedCollections,
    restaurants,
    movies,
    events,
    setSelectedRestaurant,
    setSelectedMovie,
    setSelectedEvent,
    toggleSaveItem,
    setActiveTab
  } = usePulse();

  const [activeCollectionId, setActiveCollectionId] = useState<string>('ALL');

  // Match saved items
  const savedRestaurants = restaurants.filter(r => savedItemIds.includes(r.id));
  const savedMovies = movies.filter(m => savedItemIds.includes(m.id));
  const savedEvents = events.filter(e => savedItemIds.includes(e.id));

  const totalSavedCount = savedRestaurants.length + savedMovies.length + savedEvents.length;

  return (
    <div className="pulse-saved-page">
      {/* Header */}
      <div className="pulse-page-header">
        <h2 className="pulse-page-title">Saved & Collections</h2>
        <p className="pulse-page-sub">{totalSavedCount} curated spots and experiences</p>
      </div>

      {/* Collections Row */}
      <div className="pulse-collections-carousel">
        <button
          type="button"
          className={`pulse-collection-pill ${activeCollectionId === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveCollectionId('ALL')}
        >
          <span>All Saved</span>
          <span className="pulse-coll-count">{totalSavedCount}</span>
        </button>

        {savedCollections.map(col => (
          <button
            key={col.id}
            type="button"
            className={`pulse-collection-pill ${activeCollectionId === col.id ? 'active' : ''}`}
            onClick={() => setActiveCollectionId(col.id)}
          >
            <span>{col.icon}</span>
            <span>{col.name}</span>
          </button>
        ))}

        <button
          type="button"
          className="pulse-collection-pill add"
          onClick={() => alert('New collection created: "Nightlife Picks"')}
        >
          <Plus size={14} />
          <span>New</span>
        </button>
      </div>

      {/* Saved Items Feed */}
      <div className="pulse-saved-feed">
        {totalSavedCount === 0 ? (
          <div className="pulse-empty-state-card">
            <Bookmark size={36} className="pulse-empty-icon" />
            <h4>No saved items yet</h4>
            <p>Tap the bookmark icon on any restaurant, movie or event to save it to your wishlist.</p>
            <button
              type="button"
              className="pulse-primary-cta-btn"
              onClick={() => setActiveTab('HOME')}
            >
              Browse Experiences
            </button>
          </div>
        ) : (
          <>
            {/* Saved Restaurants */}
            {savedRestaurants.length > 0 && (
              <div className="pulse-saved-section">
                <span className="pulse-saved-section-title">RESTAURANTS ({savedRestaurants.length})</span>
                <div className="pulse-saved-cards-list">
                  {savedRestaurants.map(r => (
                    <div
                      key={r.id}
                      className="pulse-saved-item-card"
                      onClick={() => setSelectedRestaurant(r)}
                    >
                      <img src={r.imageUrl} alt={r.name} className="pulse-saved-thumb" />
                      <div className="pulse-saved-meta">
                        <div className="pulse-saved-title-row">
                          <h4 className="pulse-saved-title">{r.name}</h4>
                          <button
                            type="button"
                            className="pulse-saved-heart-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveItem(r.id);
                            }}
                          >
                            <Bookmark size={16} fill="#10b981" color="#10b981" />
                          </button>
                        </div>
                        <div className="pulse-saved-sub">{r.cuisine.slice(0, 2).join(', ')} • {r.area}</div>
                        <div className="pulse-saved-bottom-row">
                          <div className="pulse-rating-box">
                            <span>{r.rating}</span>
                            <Star size={10} fill="#86efac" />
                          </div>
                          <span className="pulse-saved-price">₹{r.priceForTwo} for two</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Movies */}
            {savedMovies.length > 0 && (
              <div className="pulse-saved-section">
                <span className="pulse-saved-section-title">MOVIES ({savedMovies.length})</span>
                <div className="pulse-saved-cards-list">
                  {savedMovies.map(m => (
                    <div
                      key={m.id}
                      className="pulse-saved-item-card"
                      onClick={() => setSelectedMovie(m)}
                    >
                      <img src={m.posterUrl} alt={m.title} className="pulse-saved-thumb poster" />
                      <div className="pulse-saved-meta">
                        <div className="pulse-saved-title-row">
                          <h4 className="pulse-saved-title">{m.title}</h4>
                          <button
                            type="button"
                            className="pulse-saved-heart-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveItem(m.id);
                            }}
                          >
                            <Bookmark size={16} fill="#10b981" color="#10b981" />
                          </button>
                        </div>
                        <div className="pulse-saved-sub">{m.genre.join(', ')} • {m.runtime}</div>
                        <div className="pulse-saved-bottom-row">
                          <span className="pulse-cert-pill">{m.certification}</span>
                          <span className="pulse-rating-box">★ {m.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Events */}
            {savedEvents.length > 0 && (
              <div className="pulse-saved-section">
                <span className="pulse-saved-section-title">LIVE EVENTS ({savedEvents.length})</span>
                <div className="pulse-saved-cards-list">
                  {savedEvents.map(e => (
                    <div
                      key={e.id}
                      className="pulse-saved-item-card"
                      onClick={() => setSelectedEvent(e)}
                    >
                      <img src={e.artworkUrl} alt={e.title} className="pulse-saved-thumb" />
                      <div className="pulse-saved-meta">
                        <div className="pulse-saved-title-row">
                          <h4 className="pulse-saved-title">{e.title}</h4>
                          <button
                            type="button"
                            className="pulse-saved-heart-btn"
                            onClick={(evt) => {
                              evt.stopPropagation();
                              toggleSaveItem(e.id);
                            }}
                          >
                            <Bookmark size={16} fill="#10b981" color="#10b981" />
                          </button>
                        </div>
                        <div className="pulse-saved-sub">{e.dateBadge} • {e.venue}</div>
                        <div className="pulse-saved-bottom-row">
                          <span className="pulse-saved-price">From ₹{e.priceStarting}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

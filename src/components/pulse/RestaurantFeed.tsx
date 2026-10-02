import React from 'react';
import { usePulse } from '../../context/PulseContext';
import type { Restaurant } from '../../types/pulse';
import { Star, Bookmark, Sparkles, Clock, ArrowRight } from 'lucide-react';

export const RestaurantFeed: React.FC = () => {
  const {
    restaurants,
    setSelectedRestaurant,
    savedItemIds,
    toggleSaveItem,
    activeFilterChip,
    filters
  } = usePulse();

  // Apply contextual filter
  const filteredRestaurants = restaurants.filter(r => {
    // Quick filter chips
    if (activeFilterChip === 'TOP_RATED' && r.rating < 4.7) return false;
    if (activeFilterChip === 'NEAR_ME' && r.distanceKm > 3.0) return false;
    if (activeFilterChip === 'OFFERS' && !r.featuredOffer) return false;
    if (activeFilterChip === 'UNDER_500' && r.priceForTwo > 1500) return false;
    if (activeFilterChip === 'PREMIUM' && r.priceForTwo < 2000) return false;
    if (activeFilterChip === 'NEW' && r.sectionTag !== 'NEW') return false;

    // Advanced bottom sheet filters
    if (filters.openNow && !r.isOpen) return false;
    if (filters.outdoorSeating && !r.facilities.some(f => f.toLowerCase().includes('outdoor') || f.toLowerCase().includes('rooftop'))) return false;
    if (filters.minRating && r.rating < filters.minRating) return false;
    if (filters.maxDistanceKm && r.distanceKm > filters.maxDistanceKm) return false;

    return true;
  });

  const popularList = filteredRestaurants.filter(r => r.sectionTag === 'POPULAR' || r.sectionTag === 'TRENDING');
  const dateNightList = filteredRestaurants.filter(r => r.sectionTag === 'DATE_NIGHT' || r.priceForTwo >= 2000);
  const hiddenGemsList = filteredRestaurants.filter(r => r.sectionTag === 'HIDDEN_GEM' || r.sectionTag === 'NEW');

  const renderCard = (restaurant: Restaurant) => {
    const isSaved = savedItemIds.includes(restaurant.id);

    return (
      <div
        key={restaurant.id}
        className="pulse-restaurant-card"
        onClick={() => setSelectedRestaurant(restaurant)}
      >
        {/* Large Restaurant Image Box */}
        <div className="pulse-card-img-container">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="pulse-card-img"
            loading="lazy"
          />

          {/* Top Overlays */}
          <div className="pulse-card-top-overlay">
            {/* Table Availability Pill */}
            {restaurant.isTableAvailable ? (
              <span className="pulse-card-avail-pill green">
                <span className="pulse-dot-live" /> Table Available Tonight
              </span>
            ) : (
              <span className="pulse-card-avail-pill orange">
                <Clock size={11} /> {restaurant.tableWaitMinutes}m wait
              </span>
            )}

            {/* Bookmark button */}
            <button
              type="button"
              className={`pulse-card-bookmark-btn ${isSaved ? 'saved' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveItem(restaurant.id);
              }}
              title={isSaved ? 'Remove from Saved' : 'Save Restaurant'}
              aria-label="Save restaurant"
            >
              <Bookmark size={15} fill={isSaved ? '#3b82f6' : 'none'} color={isSaved ? '#3b82f6' : '#fff'} />
            </button>
          </div>

          {/* Bottom Overlays */}
          <div className="pulse-card-bottom-overlay">
            {restaurant.featuredOffer && (
              <div className="pulse-card-offer-badge">
                <Sparkles size={11} />
                <span>{restaurant.featuredOffer}</span>
              </div>
            )}
            <span className="pulse-card-distance-pill">
              {restaurant.distanceKm} km
            </span>
          </div>
        </div>

        {/* Card Content Anatomy (Minimal, Strong Hierarchy) */}
        <div className="pulse-card-content">
          <div className="pulse-card-title-row">
            <h3 className="pulse-card-name">{restaurant.name}</h3>
            {/* Rating Box */}
            <div className="pulse-rating-box">
              <span>{restaurant.rating.toFixed(1)}</span>
              <Star size={11} fill="#93c5fd" color="#93c5fd" />
            </div>
          </div>

          {/* Cuisine & Subtitle */}
          <div className="pulse-card-cuisine">
            {restaurant.cuisine.join(' • ')}
          </div>

          {/* Area & Price for Two */}
          <div className="pulse-card-meta-row">
            <span className="pulse-card-area">{restaurant.area}</span>
            <span className="pulse-card-meta-dot">•</span>
            <span className="pulse-card-price">₹{restaurant.priceForTwo.toLocaleString()} for two</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pulse-dining-feed">
      {/* SECTION 1: Popular Near You */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Popular Near You</h3>
            <p className="pulse-section-subtitle">Trending tables and hot reservations today</p>
          </div>
          <button
            type="button"
            className="pulse-section-see-all"
            onClick={() => setSelectedRestaurant(restaurants[0])}
          >
            <span>See all</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="pulse-horizontal-cards-row">
          {(popularList.length > 0 ? popularList : filteredRestaurants).map(renderCard)}
        </div>
      </section>

      {/* SECTION 2: Date Night & Intimate Dining */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Date-Night Restaurants</h3>
            <p className="pulse-section-subtitle">Romantic ambient lighting, omakase & craft wine</p>
          </div>
        </div>

        <div className="pulse-vertical-cards-col">
          {(dateNightList.length > 0 ? dateNightList : filteredRestaurants.slice(1)).map(renderCard)}
        </div>
      </section>

      {/* SECTION 3: Hidden Gems & New In City */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Hidden Gems & Glasshouses</h3>
            <p className="pulse-section-subtitle">Curated by local food editors and culinary critics</p>
          </div>
        </div>

        <div className="pulse-horizontal-cards-row">
          {(hiddenGemsList.length > 0 ? hiddenGemsList : filteredRestaurants).map(renderCard)}
        </div>
      </section>
    </div>
  );
};

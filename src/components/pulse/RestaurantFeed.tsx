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
                <span className="pulse-dot-live" /> Seats Open Now
              </span>
            ) : (
              <span className="pulse-card-avail-pill orange">
                <Clock size={11} /> {restaurant.tableWaitMinutes}m waitlist
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
              title={isSaved ? 'Remove from Saved' : 'Save Poker Club'}
              aria-label="Save poker club"
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

          {/* Stakes & Subtitle */}
          <div className="pulse-card-cuisine">
            {restaurant.cuisine.join(' • ')}
          </div>

          {/* Area & Min Buy-in */}
          <div className="pulse-card-meta-row">
            <span className="pulse-card-area">{restaurant.area}</span>
            <span className="pulse-card-meta-dot">•</span>
            <span className="pulse-card-price">From ₹{restaurant.priceForTwo.toLocaleString()} buy-in</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pulse-dining-feed">
      {/* SECTION 1: Live Cash Game Poker Clubs */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Live Cash Game Poker Clubs</h3>
            <p className="pulse-section-subtitle">Active cash tables, real-time waitlists & instant seat booking</p>
          </div>
          <button
            type="button"
            className="pulse-section-see-all"
            onClick={() => setSelectedRestaurant(restaurants[0])}
          >
            <span>See all clubs</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="pulse-horizontal-cards-row">
          {(popularList.length > 0 ? popularList : filteredRestaurants).map(renderCard)}
        </div>
      </section>

      {/* SECTION 2: High Roller & VIP Lounges */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">High Roller & VIP Penthouse Lounges</h3>
            <p className="pulse-section-subtitle">Private cages, uncapped stakes, Bobby's Room & luxury felt</p>
          </div>
        </div>

        <div className="pulse-vertical-cards-col">
          {(dateNightList.length > 0 ? dateNightList : filteredRestaurants.slice(1)).map(renderCard)}
        </div>
      </section>

      {/* SECTION 3: Action PLO & Deepstack Rooms */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Action PLO & Deepstack Cardrooms</h3>
            <p className="pulse-section-subtitle">5-Card Omaha, Bomb Pots, and automatic card shuffler clubs</p>
          </div>
        </div>

        <div className="pulse-horizontal-cards-row">
          {(hiddenGemsList.length > 0 ? hiddenGemsList : filteredRestaurants).map(renderCard)}
        </div>
      </section>
    </div>
  );
};

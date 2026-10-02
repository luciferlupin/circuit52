import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  X,
  Share2,
  Bookmark,
  Star,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';

export const RestaurantDetailModal: React.FC = () => {
  const {
    selectedRestaurant,
    setSelectedRestaurant,
    savedItemIds,
    toggleSaveItem,
    setIsTableSheetOpen
  } = usePulse();

  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MENU' | 'PHOTOS' | 'REVIEWS'>('OVERVIEW');

  if (!selectedRestaurant) return null;

  const isSaved = savedItemIds.includes(selectedRestaurant.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedRestaurant.name,
        text: `Check out ${selectedRestaurant.name} on Pulse!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      alert(`Link copied: ${selectedRestaurant.name} on Pulse`);
    }
  };

  return (
    <div className="pulse-detail-overlay" onClick={() => setSelectedRestaurant(null)}>
      <div className="pulse-detail-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Top Handle */}
        <div className="pulse-sheet-handle" />

        {/* Immersive Image Gallery */}
        <div className="pulse-detail-gallery-container">
          <img
            src={selectedRestaurant.galleryUrls[activeGalleryIdx] || selectedRestaurant.imageUrl}
            alt={selectedRestaurant.name}
            className="pulse-detail-hero-img"
          />

          {/* Floating Actions Overlay */}
          <div className="pulse-gallery-overlay-bar">
            <button
              type="button"
              className="pulse-gallery-circle-btn"
              onClick={() => setSelectedRestaurant(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <div className="pulse-gallery-right-actions">
              <button
                type="button"
                className="pulse-gallery-circle-btn"
                onClick={handleShare}
                aria-label="Share"
              >
                <Share2 size={16} />
              </button>
              <button
                type="button"
                className={`pulse-gallery-circle-btn ${isSaved ? 'saved' : ''}`}
                onClick={() => toggleSaveItem(selectedRestaurant.id)}
                aria-label="Save"
              >
                <Bookmark size={16} fill={isSaved ? '#3b82f6' : 'none'} color={isSaved ? '#3b82f6' : '#fff'} />
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="pulse-gallery-thumbnails">
            {selectedRestaurant.galleryUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt="thumb"
                className={`pulse-gallery-thumb ${i === activeGalleryIdx ? 'active' : ''}`}
                onClick={() => setActiveGalleryIdx(i)}
              />
            ))}
          </div>
        </div>

        {/* Main Details Body */}
        <div className="pulse-detail-body">
          {/* Header Info */}
          <div className="pulse-detail-header-block">
            <div className="pulse-detail-title-row">
              <h2 className="pulse-detail-name">{selectedRestaurant.name}</h2>
              <div className="pulse-rating-box large">
                <span>{selectedRestaurant.rating.toFixed(1)}</span>
                <Star size={13} fill="#93c5fd" color="#93c5fd" />
              </div>
            </div>

            <div className="pulse-detail-reviews-sub">
              ★ {selectedRestaurant.rating.toFixed(1)} ({selectedRestaurant.reviewCount.toLocaleString()} reviews on Pulse)
            </div>

            <div className="pulse-detail-cuisine-row">
              <span>{selectedRestaurant.cuisine.join(' • ')}</span>
            </div>

            <div className="pulse-detail-meta-pills">
              <span className="pulse-detail-pill">
                <MapPin size={12} /> {selectedRestaurant.area} ({selectedRestaurant.distanceKm} km)
              </span>
              <span className="pulse-detail-pill">
                ₹{selectedRestaurant.priceForTwo.toLocaleString()} for two
              </span>
              <span className={`pulse-detail-pill ${selectedRestaurant.isOpen ? 'open' : 'closed'}`}>
                <Clock size={12} /> {selectedRestaurant.isOpen ? 'Open Now' : 'Closed'} • {selectedRestaurant.timings}
              </span>
            </div>
          </div>

          {/* Primary Quick Actions (Reserve, Directions, Call) */}
          <div className="pulse-detail-action-buttons-grid">
            <button
              type="button"
              className="pulse-action-grid-btn primary"
              onClick={() => setIsTableSheetOpen(true)}
            >
              <CalendarDays size={16} />
              <span>Reserve Table</span>
            </button>
            <button
              type="button"
              className="pulse-action-grid-btn"
              onClick={() => alert(`Directions opened for: ${selectedRestaurant.address}`)}
            >
              <MapPin size={16} />
              <span>Directions</span>
            </button>
            <button
              type="button"
              className="pulse-action-grid-btn"
              onClick={() => window.open(`tel:${selectedRestaurant.phone}`)}
            >
              <Phone size={16} />
              <span>Call</span>
            </button>
          </div>

          {/* Featured Offer Banner */}
          {selectedRestaurant.featuredOffer && (
            <div className="pulse-detail-offer-banner">
              <Sparkles size={16} className="pulse-offer-sparkle" />
              <div>
                <div className="pulse-offer-title">EXCLUSIVE PULSE PERK</div>
                <div className="pulse-offer-desc">{selectedRestaurant.featuredOffer}</div>
              </div>
            </div>
          )}

          {/* Tabs: Overview, Menu, Photos, Reviews */}
          <div className="pulse-detail-tabs-bar">
            {(['OVERVIEW', 'MENU', 'PHOTOS', 'REVIEWS'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                className={`pulse-detail-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'OVERVIEW' && (
            <div className="pulse-tab-content-block">
              {/* About */}
              <div className="pulse-detail-section">
                <h4 className="pulse-detail-section-title">About the Restaurant</h4>
                <p className="pulse-detail-about-text">{selectedRestaurant.about}</p>
              </div>

              {/* Popular Dishes */}
              <div className="pulse-detail-section">
                <h4 className="pulse-detail-section-title">Popular Dishes</h4>
                <div className="pulse-dishes-grid">
                  {selectedRestaurant.popularDishes.map((dish, i) => (
                    <div key={i} className="pulse-dish-card">
                      <div className="pulse-dish-info">
                        <div className="pulse-dish-header">
                          <span className={`pulse-veg-indicator ${dish.isVeg ? 'veg' : 'non-veg'}`} />
                          <span className="pulse-dish-name">{dish.name}</span>
                        </div>
                        {dish.tag && <span className="pulse-dish-tag">{dish.tag}</span>}
                      </div>
                      <span className="pulse-dish-price">₹{dish.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="pulse-detail-section">
                <h4 className="pulse-detail-section-title">Amenities & Facilities</h4>
                <div className="pulse-facilities-tags">
                  {selectedRestaurant.facilities.map((fac, i) => (
                    <span key={i} className="pulse-facility-tag">
                      <CheckCircle2 size={13} className="pulse-fac-check" />
                      <span>{fac}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Location & Address */}
              <div className="pulse-detail-section">
                <h4 className="pulse-detail-section-title">Location & Contact</h4>
                <p className="pulse-detail-address-text">{selectedRestaurant.address}</p>
                <div className="pulse-detail-contact-row">
                  <span>Phone: {selectedRestaurant.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Menu */}
          {activeTab === 'MENU' && (
            <div className="pulse-tab-content-block">
              <div className="pulse-menu-list">
                {selectedRestaurant.popularDishes.map((dish, i) => (
                  <div key={i} className="pulse-menu-row">
                    <div>
                      <div className="pulse-dish-header">
                        <span className={`pulse-veg-indicator ${dish.isVeg ? 'veg' : 'non-veg'}`} />
                        <span className="pulse-dish-name">{dish.name}</span>
                      </div>
                      <span className="pulse-dish-sub">Prepared fresh with artisanal ingredients</span>
                    </div>
                    <span className="pulse-dish-price">₹{dish.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Photos */}
          {activeTab === 'PHOTOS' && (
            <div className="pulse-tab-content-block">
              <div className="pulse-photos-masonry">
                {selectedRestaurant.galleryUrls.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt="gallery"
                    className="pulse-masonry-img"
                    onClick={() => setActiveGalleryIdx(i)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Reviews */}
          {activeTab === 'REVIEWS' && (
            <div className="pulse-tab-content-block">
              <div className="pulse-reviews-summary">
                <div className="pulse-reviews-score">
                  <span className="pulse-big-score">{selectedRestaurant.rating.toFixed(1)}</span>
                  <div className="pulse-stars-row">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14} fill="#3b82f6" color="#3b82f6" />
                    ))}
                  </div>
                  <span className="pulse-reviews-count">{selectedRestaurant.reviewCount} Ratings</span>
                </div>
              </div>

              <div className="pulse-user-review-card">
                <div className="pulse-reviewer-row">
                  <div className="pulse-reviewer-avatar">RK</div>
                  <div>
                    <div className="pulse-reviewer-name">Rohan Kapoor</div>
                    <div className="pulse-review-date">Verified Diner • 2 days ago</div>
                  </div>
                  <div className="pulse-rating-box">5.0 ★</div>
                </div>
                <p className="pulse-review-body">
                  "Exquisite experience! The Truffle Tagliolini was prepared to perfection. Incredible city skyline views and top notch hospitality."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Reservation CTA */}
        <div className="pulse-detail-sticky-bar">
          <div>
            <div className="pulse-sticky-avail">Table Available Tonight</div>
            <div className="pulse-sticky-sub">Instant confirmation via Pulse</div>
          </div>
          <button
            type="button"
            className="pulse-primary-cta-btn"
            onClick={() => setIsTableSheetOpen(true)}
          >
            Reserve Table
          </button>
        </div>
      </div>
    </div>
  );
};

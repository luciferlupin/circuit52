import React, { useState, useEffect } from 'react';
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
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Eye,
  Camera,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const PHOTO_METAS = [
  {
    title: 'Main Cash Game Pit',
    tag: 'TABLES & FELTS',
    desc: 'Custom microfiber felt tables equipped with continuous auto-shufflers and 13.56 MHz RFID readers.'
  },
  {
    title: "Bobby's Room VIP Sanctuary",
    tag: 'VIP SANCTUARY',
    desc: 'Private high-stakes salon with sound isolation, dedicated cage runner, and bespoke leather seating.'
  },
  {
    title: 'VIP Tableside Dining & Bar',
    tag: 'BAR & DINING',
    desc: 'Artisanal cocktails and gourmet tableside dining delivered directly to your chip stack without interrupting play.'
  },
  {
    title: '4K RFID Feature Stage',
    tag: 'STREAM STAGE',
    desc: 'Broadcast-calibrated feature table with instant graphic overlays, hidden RFID sensors, and RFID card tracking.'
  },
  {
    title: 'Skyline Players Terrace',
    tag: 'LOUNGE',
    desc: 'Exclusive open-air strategy terrace and cigar lounge overlooking the city skyline for break intervals.'
  }
];

export const RestaurantDetailModal: React.FC = () => {
  const {
    selectedRestaurant,
    setSelectedRestaurant,
    savedItemIds,
    toggleSaveItem,
    setIsTableSheetOpen
  } = usePulse();

  const [activeGalleryIdx, setActiveGalleryIdx] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TABLES' | 'RULES' | 'DINING' | 'PHOTOS' | 'REVIEWS'>('OVERVIEW');
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [photoFilter, setPhotoFilter] = useState<string>('ALL');
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 45;

  // Keyboard navigation when Lightbox is open
  useEffect(() => {
    if (!isLightboxOpen || !selectedRestaurant) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveGalleryIdx(prev => (prev + 1) % selectedRestaurant.galleryUrls.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveGalleryIdx(prev =>
          (prev - 1 + selectedRestaurant.galleryUrls.length) % selectedRestaurant.galleryUrls.length
        );
      } else if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, selectedRestaurant]);

  // Reset zoom on photo change or lightbox close
  useEffect(() => {
    setIsZoomed(false);
  }, [activeGalleryIdx, isLightboxOpen]);

  if (!selectedRestaurant) return null;

  const isSaved = savedItemIds.includes(selectedRestaurant.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedRestaurant.name,
        text: `Check out ${selectedRestaurant.name} on Circuit 52!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      alert(`Link copied: ${selectedRestaurant.name} on Circuit 52`);
    }
  };

  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveGalleryIdx(prev =>
      (prev - 1 + selectedRestaurant.galleryUrls.length) % selectedRestaurant.galleryUrls.length
    );
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveGalleryIdx(prev =>
      (prev + 1) % selectedRestaurant.galleryUrls.length
    );
  };

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      // Swiped Left -> Next
      handleNextPhoto();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev
      handlePrevPhoto();
    }
  };

  const currentMeta = PHOTO_METAS[activeGalleryIdx % PHOTO_METAS.length];

  const filteredPhotos = selectedRestaurant.galleryUrls.map((url, idx) => ({
    url,
    idx,
    meta: PHOTO_METAS[idx % PHOTO_METAS.length]
  })).filter(item => {
    if (photoFilter === 'ALL') return true;
    if (photoFilter === 'TABLES' && (item.meta.tag.includes('TABLES') || item.meta.tag.includes('STREAM'))) return true;
    if (photoFilter === 'VIP' && (item.meta.tag.includes('VIP') || item.meta.tag.includes('LOUNGE'))) return true;
    if (photoFilter === 'DINING' && item.meta.tag.includes('DINING')) return true;
    return true;
  });

  return (
    <div className="pulse-detail-overlay" onClick={() => setSelectedRestaurant(null)}>
      <div className="pulse-detail-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Top Handle */}
        <div className="pulse-sheet-handle" />

        {/* Immersive Interactive Image Gallery */}
        <div
          className="pulse-detail-gallery-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Hero Photo with Vignette */}
          <div
            className="pulse-hero-img-stage"
            onClick={() => setIsLightboxOpen(true)}
            title="Tap to open Fullscreen Gallery"
          >
            <img
              src={selectedRestaurant.galleryUrls[activeGalleryIdx] || selectedRestaurant.imageUrl}
              alt={currentMeta.title}
              className="pulse-detail-hero-img"
            />
            <div className="pulse-detail-hero-vignette" />
          </div>

          {/* Floating Actions Bar */}
          <div className="pulse-gallery-overlay-bar" onClick={e => e.stopPropagation()}>
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

          {/* Carousel Prev/Next Buttons */}
          <button
            type="button"
            className="pulse-gallery-nav-arrow left"
            onClick={handlePrevPhoto}
            aria-label="Previous photo"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            className="pulse-gallery-nav-arrow right"
            onClick={handleNextPhoto}
            aria-label="Next photo"
          >
            <ChevronRight size={20} />
          </button>

          {/* Bottom Bar: Tag + Animated Dots + Counter Button */}
          <div className="pulse-hero-gallery-bottom-bar" onClick={e => e.stopPropagation()}>
            <span className="pulse-hero-gallery-tag">
              <Sparkles size={11} /> {currentMeta.tag}
            </span>

            {/* Pagination Dots */}
            <div className="pulse-hero-dots-indicator">
              {selectedRestaurant.galleryUrls.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Jump to photo ${i + 1}`}
                  className={`pulse-hero-dot ${i === activeGalleryIdx ? 'active' : ''}`}
                  onClick={() => setActiveGalleryIdx(i)}
                />
              ))}
            </div>

            {/* Expand / Counter Pill */}
            <button
              type="button"
              className="pulse-gallery-count-pill"
              onClick={() => setIsLightboxOpen(true)}
              aria-label="Open Fullscreen Gallery"
            >
              <Maximize2 size={12} />
              <span>{activeGalleryIdx + 1} / {selectedRestaurant.galleryUrls.length} • HD</span>
            </button>
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
                <Star size={13} fill="#f59e0b" color="#f59e0b" />
              </div>
            </div>

            <div className="pulse-detail-reviews-sub">
              ★ {selectedRestaurant.rating.toFixed(1)} • {selectedRestaurant.reviewCount.toLocaleString()} verified ratings
            </div>

            <div className="pulse-detail-cuisine-row">
              <span>{selectedRestaurant.cuisine.join(' • ')}</span>
            </div>

            <div className="pulse-detail-meta-pills">
              <span className="pulse-detail-pill">
                <MapPin size={12} /> {selectedRestaurant.area} ({selectedRestaurant.distanceKm} km)
              </span>
              <span className="pulse-detail-pill">
                From ₹{selectedRestaurant.priceForTwo.toLocaleString()} buy-in
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
              <span>Reserve Seat</span>
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
              <span>Call Club</span>
            </button>
          </div>

          {/* Featured Offer Banner */}
          {selectedRestaurant.featuredOffer && (
            <div className="pulse-detail-offer-banner">
              <Sparkles size={16} className="pulse-offer-sparkle" />
              <div>
                <div className="pulse-offer-title">EXCLUSIVE CIRCUIT 52 PERK</div>
                <div className="pulse-offer-desc">{selectedRestaurant.featuredOffer}</div>
              </div>
            </div>
          )}

          {/* Tabs: Overview, Tables, Rules, Dining, Photos, Reviews */}
          <div className="pulse-detail-tabs-bar">
            {(['OVERVIEW', 'TABLES', 'RULES', 'DINING', 'PHOTOS', 'REVIEWS'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                className={`pulse-detail-tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'RULES' ? 'RULES & RAKE' : tab}
              </button>
            ))}
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'OVERVIEW' && (
            <div className="pulse-tab-content-block">
              {/* About */}
              <div className="pulse-detail-section">
                <h4 className="pulse-detail-section-title">About the Poker Club & Lounge</h4>
                <p className="pulse-detail-about-text">{selectedRestaurant.about}</p>
              </div>

              {/* Club Amenities & Smart Technology */}
              <div className="pulse-detail-section">
                <h4 className="pulse-detail-section-title">Club Amenities & Technology</h4>
                <div className="pulse-facilities-tags">
                  {selectedRestaurant.facilities.map((fac, i) => (
                    <span key={i} className="pulse-facility-tag">
                      <CheckCircle2 size={13} className="pulse-fac-check" />
                      <span>{fac}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Club Atmosphere & Gallery Preview Section */}
              <div className="pulse-detail-section">
                <div className="pulse-gallery-section-header">
                  <div>
                    <h4 className="pulse-detail-section-title" style={{ margin: 0 }}>Club Atmosphere & Gallery</h4>
                    <p className="pulse-gallery-section-sub">Verified high-definition captures of felts, tables & VIP lounges</p>
                  </div>
                  <button
                    type="button"
                    className="pulse-see-all-photos-btn"
                    onClick={() => setActiveTab('PHOTOS')}
                  >
                    <span>See All ({selectedRestaurant.galleryUrls.length})</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="pulse-overview-photo-mosaic">
                  <div
                    className="pulse-mosaic-item large"
                    onClick={() => {
                      setActiveGalleryIdx(0);
                      setIsLightboxOpen(true);
                    }}
                  >
                    <img src={selectedRestaurant.galleryUrls[0]} alt="Featured felt" className="pulse-mosaic-img" />
                    <span className="pulse-mosaic-tag">Main RFID Pit</span>
                    <div className="pulse-mosaic-zoom-pill"><Eye size={12} /> View HD</div>
                  </div>

                  <div className="pulse-mosaic-col">
                    <div
                      className="pulse-mosaic-item"
                      onClick={() => {
                        setActiveGalleryIdx(1);
                        setIsLightboxOpen(true);
                      }}
                    >
                      <img src={selectedRestaurant.galleryUrls[1]} alt="VIP Salon" className="pulse-mosaic-img" />
                      <span className="pulse-mosaic-tag">VIP Salon</span>
                    </div>
                    <div
                      className="pulse-mosaic-item more-overlay"
                      onClick={() => {
                        setActiveGalleryIdx(2);
                        setIsLightboxOpen(true);
                      }}
                    >
                      <img src={selectedRestaurant.galleryUrls[2]} alt="Bar & Dining" className="pulse-mosaic-img" />
                      <div className="pulse-mosaic-more-badge">
                        <Camera size={16} />
                        <span>+{selectedRestaurant.galleryUrls.length - 2} More</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Address */}
              <div className="pulse-detail-section">
                <h4 className="pulse-detail-section-title">Location & Floor Security</h4>
                <p className="pulse-detail-address-text">{selectedRestaurant.address}</p>
                <div className="pulse-detail-contact-row">
                  <span>Phone: {selectedRestaurant.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Live Cash Tables */}
          {activeTab === 'TABLES' && (
            <div className="pulse-tab-content-block">
              <div className="pulse-detail-section">
                <div className="pulse-live-action-banner">
                  <div className="pulse-lab-left">
                    <span className="pulse-dot-live" />
                    <strong>Live Cash Game Tables</strong>
                  </div>
                  <span className="pulse-lab-count">3 Tables Active</span>
                </div>

                <div className="pulse-tables-list">
                  <div className="pulse-venue-table-card">
                    <div className="pulse-vtc-top">
                      <div>
                        <div className="pulse-vtc-name">Table 1 • ₹100/₹200 Deepstack NLH</div>
                        <div className="pulse-vtc-sub">8/9 Players • Min Buy-in: ₹10,000</div>
                      </div>
                      <span className="pulse-card-avail-pill green">
                        <span className="pulse-dot-live" /> 1 Seat Open
                      </span>
                    </div>
                    <div className="pulse-vtc-footer">
                      <span className="pulse-vtc-felt-tag">RFID Smart Felt • Auto Shuffler</span>
                      <button
                        type="button"
                        className="pulse-vtc-reserve-btn"
                        onClick={() => setIsTableSheetOpen(true)}
                      >
                        Reserve Seat
                      </button>
                    </div>
                  </div>

                  <div className="pulse-venue-table-card">
                    <div className="pulse-vtc-top">
                      <div>
                        <div className="pulse-vtc-name">Table 2 • ₹200/₹500 PLO-5 Action</div>
                        <div className="pulse-vtc-sub">7/9 Players • Min Buy-in: ₹25,000</div>
                      </div>
                      <span className="pulse-card-avail-pill green">
                        <span className="pulse-dot-live" /> 2 Seats Open
                      </span>
                    </div>
                    <div className="pulse-vtc-footer">
                      <span className="pulse-vtc-felt-tag">Deepstack • Double Board Bomb Pots</span>
                      <button
                        type="button"
                        className="pulse-vtc-reserve-btn"
                        onClick={() => setIsTableSheetOpen(true)}
                      >
                        Reserve Seat
                      </button>
                    </div>
                  </div>

                  <div className="pulse-venue-table-card">
                    <div className="pulse-vtc-top">
                      <div>
                        <div className="pulse-vtc-name">Table 3 • ₹500/₹1,000 High Roller Mixed</div>
                        <div className="pulse-vtc-sub">9/9 Players • Min Buy-in: ₹50,000</div>
                      </div>
                      <span className="pulse-card-avail-pill orange">
                        <Clock size={11} /> 15m waitlist (2 in queue)
                      </span>
                    </div>
                    <div className="pulse-vtc-footer">
                      <span className="pulse-vtc-felt-tag">Private VIP Salon • Uncapped</span>
                      <button
                        type="button"
                        className="pulse-vtc-reserve-btn"
                        onClick={() => {
                          alert('Joined Table 3 Waitlist! You are Queue #2. Circuit 52 will hold your seat for 180 seconds when ready.');
                        }}
                      >
                        Join Waitlist (#2)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: House Rules & Rake */}
          {activeTab === 'RULES' && (
            <div className="pulse-tab-content-block">
              <div className="pulse-detail-section">
                <h4 className="pulse-detail-section-title">Club Operating Rules & Rake Caps</h4>
                <div className="pulse-club-rules-grid">
                  <div className="pulse-rule-card">
                    <div className="pulse-rc-title">RAKE STRUCTURE</div>
                    <div className="pulse-rc-val">5% Capped at ₹500</div>
                    <div className="pulse-rc-desc">Strict "No Flop, No Drop" policy enforced on all pots.</div>
                  </div>

                  <div className="pulse-rule-card">
                    <div className="pulse-rc-title">RUN IT TWICE POLICY</div>
                    <div className="pulse-rc-val">Double Board Allowed</div>
                    <div className="pulse-rc-desc">Available upon agreement on all all-in heads-up showdowns.</div>
                  </div>

                  <div className="pulse-rule-card">
                    <div className="pulse-rc-title">STRADDLE RULES</div>
                    <div className="pulse-rc-val">Mississippi Straddle</div>
                    <div className="pulse-rc-desc">Button or UTG straddle allowed up to 4x big blind.</div>
                  </div>

                  <div className="pulse-rule-card">
                    <div className="pulse-rc-title">RFID CHIP VERIFICATION</div>
                    <div className="pulse-rc-val">100% Anti-Counterfeit</div>
                    <div className="pulse-rc-desc">All high-denomination chips embedded with 13.56 MHz RFID tags.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Dining */}
          {activeTab === 'DINING' && (
            <div className="pulse-tab-content-block">
              <div className="pulse-detail-section">
                <h4 className="pulse-detail-section-title">VIP Tableside Dining & Beverages</h4>
                <div className="pulse-menu-list">
                  {selectedRestaurant.popularDishes.map((dish, i) => (
                    <div key={i} className="pulse-menu-row">
                      <div>
                        <div className="pulse-dish-header">
                          <span className={`pulse-veg-indicator ${dish.isVeg ? 'veg' : 'non-veg'}`} />
                          <span className="pulse-dish-name">{dish.name}</span>
                        </div>
                        <span className="pulse-dish-sub">Prepared fresh tableside with artisanal ingredients</span>
                      </div>
                      <span className="pulse-dish-price">₹{dish.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: PHOTOS (Proper Enhanced Gallery) */}
          {activeTab === 'PHOTOS' && (
            <div className="pulse-tab-content-block">
              {/* Photo Filter Pills & Slideshow Launch */}
              <div className="pulse-photos-action-header">
                <div className="pulse-photo-filter-chips">
                  {[
                    { id: 'ALL', label: `All (${selectedRestaurant.galleryUrls.length})` },
                    { id: 'TABLES', label: 'Tables & Felts' },
                    { id: 'VIP', label: 'VIP Sanctuaries' },
                    { id: 'DINING', label: 'Bar & Dining' }
                  ].map(chip => (
                    <button
                      key={chip.id}
                      type="button"
                      className={`pulse-pfilter-chip ${photoFilter === chip.id ? 'active' : ''}`}
                      onClick={() => setPhotoFilter(chip.id)}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pulse-launch-slideshow-btn"
                  onClick={() => {
                    setActiveGalleryIdx(0);
                    setIsLightboxOpen(true);
                  }}
                >
                  <Maximize2 size={13} />
                  <span>Slideshow Tour</span>
                </button>
              </div>

              {/* Photos Gallery Grid */}
              <div className="pulse-gallery-cards-grid">
                {filteredPhotos.map((item) => (
                  <div
                    key={item.idx}
                    className="pulse-gallery-card-item"
                    onClick={() => {
                      setActiveGalleryIdx(item.idx);
                      setIsLightboxOpen(true);
                    }}
                  >
                    <img
                      src={item.url}
                      alt={item.meta.title}
                      className="pulse-gcard-img"
                      loading="lazy"
                    />
                    <div className="pulse-gcard-overlay">
                      <span className="pulse-gcard-tag">{item.meta.tag}</span>
                      <div className="pulse-gcard-meta">
                        <h5 className="pulse-gcard-title">{item.meta.title}</h5>
                        <p className="pulse-gcard-sub">{item.meta.desc}</p>
                      </div>
                      <div className="pulse-gcard-zoom-icon">
                        <Eye size={16} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Reviews */}
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
                    <div className="pulse-reviewer-name">Rohan "Shark" Kapoor</div>
                    <div className="pulse-review-date">Verified Player • 2 days ago</div>
                  </div>
                  <div className="pulse-rating-box">5.0 ★</div>
                </div>
                <p className="pulse-review-body">
                  "Exquisite high stakes felt! The RFID smart table tracking is seamless, zero dealer mistakes, and the tableside Wagyu was prepared to perfection. Top tier poker operating experience."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom Reservation CTA */}
        <div className="pulse-detail-sticky-bar">
          <div>
            <div className="pulse-sticky-avail">Live Tables Running Tonight</div>
            <div className="pulse-sticky-sub">Instant seat booking via Circuit 52</div>
          </div>
          <button
            type="button"
            className="pulse-primary-cta-btn"
            onClick={() => setIsTableSheetOpen(true)}
          >
            Reserve Table Seat
          </button>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX PHOTO VIEWER MODAL */}
      {isLightboxOpen && (
        <div className="pulse-lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
          <div className="pulse-lightbox-content" onClick={e => e.stopPropagation()}>
            {/* Top Bar */}
            <div className="pulse-lightbox-header">
              <div className="pulse-lightbox-counter">
                <Camera size={16} />
                <span>Photo {activeGalleryIdx + 1} of {selectedRestaurant.galleryUrls.length}</span>
              </div>

              <div className="pulse-lightbox-header-actions">
                <button
                  type="button"
                  className={`pulse-lightbox-action-btn ${isZoomed ? 'active' : ''}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                  title={isZoomed ? "Reset Zoom" : "Zoom In"}
                  aria-label="Toggle Zoom"
                >
                  {isZoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
                </button>
                <button
                  type="button"
                  className="pulse-lightbox-close"
                  onClick={() => setIsLightboxOpen(false)}
                  aria-label="Close lightbox"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Lightbox Image Stage with Swipe Gestures */}
            <div
              className="pulse-lightbox-stage"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <button
                type="button"
                className="pulse-lightbox-nav prev"
                onClick={handlePrevPhoto}
                aria-label="Previous"
              >
                <ChevronLeft size={28} />
              </button>

              <div className={`pulse-lightbox-img-wrapper ${isZoomed ? 'zoomed' : ''}`}>
                <img
                  src={selectedRestaurant.galleryUrls[activeGalleryIdx]}
                  alt={currentMeta.title}
                  className="pulse-lightbox-main-img"
                  style={{
                    transform: isZoomed ? 'scale(1.55)' : 'scale(1)',
                    transition: 'transform 0.25s ease'
                  }}
                  onClick={() => setIsZoomed(!isZoomed)}
                />
              </div>

              <button
                type="button"
                className="pulse-lightbox-nav next"
                onClick={handleNextPhoto}
                aria-label="Next"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="pulse-lightbox-caption-bar">
              <div className="pulse-lb-tag">{currentMeta.tag}</div>
              <h4 className="pulse-lb-title">{currentMeta.title}</h4>
              <p className="pulse-lb-desc">{currentMeta.desc}</p>
            </div>

            {/* Bottom Thumbnail Strip */}
            <div className="pulse-lightbox-thumbnails">
              {selectedRestaurant.galleryUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="strip thumb"
                  className={`pulse-lb-thumb ${i === activeGalleryIdx ? 'active' : ''}`}
                  onClick={() => setActiveGalleryIdx(i)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

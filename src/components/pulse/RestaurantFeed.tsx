import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import type { Restaurant } from '../../types/pulse';
import {
  Star,
  Bookmark,
  Sparkles,
  Clock,
  ArrowRight,
  Flame,
  ShieldCheck,
  Trophy,
  CalendarDays,
  Zap,
  CheckCircle2,
  ChevronRight,
  Utensils
} from 'lucide-react';

export const RestaurantFeed: React.FC = () => {
  const {
    restaurants,
    movies,
    setSelectedRestaurant,
    setSelectedMovie,
    setIsTableSheetOpen,
    setActiveCategory,
    setActiveTab,
    savedItemIds,
    toggleSaveItem,
    activeFilterChip,
    filters
  } = usePulse();

  const [stakesFilter, setStakesFilter] = useState<'ALL' | '100_200' | '200_500' | '500_1000' | 'VIP'>('ALL');

  // Apply contextual filters & stakes filter
  const filteredRestaurants = restaurants.filter(r => {
    // Stakes filter
    if (stakesFilter === '100_200' && !r.cuisine.some(c => c.includes('100/200') || c.includes('100/₹200')) && !r.popularDishes.some(d => d.name.includes('100/200'))) return false;
    if (stakesFilter === '200_500' && !r.cuisine.some(c => c.includes('200/500') || c.includes('200/₹500')) && !r.popularDishes.some(d => d.name.includes('200/500'))) return false;
    if (stakesFilter === '500_1000' && !r.cuisine.some(c => c.includes('500') || c.includes('1,000') || c.includes('1000')) && r.priceForTwo < 20000) return false;
    if (stakesFilter === 'VIP' && r.priceForTwo < 30000 && !r.about.toLowerCase().includes('bobby') && !r.name.toLowerCase().includes('high roller')) return false;

    // Quick filter chips
    if (activeFilterChip === 'TOP_RATED' && r.rating < 4.7) return false;
    if (activeFilterChip === 'NEAR_ME' && r.distanceKm > 3.0) return false;
    if (activeFilterChip === 'OFFERS' && !r.featuredOffer) return false;
    if (activeFilterChip === 'UNDER_500' && r.priceForTwo > 15000) return false;
    if (activeFilterChip === 'PREMIUM' && r.priceForTwo < 20000) return false;
    if (activeFilterChip === 'NEW' && r.sectionTag !== 'NEW') return false;

    // Advanced bottom sheet filters
    if (filters.openNow && !r.isOpen) return false;
    if (filters.outdoorSeating && !r.facilities.some(f => f.toLowerCase().includes('outdoor') || f.toLowerCase().includes('rooftop'))) return false;
    if (filters.minRating && r.rating < filters.minRating) return false;
    if (filters.maxDistanceKm && r.distanceKm > filters.maxDistanceKm) return false;

    return true;
  });

  const popularList = filteredRestaurants.filter(r => r.sectionTag === 'POPULAR' || r.sectionTag === 'TRENDING');
  const dateNightList = filteredRestaurants.filter(r => r.sectionTag === 'DATE_NIGHT' || r.priceForTwo >= 20000);
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

          {/* Quick Action Bar on Card */}
          <div className="pulse-card-quick-actions" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="pulse-card-reserve-cta"
              onClick={() => {
                setSelectedRestaurant(restaurant);
                setIsTableSheetOpen(true);
              }}
            >
              <CalendarDays size={13} />
              <span>Reserve Table</span>
            </button>
            <button
              type="button"
              className="pulse-card-view-btn"
              onClick={() => setSelectedRestaurant(restaurant)}
            >
              <span>View Club</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pulse-dining-feed">
      {/* 1. REAL-TIME CIRCUIT 52 ACTION MARQUEE TICKER */}
      <div className="pulse-live-marquee-container">
        <div className="pulse-live-chip">
          <span className="pulse-dot-live" />
          <span>CIRCUIT 52 LIVE</span>
        </div>
        <div className="pulse-marquee-content-track">
          <span className="pulse-marquee-text">
            ⚡ Wynn: Table 1 (₹100/₹200 NLH) has 1 open seat • 🏆 Aria ₹50L GTD Flight A Registration Open (Tonight 8:00 PM) • 🔥 Bellagio: Bobby's Room ₹500/₹1k High Stakes Active • 💎 Hourly High Hand: ₹50,000 Guarantee Running • 🛡️ 180s Seat Hold Guarantee Active
          </span>
        </div>
      </div>

      {/* 2. FEATURED LIVE ACTION TABLE (1-TAP INSTANT SEAT HOLD) */}
      <div className="pulse-flt-banner-wrapper">
        <div className="pulse-flt-card">
          <div className="pulse-flt-header">
            <div className="pulse-flt-badge">
              <Flame size={13} className="pulse-flt-flame-icon" />
              <span>FEATURED LIVE TABLE • INDIRANAGAR</span>
            </div>
            <span className="pulse-flt-seated-pill">
              <span className="pulse-dot-live" /> 8/9 Seated
            </span>
          </div>

          <div className="pulse-flt-body">
            <div className="pulse-flt-venue-row">
              <div>
                <h4 className="pulse-flt-title">Wynn Poker Room — Table 1</h4>
                <div className="pulse-flt-stakes">₹100/₹200 Deepstack NLH • Min Buy-in: ₹10,000</div>
              </div>
              <span className="pulse-flt-seat-open-badge">Seat #4 Open</span>
            </div>

            <div className="pulse-flt-amenities-row">
              <span className="pulse-flt-tag">
                <Zap size={11} /> RFID Smart Felt
              </span>
              <span className="pulse-flt-tag">
                <CheckCircle2 size={11} /> Auto Shuffler
              </span>
              <span className="pulse-flt-tag">
                <Utensils size={11} /> Tableside Wagyu
              </span>
            </div>

            <div className="pulse-flt-actions-row">
              <button
                type="button"
                className="pulse-flt-primary-btn"
                onClick={() => {
                  setSelectedRestaurant(restaurants[0]);
                  setIsTableSheetOpen(true);
                }}
              >
                <CalendarDays size={15} />
                <span>Reserve Seat #4 (180s Guarantee)</span>
              </button>
              <button
                type="button"
                className="pulse-flt-ghost-btn"
                onClick={() => setSelectedRestaurant(restaurants[0])}
              >
                <span>Club Details</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. DAILY TABLE STREAK & LUCKY CHIP MINI BANNER */}
      <div className="pulse-streak-mini-banner" onClick={() => setActiveTab('PROFILE')}>
        <div className="pulse-smb-left">
          <div className="pulse-smb-flame-circle">
            <Flame size={18} className="pulse-smb-flame" />
          </div>
          <div>
            <div className="pulse-smb-title">
              <span>4-Day Table Streak Active!</span>
              <span className="pulse-smb-level-tag">LVL 24</span>
            </div>
            <div className="pulse-smb-xp-bar-bg">
              <div className="pulse-smb-xp-fill" style={{ width: '84.5%' }} />
            </div>
            <span className="pulse-smb-sub">8,450 / 10,000 XP • Black Card Master</span>
          </div>
        </div>
        <button
          type="button"
          className="pulse-smb-roll-btn"
          onClick={(e) => {
            e.stopPropagation();
            setActiveTab('PROFILE');
          }}
        >
          <Sparkles size={13} />
          <span>Lucky Roll</span>
        </button>
      </div>

      {/* 4. FAST STAKES FILTER RAIL */}
      <div className="pulse-stakes-rail-container">
        <div className="pulse-stakes-rail-title-row">
          <span className="pulse-stakes-rail-label">Filter by Stakes & Action</span>
          <span className="pulse-stakes-count">{filteredRestaurants.length} Clubs Available</span>
        </div>
        <div className="pulse-stakes-rail">
          {[
            { id: 'ALL', label: 'All Stakes' },
            { id: '100_200', label: '₹100/₹200 Mid Stakes' },
            { id: '200_500', label: '₹200/₹500 Action PLO' },
            { id: '500_1000', label: '₹500/₹1,000 High Roller' },
            { id: 'VIP', label: "Bobby's Room VIP" }
          ].map(stk => (
            <button
              key={stk.id}
              type="button"
              className={`pulse-stakes-chip ${stakesFilter === stk.id ? 'active' : ''}`}
              onClick={() => setStakesFilter(stk.id as any)}
            >
              {stk.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. UPCOMING WEEKEND TOURNAMENTS & GTD FLIGHTS SHOWCASE */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Upcoming Weekend Flights & Tourneys</h3>
            <p className="pulse-section-subtitle">Championship deepstacks, bounty blitz & guaranteed prize pools</p>
          </div>
          <button
            type="button"
            className="pulse-section-see-all"
            onClick={() => setActiveCategory('MOVIES')}
          >
            <span>See all tourneys</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="pulse-tourney-showcase-row">
          {movies.slice(0, 2).map((tourney) => (
            <div
              key={tourney.id}
              className="pulse-tourney-preview-card"
              onClick={() => setSelectedMovie(tourney)}
            >
              <div className="pulse-tpc-poster-wrapper">
                <img src={tourney.posterUrl} alt={tourney.title} className="pulse-tpc-img" />
                <div className="pulse-tpc-vignette" />
                <span className="pulse-tpc-live-badge">
                  <Trophy size={11} /> GTD PRIZE POOL
                </span>
                <span className="pulse-tpc-time-badge">
                  <Clock size={11} /> {tourney.releaseDate}
                </span>
              </div>
              <div className="pulse-tpc-info">
                <h4 className="pulse-tpc-title">{tourney.title}</h4>
                <div className="pulse-tpc-meta">
                  <span>{tourney.language}</span>
                  <span className="pulse-tpc-dot">•</span>
                  <span>{tourney.runtime}</span>
                </div>
                <button
                  type="button"
                  className="pulse-tpc-cta-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMovie(tourney);
                  }}
                >
                  <Trophy size={13} />
                  <span>Register Seat Flight</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SECTION 1: Live Cash Game Poker Clubs */}
      <section className="pulse-feed-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Live Cash Game Poker Clubs</h3>
            <p className="pulse-section-subtitle">Active cash tables, real-time waitlists & instant seat holds</p>
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

      {/* 7. SECTION 2: High Roller & VIP Lounges */}
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

      {/* 8. SECTION 3: Action PLO & Deepstack Rooms */}
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

      {/* 9. CIRCUIT 52 CLUB STANDARDS & INTEGRITY BADGES */}
      <section className="pulse-feed-section pulse-trust-section">
        <div className="pulse-section-header">
          <div>
            <h3 className="pulse-section-title">Circuit 52 Club Guarantee</h3>
            <p className="pulse-section-subtitle">Strict compliance, certified security & tableside perks</p>
          </div>
        </div>

        <div className="pulse-trust-grid">
          <div className="pulse-trust-card">
            <ShieldCheck size={22} className="pulse-trust-icon" />
            <h5 className="pulse-trust-title">RFID 13.56 MHz Anti-Cheat</h5>
            <p className="pulse-trust-desc">All chips and decks scanned continuously to eliminate counterfeit risks.</p>
          </div>

          <div className="pulse-trust-card">
            <Clock size={22} className="pulse-trust-icon" />
            <h5 className="pulse-trust-title">180s Seat Hold Guarantee</h5>
            <p className="pulse-trust-desc">Your table seat is reserved with a digital timer as soon as you book.</p>
          </div>

          <div className="pulse-trust-card">
            <Zap size={22} className="pulse-trust-icon" />
            <h5 className="pulse-trust-title">Strict Rake Cap Policy</h5>
            <p className="pulse-trust-desc">5% capped with universal "No Flop, No Drop" policy enforced at all clubs.</p>
          </div>

          <div className="pulse-trust-card">
            <Utensils size={22} className="pulse-trust-icon" />
            <h5 className="pulse-trust-title">VIP Tableside Dining</h5>
            <p className="pulse-trust-desc">Artisanal cuisine served directly to your felt station without leaving play.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

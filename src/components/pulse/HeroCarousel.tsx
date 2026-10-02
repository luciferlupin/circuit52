import React, { useState, useEffect } from 'react';
import { usePulse } from '../../context/PulseContext';
import { HERO_CAROUSEL_ITEMS } from '../../data/pulseData';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export const HeroCarousel: React.FC = () => {
  const {
    setActiveCategory,
    setSelectedMovie,
    setSelectedEvent,
    setSelectedRestaurant,
    movies,
    events,
    restaurants
  } = usePulse();

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Touch swipe support for mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 40;

  // Auto rotate carousel gently every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % HERO_CAROUSEL_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % HERO_CAROUSEL_ITEMS.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + HERO_CAROUSEL_ITEMS.length) % HERO_CAROUSEL_ITEMS.length);
  };

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
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const handleCtaClick = (item: (typeof HERO_CAROUSEL_ITEMS)[number]) => {
    setActiveCategory(item.category as any);
    if ((item.category as string) === 'MOVIES') {
      setSelectedMovie(movies[0] || null);
    } else if ((item.category as string) === 'EVENTS') {
      setSelectedEvent(events[0] || null);
    } else if ((item.category as string) === 'DINING') {
      setSelectedRestaurant(restaurants[0] || null);
    }
  };

  const currentItem = HERO_CAROUSEL_ITEMS[currentIndex];

  return (
    <div className="pulse-hero-carousel-wrapper">
      <div
        className="pulse-hero-carousel"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cinematic Card */}
        <div
          key={currentItem.id}
          className="pulse-hero-card"
          onClick={() => handleCtaClick(currentItem)}
        >
          {/* Background Photography */}
          <img
            src={currentItem.imageUrl}
            alt={currentItem.headline}
            className="pulse-hero-bg-img"
          />

          {/* Contextual Vignette Gradients */}
          <div className="pulse-hero-vignette" />

          {/* Editorial Content Overlay */}
          <div className="pulse-hero-content">
            <div className="pulse-hero-top-tag">
              <Sparkles size={13} className="pulse-sparkle-icon" />
              <span>{currentItem.label}</span>
            </div>

            <h2 className="pulse-hero-headline">{currentItem.headline}</h2>
            <p className="pulse-hero-subtext">{currentItem.subtext}</p>

            <div className="pulse-hero-action-row">
              <button
                type="button"
                className="pulse-hero-cta-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCtaClick(currentItem);
                }}
              >
                <span>{currentItem.cta}</span>
                <ArrowRight size={15} />
              </button>

              {/* Navigation arrows */}
              <div className="pulse-hero-arrows">
                <button
                  type="button"
                  className="pulse-arrow-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="pulse-arrow-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  aria-label="Next slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Indicators */}
      <div className="pulse-hero-dots">
        {HERO_CAROUSEL_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            className={`pulse-hero-dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

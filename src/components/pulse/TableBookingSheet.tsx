import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  X,
  Users,
  Minus,
  Plus,
  Sparkles,
  ShieldCheck,
  Tag
} from 'lucide-react';

const DATES = [
  { label: 'Today', day: 'Wed', date: '02 Oct' },
  { label: 'Tomorrow', day: 'Thu', date: '03 Oct' },
  { label: 'Fri 04', day: 'Fri', date: '04 Oct' },
  { label: 'Sat 05', day: 'Sat', date: '05 Oct' },
  { label: 'Sun 06', day: 'Sun', date: '06 Oct' }
];

const TIME_SLOTS = {
  LUNCH: ['12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM'],
  DINNER: ['7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM']
};

export const TableBookingSheet: React.FC = () => {
  const {
    isTableSheetOpen,
    setIsTableSheetOpen,
    selectedRestaurant,
    tableGuests,
    setTableGuests,
    tableDate,
    setTableDate,
    tableTime,
    setTableTime,
    confirmTableBooking
  } = usePulse();

  const [mealPeriod, setMealPeriod] = useState<'DINNER' | 'LUNCH'>('DINNER');
  const [selectedOffer, setSelectedOffer] = useState<string>('PULSE20');

  if (!isTableSheetOpen || !selectedRestaurant) return null;

  return (
    <div className="pulse-modal-overlay" onClick={() => setIsTableSheetOpen(false)}>
      <div className="pulse-booking-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Handle */}
        <div className="pulse-sheet-handle" />

        {/* Top Header */}
        <div className="pulse-booking-header">
          <div>
            <span className="pulse-booking-step-badge">TABLE RESERVATION</span>
            <h3 className="pulse-booking-title">{selectedRestaurant.name}</h3>
            <p className="pulse-booking-sub">{selectedRestaurant.area}</p>
          </div>
          <button
            type="button"
            className="pulse-close-btn"
            onClick={() => setIsTableSheetOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="pulse-booking-scroll-body">
          {/* STEP 1: Select Guests (− 2 +) */}
          <div className="pulse-booking-section">
            <label className="pulse-step-label">
              <Users size={15} />
              <span>STEP 1 • NUMBER OF GUESTS</span>
            </label>

            <div className="pulse-guest-stepper">
              <button
                type="button"
                className="pulse-stepper-btn"
                onClick={() => setTableGuests(Math.max(1, tableGuests - 1))}
                disabled={tableGuests <= 1}
              >
                <Minus size={18} />
              </button>

              <div className="pulse-guest-count-box">
                <span className="pulse-guest-number">{tableGuests}</span>
                <span className="pulse-guest-sub">{tableGuests === 1 ? 'Guest' : 'Guests'}</span>
              </div>

              <button
                type="button"
                className="pulse-stepper-btn"
                onClick={() => setTableGuests(Math.min(12, tableGuests + 1))}
                disabled={tableGuests >= 12}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* STEP 2: Choose Date */}
          <div className="pulse-booking-section">
            <label className="pulse-step-label">
              <span>STEP 2 • CHOOSE DATE</span>
            </label>

            <div className="pulse-dates-carousel">
              {DATES.map((d, i) => {
                const isSelected = tableDate === d.label;
                return (
                  <button
                    key={i}
                    type="button"
                    className={`pulse-date-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => setTableDate(d.label)}
                  >
                    <span className="pulse-date-day">{d.day}</span>
                    <span className="pulse-date-label">{d.label}</span>
                    <span className="pulse-date-sub">{d.date}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: Choose Time Slots */}
          <div className="pulse-booking-section">
            <div className="pulse-step-header-with-toggle">
              <label className="pulse-step-label">
                <span>STEP 3 • CHOOSE TIME</span>
              </label>

              {/* Lunch / Dinner Selector */}
              <div className="pulse-period-toggle">
                <button
                  type="button"
                  className={`pulse-period-btn ${mealPeriod === 'DINNER' ? 'active' : ''}`}
                  onClick={() => setMealPeriod('DINNER')}
                >
                  Dinner
                </button>
                <button
                  type="button"
                  className={`pulse-period-btn ${mealPeriod === 'LUNCH' ? 'active' : ''}`}
                  onClick={() => setMealPeriod('LUNCH')}
                >
                  Lunch
                </button>
              </div>
            </div>

            <div className="pulse-time-slots-grid">
              {TIME_SLOTS[mealPeriod].map((time, idx) => {
                const isSelected = tableTime === time;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`pulse-time-slot-pill ${isSelected ? 'active' : ''}`}
                    onClick={() => setTableTime(time)}
                  >
                    <span>{time}</span>
                    {idx === 2 && <span className="pulse-slot-tag">Popular</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 4: Available Offers */}
          <div className="pulse-booking-section">
            <label className="pulse-step-label">
              <Tag size={14} />
              <span>STEP 4 • APPLIED DINING OFFER</span>
            </label>

            <div className="pulse-booking-offers-list">
              <div
                className={`pulse-booking-offer-card ${selectedOffer === 'PULSE20' ? 'selected' : ''}`}
                onClick={() => setSelectedOffer('PULSE20')}
              >
                <div className="pulse-offer-radio">
                  <div className={`pulse-radio-circle ${selectedOffer === 'PULSE20' ? 'checked' : ''}`} />
                </div>
                <div>
                  <div className="pulse-offer-card-title">Flat 20% OFF with Pulse Pay</div>
                  <div className="pulse-offer-card-sub">Automatic discount on your food and beverage bill</div>
                </div>
                <span className="pulse-offer-code-badge">PULSE20</span>
              </div>

              <div
                className={`pulse-booking-offer-card ${selectedOffer === 'DESSERT' ? 'selected' : ''}`}
                onClick={() => setSelectedOffer('DESSERT')}
              >
                <div className="pulse-offer-radio">
                  <div className={`pulse-radio-circle ${selectedOffer === 'DESSERT' ? 'checked' : ''}`} />
                </div>
                <div>
                  <div className="pulse-offer-card-title">Complimentary Signature Dessert</div>
                  <div className="pulse-offer-card-sub">Chef’s tasting treat with minimum 2 mains</div>
                </div>
                <span className="pulse-offer-code-badge">SWEET</span>
              </div>
            </div>
          </div>

          {/* Instant Guarantee Note */}
          <div className="pulse-booking-guarantee-note">
            <ShieldCheck size={16} />
            <span>Zero cancellation fee • Free booking • Instant confirmation</span>
          </div>
        </div>

        {/* STEP 5: Sticky Confirmation CTA */}
        <div className="pulse-booking-footer">
          <div className="pulse-booking-summary-pill">
            <span className="pulse-summary-text">
              <strong>{tableGuests} Guests</strong> • {tableDate}, {tableTime}
            </span>
            <span className="pulse-summary-badge">FREE</span>
          </div>

          <button
            type="button"
            className="pulse-confirm-booking-btn"
            onClick={() => confirmTableBooking(selectedRestaurant, selectedOffer)}
          >
            <Sparkles size={16} />
            <span>Confirm Reservation</span>
          </button>
        </div>
      </div>
    </div>
  );
};

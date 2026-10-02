import React, { useMemo } from 'react';
import { usePulse } from '../../context/PulseContext';
import type { Seat } from '../../types/pulse';
import { X, ArrowRight } from 'lucide-react';

export const SeatSelectionSheet: React.FC = () => {
  const {
    isSeatSheetOpen,
    setIsSeatSheetOpen,
    selectedMovie,
    activeCinema,
    activeShowtime,
    selectedSeats,
    toggleSeat,
    confirmMovieSeatsBooking
  } = usePulse();

  // Generate realistic cinema seating layout
  const seatLayout = useMemo(() => {
    const layout: { tierName: string; price: number; rows: { rowLabel: string; seats: Seat[] }[] }[] = [];

    // Recliner Rows (Row H)
    const reclinerRows = ['H'].map(rowLabel => ({
      rowLabel,
      seats: Array.from({ length: 8 }, (_, i) => {
        const id = `${rowLabel}${i + 1}`;
        const isSold = ['H3', 'H4'].includes(id);
        const isSel = selectedSeats.some(s => s.id === id);
        return {
          id,
          row: rowLabel,
          number: i + 1,
          tier: 'RECLINER' as const,
          price: (activeShowtime?.price || 450) + 200,
          status: isSel ? 'SELECTED' as const : isSold ? 'SOLD' as const : 'AVAILABLE' as const
        };
      })
    }));
    layout.push({ tierName: 'VIP Recliners', price: (activeShowtime?.price || 450) + 200, rows: reclinerRows });

    // Premium Rows (Rows E, F, G)
    const premiumRows = ['E', 'F', 'G'].map(rowLabel => ({
      rowLabel,
      seats: Array.from({ length: 14 }, (_, i) => {
        const id = `${rowLabel}${i + 1}`;
        const isSold = ['F3', 'F4', 'E7', 'E8', 'G12'].includes(id);
        const isSel = selectedSeats.some(s => s.id === id);
        return {
          id,
          row: rowLabel,
          number: i + 1,
          tier: 'PREMIUM' as const,
          price: activeShowtime?.price || 450,
          status: isSel ? 'SELECTED' as const : isSold ? 'SOLD' as const : 'AVAILABLE' as const
        };
      })
    }));
    layout.push({ tierName: 'Prime Laser Lounge', price: activeShowtime?.price || 450, rows: premiumRows });

    // Regular Rows (Rows A, B, C, D)
    const regularRows = ['A', 'B', 'C', 'D'].map(rowLabel => ({
      rowLabel,
      seats: Array.from({ length: 14 }, (_, i) => {
        const id = `${rowLabel}${i + 1}`;
        const isSold = ['B4', 'B5', 'C8', 'D2'].includes(id);
        const isSel = selectedSeats.some(s => s.id === id);
        return {
          id,
          row: rowLabel,
          number: i + 1,
          tier: 'REGULAR' as const,
          price: Math.max(200, (activeShowtime?.price || 450) - 120),
          status: isSel ? 'SELECTED' as const : isSold ? 'SOLD' as const : 'AVAILABLE' as const
        };
      })
    }));
    layout.push({ tierName: 'Standard Audi', price: Math.max(200, (activeShowtime?.price || 450) - 120), rows: regularRows });

    return layout;
  }, [activeShowtime, selectedSeats]);

  if (!isSeatSheetOpen || !selectedMovie || !activeCinema || !activeShowtime) return null;

  const totalAmount = selectedSeats.reduce((acc, s) => acc + s.price, 0);

  return (
    <div className="pulse-modal-overlay" onClick={() => setIsSeatSheetOpen(false)}>
      <div className="pulse-seat-sheet" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="pulse-sheet-handle" />

        {/* Top Header */}
        <div className="pulse-seat-header">
          <div>
            <h3 className="pulse-seat-movie-title">{selectedMovie.title}</h3>
            <p className="pulse-seat-cinema-sub">
              {activeCinema.name} • {activeShowtime.format} ({activeShowtime.time})
            </p>
          </div>
          <button
            type="button"
            className="pulse-close-btn"
            onClick={() => setIsSeatSheetOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Seat Legend */}
        <div className="pulse-seat-legend">
          <div className="pulse-legend-item">
            <span className="pulse-seat-sample available" />
            <span>Available</span>
          </div>
          <div className="pulse-legend-item">
            <span className="pulse-seat-sample selected" />
            <span>Selected</span>
          </div>
          <div className="pulse-legend-item">
            <span className="pulse-seat-sample sold" />
            <span>Sold</span>
          </div>
          <div className="pulse-legend-item">
            <span className="pulse-seat-sample recliner" />
            <span>Recliner</span>
          </div>
        </div>

        {/* Scrollable Theatre Area */}
        <div className="pulse-theatre-scroll-area">
          {/* Curved Screen Indicator */}
          <div className="pulse-screen-indicator-box">
            <div className="pulse-screen-curve" />
            <span className="pulse-screen-text">ALL EYES THIS WAY • 4K LASER SCREEN</span>
          </div>

          {/* Seat Grid Sections */}
          <div className="pulse-theatre-layout">
            {seatLayout.map((tier, tierIdx) => (
              <div key={tierIdx} className="pulse-tier-block">
                <div className="pulse-tier-header">
                  <span>{tier.tierName}</span>
                  <span className="pulse-tier-price">₹{tier.price}</span>
                </div>

                <div className="pulse-tier-rows">
                  {tier.rows.map((rowObj) => (
                    <div key={rowObj.rowLabel} className="pulse-seat-row">
                      <span className="pulse-row-label">{rowObj.rowLabel}</span>

                      <div className="pulse-seat-row-items">
                        {rowObj.seats.map((seat, seatIdx) => {
                          const isSelected = selectedSeats.some(s => s.id === seat.id);
                          return (
                            <React.Fragment key={seat.id}>
                              {/* Aisle gap in middle */}
                              {seatIdx === 4 && <div className="pulse-aisle-gap" />}
                              <button
                                type="button"
                                className={`pulse-seat-btn ${seat.tier.toLowerCase()} ${seat.status.toLowerCase()} ${isSelected ? 'selected' : ''}`}
                                disabled={seat.status === 'SOLD'}
                                onClick={() => toggleSeat(seat)}
                                title={`${seat.id} (₹${seat.price})`}
                              >
                                {seat.number}
                              </button>
                            </React.Fragment>
                          );
                        })}
                      </div>

                      <span className="pulse-row-label right">{rowObj.rowLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Bottom Action Bar */}
        <div className="pulse-seat-footer">
          <div>
            <div className="pulse-seat-count-summary">
              {selectedSeats.length > 0 ? (
                <>
                  <strong>{selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}</strong>
                  <span className="pulse-seat-ids-sub">
                    ({selectedSeats.map(s => s.id).join(', ')})
                  </span>
                </>
              ) : (
                <span style={{ color: 'var(--text-muted)' }}>Tap seats above to select</span>
              )}
            </div>
            <div className="pulse-seat-total-price">
              ₹{totalAmount.toLocaleString()}
            </div>
          </div>

          <button
            type="button"
            className="pulse-primary-cta-btn"
            disabled={selectedSeats.length === 0}
            onClick={confirmMovieSeatsBooking}
          >
            <span>Continue to Checkout</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

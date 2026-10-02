import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  X,
  Tag,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Wallet,
  Building
} from 'lucide-react';

export const CheckoutSheet: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutItem,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    processPayment,
    offers
  } = usePulse();

  const [inputCoupon, setInputCoupon] = useState<string>('');
  const [couponError, setCouponError] = useState<string>('');

  if (!isCheckoutOpen || !checkoutItem) return null;

  const discountAmount = appliedCoupon ? (appliedCoupon.maxDiscount || 150) : 0;
  const grandTotal = Math.max(0, checkoutItem.subtotal + checkoutItem.convenienceFee + checkoutItem.tax - discountAmount);

  const handleApplyCoupon = () => {
    if (!inputCoupon.trim()) return;
    const success = applyCoupon(inputCoupon);
    if (!success) {
      setCouponError('Invalid coupon code. Try PULSE150 or HDFCFEST.');
    } else {
      setCouponError('');
      setInputCoupon('');
    }
  };

  return (
    <div className="pulse-modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
      <div className="pulse-checkout-sheet" onClick={e => e.stopPropagation()}>
        {/* Handle */}
        <div className="pulse-sheet-handle" />

        {/* Header */}
        <div className="pulse-checkout-header">
          <div>
            <span className="pulse-booking-step-badge">SECURE CHECKOUT</span>
            <h3 className="pulse-checkout-title">Confirm & Pay</h3>
          </div>
          <button
            type="button"
            className="pulse-close-btn"
            onClick={() => setIsCheckoutOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <div className="pulse-checkout-scroll-body">
          {/* 1. Item Summary Card */}
          <div className="pulse-checkout-summary-card">
            <img src={checkoutItem.imageUrl} alt={checkoutItem.title} className="pulse-checkout-thumb" />
            <div className="pulse-checkout-meta">
              <h4 className="pulse-checkout-item-title">{checkoutItem.title}</h4>
              <div className="pulse-checkout-venue">{checkoutItem.venue}</div>
              <div className="pulse-checkout-schedule">
                {checkoutItem.date} • {checkoutItem.time}
              </div>
              <div className="pulse-checkout-seats">{checkoutItem.details}</div>
            </div>
          </div>

          {/* 2. Coupon / Promo Code Input */}
          <div className="pulse-checkout-coupon-box">
            <div className="pulse-coupon-input-row">
              <Tag size={16} className="pulse-tag-icon" />
              <input
                type="text"
                placeholder="Enter coupon code (e.g. PULSE150)"
                value={inputCoupon}
                onChange={e => setInputCoupon(e.target.value.toUpperCase())}
                className="pulse-coupon-native-input"
              />
              <button
                type="button"
                className="pulse-coupon-apply-btn"
                onClick={handleApplyCoupon}
              >
                Apply
              </button>
            </div>

            {couponError && <div className="pulse-coupon-error">{couponError}</div>}

            {/* Quick Available Coupon Chips */}
            {!appliedCoupon && (
              <div className="pulse-quick-coupons-row">
                {offers.slice(0, 2).map(off => (
                  <button
                    key={off.id}
                    type="button"
                    className="pulse-quick-coupon-tag"
                    onClick={() => applyCoupon(off.code)}
                  >
                    <span>{off.code}</span>
                    <span className="pulse-quick-off-desc">• {off.discountText}</span>
                  </button>
                ))}
              </div>
            )}

            {appliedCoupon && (
              <div className="pulse-applied-coupon-banner">
                <div className="pulse-applied-left">
                  <CheckCircle2 size={16} className="pulse-applied-check" />
                  <div>
                    <strong>'{appliedCoupon.code}' applied</strong>
                    <div className="pulse-applied-sub">You saved ₹{discountAmount} on this booking!</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="pulse-remove-coupon-btn"
                  onClick={removeCoupon}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* 3. Transparent Bill Breakdown */}
          <div className="pulse-checkout-bill-card">
            <h4 className="pulse-bill-title">Price Breakdown</h4>

            <div className="pulse-bill-row">
              <span>Subtotal ({checkoutItem.details.split('•')[0] || 'Items'})</span>
              <span className="mono">₹{checkoutItem.subtotal.toLocaleString()}</span>
            </div>

            <div className="pulse-bill-row">
              <span>Convenience Fee</span>
              <span className="mono">₹{checkoutItem.convenienceFee.toLocaleString()}</span>
            </div>

            <div className="pulse-bill-row">
              <span>Integrated Taxes (GST)</span>
              <span className="mono">₹{checkoutItem.tax.toLocaleString()}</span>
            </div>

            {appliedCoupon && (
              <div className="pulse-bill-row discount">
                <span>Coupon Discount ({appliedCoupon.code})</span>
                <span className="mono">-₹{discountAmount.toLocaleString()}</span>
              </div>
            )}

            <div className="pulse-bill-divider" />

            <div className="pulse-bill-row total">
              <span>Grand Total</span>
              <span className="mono highlight">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* 4. Payment Method Selector */}
          <div className="pulse-checkout-payment-section">
            <h4 className="pulse-payment-section-title">Select Payment Method</h4>

            <div className="pulse-payment-methods-grid">
              <div
                className={`pulse-payment-card ${selectedPaymentMethod === 'UPI' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('UPI')}
              >
                <div className="pulse-pm-radio">
                  <div className={`pulse-pm-dot ${selectedPaymentMethod === 'UPI' ? 'active' : ''}`} />
                </div>
                <Smartphone size={20} className="pulse-pm-icon" />
                <div className="pulse-pm-meta">
                  <div className="pulse-pm-title">UPI Instant (GPay / PhonePe / Paytm)</div>
                  <div className="pulse-pm-sub">Fast, zero extra processing surcharge</div>
                </div>
                <span className="pulse-pm-fast-tag">FASTEST</span>
              </div>

              <div
                className={`pulse-payment-card ${selectedPaymentMethod === 'CARD' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('CARD')}
              >
                <div className="pulse-pm-radio">
                  <div className={`pulse-pm-dot ${selectedPaymentMethod === 'CARD' ? 'active' : ''}`} />
                </div>
                <CreditCard size={20} className="pulse-pm-icon" />
                <div className="pulse-pm-meta">
                  <div className="pulse-pm-title">Credit / Debit Card</div>
                  <div className="pulse-pm-sub">Visa, Mastercard, RuPay & Amex</div>
                </div>
              </div>

              <div
                className={`pulse-payment-card ${selectedPaymentMethod === 'WALLET' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('WALLET')}
              >
                <div className="pulse-pm-radio">
                  <div className={`pulse-pm-dot ${selectedPaymentMethod === 'WALLET' ? 'active' : ''}`} />
                </div>
                <Wallet size={20} className="pulse-pm-icon" />
                <div className="pulse-pm-meta">
                  <div className="pulse-pm-title">Circuit 52 Vault & Table Pass</div>
                  <div className="pulse-pm-sub">Balance: ₹25,000 High-Roller Credit</div>
                </div>
              </div>

              <div
                className={`pulse-payment-card ${selectedPaymentMethod === 'NETBANKING' ? 'selected' : ''}`}
                onClick={() => setSelectedPaymentMethod('NETBANKING')}
              >
                <div className="pulse-pm-radio">
                  <div className={`pulse-pm-dot ${selectedPaymentMethod === 'NETBANKING' ? 'active' : ''}`} />
                </div>
                <Building size={20} className="pulse-pm-icon" />
                <div className="pulse-pm-meta">
                  <div className="pulse-pm-title">Net Banking</div>
                  <div className="pulse-pm-sub">All major national banks supported</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pulse-checkout-safe-badge">
            <ShieldCheck size={16} />
            <span>256-Bit SSL Encrypted • 100% Buyer Protection Guaranteed</span>
          </div>
        </div>

        {/* Sticky Pay CTA */}
        <div className="pulse-checkout-footer">
          <div>
            <div className="pulse-checkout-footer-amount">
              ₹{grandTotal.toLocaleString()}
            </div>
            <div className="pulse-checkout-footer-method">
              Via {selectedPaymentMethod}
            </div>
          </div>

          <button
            type="button"
            className="pulse-pay-btn"
            onClick={processPayment}
          >
            <span>Pay ₹{grandTotal.toLocaleString()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

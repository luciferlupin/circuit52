import React, { useState } from 'react';
import { usePulse } from '../../context/PulseContext';
import {
  X,
  Share2,
  MapPin,
  Download,
  RotateCw,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Wifi,
  Phone,
  Flame
} from 'lucide-react';

export const DigitalTicketModal: React.FC = () => {
  const { activeTicket, setActiveTicket } = usePulse();
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  if (!activeTicket) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText?.(activeTicket.bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pulse-modal-overlay" onClick={() => setActiveTicket(null)}>
      <div className="pulse-ticket-modal-card" onClick={e => e.stopPropagation()}>
        {/* Top Controls Bar */}
        <div className="pulse-ticket-top-bar">
          <div className="pulse-ticket-status-pill">
            <span className="pulse-dot-live" />
            <span>CIRCUIT 52 • VERIFIED ADMISSION</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              className="pulse-ticket-flip-btn"
              onClick={() => setIsFlipped(!isFlipped)}
              title="Flip pass (3D)"
            >
              <RotateCw size={14} />
              <span>{isFlipped ? 'Front' : 'Details'}</span>
            </button>
            <button
              type="button"
              className="pulse-close-btn"
              onClick={() => setActiveTicket(null)}
              aria-label="Close pass"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 3D Interactive Floating Perspective Stage */}
        <div
          className="pulse-3d-ticket-stage"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className={`pulse-3d-ticket-wrapper ${isFlipped ? 'flipped' : ''}`}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isFlipped ? 'rotateY(180deg)' : ''}`
            }}
          >
            {/* ================= FRONT SIDE ================= */}
            <div className="pulse-3d-glass-card front">
              {/* Animated Holographic Edge Glare */}
              <div className="pulse-ticket-glare-effect" />

              {/* 2D/3D Illustrated Circuit 52 Watermark & Suits */}
              <div className="pulse-card-suit-decorations">
                <span className="suit s-spade">♠</span>
                <span className="suit s-heart">♥</span>
                <span className="suit s-diamond">♦</span>
                <span className="suit s-club">♣</span>
              </div>

              {/* Security Shimmer Hologram Ribbon */}
              <div className="pulse-ticket-security-ribbon">
                <span className="pulse-shimmer-track" />
                <span className="pulse-security-text">
                  ● CIRCUIT 52 VIP PASS • OFFICIAL RFID SEAT ADMISSION • DO NOT DUPLICATE ●
                </span>
              </div>

              {/* Hero Row with Illustrated Poker Chip Medallion */}
              <div className="pulse-ticket-hero-row">
                <div className="pulse-ticket-art-wrap">
                  <img src={activeTicket.imageUrl} alt={activeTicket.title} className="pulse-ticket-thumb" />
                  <div className="pulse-ticket-chip-medallion">
                    <svg viewBox="0 0 40 40" width="36" height="36" className="pulse-chip-svg">
                      <circle cx="20" cy="20" r="18" fill="#0a173b" stroke="#60a5fa" strokeWidth="2.5" />
                      <circle cx="20" cy="20" r="14" fill="#030816" stroke="#2563eb" strokeDasharray="3 3" strokeWidth="2" />
                      <text x="20" y="24" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="bold">52</text>
                    </svg>
                  </div>
                </div>

                <div className="pulse-ticket-hero-meta">
                  <div className="pulse-ticket-type-pill">
                    <Sparkles size={11} />
                    <span>{activeTicket.type} PASS</span>
                  </div>
                  <h3 className="pulse-ticket-event-name">{activeTicket.title}</h3>
                  <div className="pulse-ticket-venue-text">
                    <MapPin size={12} />
                    <span>{activeTicket.venue}</span>
                  </div>
                </div>
              </div>

              {/* Holographic Notch Tear-Off Divider */}
              <div className="pulse-ticket-cutout-divider">
                <div className="pulse-cutout-notch left" />
                <div className="pulse-dashed-line" />
                <div className="pulse-cutout-notch right" />
              </div>

              {/* Meta Matrix */}
              <div className="pulse-ticket-meta-grid">
                <div className="pulse-ticket-meta-cell">
                  <span className="pulse-t-label">RESERVATION DATE</span>
                  <span className="pulse-t-val">{activeTicket.date}</span>
                </div>
                <div className="pulse-ticket-meta-cell">
                  <span className="pulse-t-label">SESSION TIME</span>
                  <span className="pulse-t-val highlight">{activeTicket.time}</span>
                </div>
                <div className="pulse-ticket-meta-cell full-width">
                  <span className="pulse-t-label">SEAT / TABLE ALLOCATION</span>
                  <div className="pulse-t-val-row">
                    <span className="pulse-t-val">{activeTicket.details}</span>
                    <span className="pulse-rfid-chip-indicator">
                      <Wifi size={12} /> RFID Felt Synced
                    </span>
                  </div>
                </div>
              </div>

              {/* Scanner QR Code with Animated Neon Laser Beam */}
              <div className="pulse-ticket-qr-section">
                <div className="pulse-qr-code-frame">
                  <img
                    src={activeTicket.qrCodeUrl}
                    alt="Admission QR"
                    className="pulse-qr-code-img"
                  />
                  {/* Glowing Laser Scan Bar */}
                  <div className="pulse-qr-scan-bar" />
                  <div className="pulse-qr-corner top-left" />
                  <div className="pulse-qr-corner top-right" />
                  <div className="pulse-qr-corner btm-left" />
                  <div className="pulse-qr-corner btm-right" />
                </div>

                <div className="pulse-ticket-booking-code" onClick={handleCopyCode}>
                  <span>BOOKING ID:</span>
                  <strong className="mono">{activeTicket.bookingCode}</strong>
                  <button type="button" className="pulse-copy-icon-btn" title="Copy code">
                    {copied ? <Check size={13} color="#60a5fa" /> : <Copy size={13} />}
                  </button>
                  {copied && <span className="pulse-copied-toast">Copied!</span>}
                </div>

                <div className="pulse-ticket-perks-row">
                  <span className="pulse-perk-item">⚡ RFID Priority Entry</span>
                  <span className="pulse-perk-item">🍸 Lounge Access</span>
                  <span className="pulse-perk-item">💎 High Roller Felt</span>
                </div>
              </div>
            </div>

            {/* ================= BACK SIDE (REVERSE) ================= */}
            <div className="pulse-3d-glass-card back">
              <div className="pulse-ticket-back-header">
                <div className="pulse-tb-logo">
                  <Flame size={16} color="#60a5fa" />
                  <strong>CIRCUIT 52 SMART FELT NETWORK</strong>
                </div>
                <span className="pulse-tb-badge">SECURITY VERIFIED</span>
              </div>

              <div className="pulse-tb-body">
                <div className="pulse-tb-section">
                  <span className="pulse-tb-label">TABLE FREQUENCY & HARDWARE</span>
                  <div className="pulse-tb-val mono">RFID 13.56 MHz • SMART SHUFFLER LINKED</div>
                </div>

                <div className="pulse-tb-section">
                  <span className="pulse-tb-label">VALET & ARRIVAL CONCIERGE</span>
                  <div className="pulse-tb-val">Complimentary VIP Valet • Level B1 East Podium</div>
                  <div className="pulse-tb-sub">Present this pass to the valet marshal upon entry</div>
                </div>

                <div className="pulse-tb-section">
                  <span className="pulse-tb-label">CLUB REGULATIONS & DRESS CODE</span>
                  <ul className="pulse-tb-rules-list">
                    <li>Smart Casual / Semi-Formal attire required on gaming floor</li>
                    <li>21+ Government ID required at physical reception</li>
                    <li>Strict zero-spectator rule inside High Roller Salon</li>
                    <li>Automatic seat reservation expires 15 minutes past start time</li>
                  </ul>
                </div>

                <div className="pulse-tb-security-stamp">
                  <ShieldCheck size={28} color="#60a5fa" />
                  <div>
                    <div className="pulse-tb-stamp-title">AUTHENTICATED SEAT PASS</div>
                    <div className="pulse-tb-stamp-sub mono">HASH: SHA256-C52-{activeTicket.bookingCode}</div>
                  </div>
                </div>

                <div className="pulse-tb-concierge-phone">
                  <Phone size={13} />
                  <span>24/7 Floor Manager Concierge: +91 80 4928 5200</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Ticket Footer Action Bar */}
        <div className="pulse-ticket-footer-actions">
          <button
            type="button"
            className="pulse-ticket-action-btn primary"
            onClick={() => alert('Pass saved to Apple Wallet / Google Wallet')}
          >
            <Download size={15} />
            <span>Add to Wallet</span>
          </button>

          <button
            type="button"
            className="pulse-ticket-action-btn"
            onClick={() => alert(`Directions opened for: ${activeTicket.venue}`)}
          >
            <MapPin size={15} />
            <span>Directions</span>
          </button>

          <button
            type="button"
            className="pulse-ticket-action-btn"
            onClick={() => alert(`Pass shared: ${activeTicket.title} (${activeTicket.bookingCode})`)}
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

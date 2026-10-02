import React from 'react';
import { usePulse } from '../../context/PulseContext';
import { Copy, CheckCircle2, ArrowRight } from 'lucide-react';

export const OffersView: React.FC = () => {
  const { offers, setActiveTab } = usePulse();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="pulse-offers-page">
      <div className="pulse-page-header">
        <h2 className="pulse-page-title">Curated Offers & Perks</h2>
        <p className="pulse-page-sub">High hand bonuses, reload credits & VIP privileges</p>
      </div>

      <div className="pulse-offers-list">
        {offers.map(offer => (
          <div key={offer.id} className="pulse-offer-card-item">
            <div className="pulse-oci-top">
              <div className="pulse-oci-tag-row">
                <span className="pulse-oci-cat">{offer.category.replace('_', ' ')}</span>
                {offer.bankOrProvider && (
                  <span className="pulse-oci-bank">{offer.bankOrProvider}</span>
                )}
              </div>
              <h3 className="pulse-oci-title">{offer.title}</h3>
              <p className="pulse-oci-desc">{offer.description}</p>
            </div>

            <div className="pulse-oci-divider" />

            <div className="pulse-oci-bottom-row">
              <div className="pulse-oci-code-box">
                <span className="pulse-oci-label">COUPON CODE</span>
                <span className="mono pulse-oci-code">{offer.code}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="pulse-oci-copy-btn"
                  onClick={() => handleCopy(offer.code)}
                >
                  {copiedCode === offer.code ? (
                    <>
                      <CheckCircle2 size={13} style={{ color: '#3b82f6' }} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="pulse-oci-use-btn"
                  onClick={() => setActiveTab('HOME')}
                >
                  <span>Explore</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

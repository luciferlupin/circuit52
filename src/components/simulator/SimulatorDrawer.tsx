import React, { useState } from 'react';
import { useCircuit } from '../../context/CircuitContext';
import { Sparkles, Zap, AlertTriangle, ShieldCheck, RotateCcw, ChevronUp, ChevronDown } from 'lucide-react';

export const SimulatorDrawer: React.FC = () => {
  const {
    simulateOfferSeatToUser,
    simulateDecayStaleClub,
    simulatePlayerReport,
    resetDemoData
  } = useCircuit();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <>
      {/* Floating Simulator Trigger Pill */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            zIndex: 95,
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#fbbf24',
            padding: '8px 14px',
            borderRadius: '999px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6), 0 0 12px rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Sparkles size={14} />
          <span>Simulate Events</span>
        </button>
      )}

      {/* Expanded Simulator Overlay Drawer */}
      {isExpanded && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(8, 12, 20, 0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid var(--border-active)',
          zIndex: 100,
          padding: '12px 20px',
          boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.85)',
          animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        {/* Title & Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setIsExpanded(!isExpanded)}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#080c14'
          }}>
            <Sparkles size={16} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#fbbf24' }}>
                LIVE EVENT SIMULATOR
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                (Demonstrate Zero-Latency Network Reactions)
              </span>
            </div>
          </div>

          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '6px' }}>
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>

        {/* Action Triggers */}
        {isExpanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                simulateOfferSeatToUser();
                alert('⚡ Seat offer triggered! Switch to Player App to view the 180s countdown banner.');
              }}
              className="btn btn-sm btn-outline"
              style={{ borderColor: 'var(--accent-recent)', color: '#fbbf24', fontSize: '0.78rem' }}
            >
              <Zap size={14} /> Trigger Seat Offer (180s Timer)
            </button>

            <button
              onClick={() => {
                simulateDecayStaleClub();
                alert('⌛ Wynn feed decayed to STALE (>15m). Switch to Admin HQ to view the auto-created P2 Exception.');
              }}
              className="btn btn-sm btn-outline"
              style={{ borderColor: 'var(--accent-stale)', color: '#fb923c', fontSize: '0.78rem' }}
            >
              <AlertTriangle size={14} /> Simulate Stale Decay (16m+)
            </button>

            <button
              onClick={() => {
                simulatePlayerReport();
                alert('⚠️ Discrepancy report filed on Bellagio. Confidence reduced and queued for Admin triage.');
              }}
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.78rem' }}
            >
              <ShieldCheck size={14} /> Player Inaccuracy Report
            </button>

            <button
              onClick={() => {
                resetDemoData();
                alert('Demo reset to initial benchmark state.');
              }}
              className="btn btn-sm btn-subtle"
              style={{ fontSize: '0.78rem' }}
              title="Reset data"
            >
              <RotateCcw size={14} /> Reset Demo
            </button>
          </div>
        )}
      </div>
    </div>
      )}
    </>
  );
};

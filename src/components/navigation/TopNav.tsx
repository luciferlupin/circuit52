import { useCircuit } from '../../context/CircuitContext';
import { Club as ClubIcon, Smartphone, Sliders } from 'lucide-react';

interface TopNavProps {
  activePortal: 'PLAYER' | 'CLUB' | 'ADMIN';
  setActivePortal: (portal: 'PLAYER' | 'CLUB' | 'ADMIN') => void;
}

export const TopNav: React.FC<TopNavProps> = ({ activePortal, setActivePortal }) => {
  const { clubs, tables, exceptions } = useCircuit();

  const activeTablesCount = tables.filter(t => t.status === 'ACTIVE' || t.status === 'FULL').length;
  const liveClubsCount = clubs.filter(c => c.freshnessLabel === 'LIVE').length;
  const openExceptionsCount = exceptions.filter(e => e.status === 'OPEN').length;

  return (
    <header style={{
      background: 'rgba(8, 12, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0 20px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Identity & Pulse */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => setActivePortal('PLAYER')}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            ♠
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', letterSpacing: '-0.03em' }}>CIRCUIT 52</span>
              <span className="badge badge-live" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                <span className="badge-pulse" /> NETWORK
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', letterSpacing: '0.02em' }}>
              LIVE TRUTH POKER OPERATING SYSTEM
            </div>
          </div>
        </div>

        {/* Global Network Health Bar */}
        <div style={{
          display: 'none',
          padding: '6px 14px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.76rem',
          color: 'var(--text-muted)'
        }} className="network-stats-pill">
          <span style={{ color: 'var(--accent-live)', fontWeight: 700 }}>● {activeTablesCount}</span> Live Tables &nbsp;•&nbsp; 
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{liveClubsCount}/{clubs.length}</span> Verified Clubs &nbsp;•&nbsp; 
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>98.4%</span> Freshness SLA
        </div>
      </div>

      {/* Main Portal Switcher */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '4px'
      }}>
        <button
          onClick={() => setActivePortal('PLAYER')}
          className={`btn btn-sm ${activePortal === 'PLAYER' ? 'btn-primary' : 'btn-subtle'}`}
          style={{ gap: '6px' }}
        >
          <Smartphone size={15} />
          <span>Player App</span>
        </button>

        <button
          onClick={() => setActivePortal('CLUB')}
          className={`btn btn-sm ${activePortal === 'CLUB' ? 'btn-primary' : 'btn-subtle'}`}
          style={{ gap: '6px' }}
        >
          <ClubIcon size={15} />
          <span>Club OS (Floor)</span>
        </button>

        <button
          onClick={() => setActivePortal('ADMIN')}
          className={`btn btn-sm ${activePortal === 'ADMIN' ? 'btn-primary' : 'btn-subtle'}`}
          style={{ gap: '6px', position: 'relative' }}
        >
          <Sliders size={15} />
          <span>Admin HQ</span>
          {openExceptionsCount > 0 && (
            <span style={{
              background: 'var(--accent-unavailable)',
              color: '#fff',
              fontSize: '0.65rem',
              borderRadius: '999px',
              padding: '1px 5px',
              fontWeight: 800,
              marginLeft: '2px'
            }}>
              {openExceptionsCount}
            </span>
          )}
        </button>
      </nav>

      {/* User Context & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {activePortal === 'PLAYER' ? 'Alex Morgan' : activePortal === 'CLUB' ? 'Floor Manager (David S.)' : 'Network Ops HQ'}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            {activePortal === 'PLAYER' ? 'Las Vegas Strip • Opted In' : activePortal === 'CLUB' ? 'Bellagio Poker Room' : 'Platform Super Admin'}
          </span>
        </div>

        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: activePortal === 'PLAYER' ? '#06b6d4' : activePortal === 'CLUB' ? '#10b981' : '#8b5cf6',
          color: '#080c14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: '0.85rem'
        }}>
          {activePortal === 'PLAYER' ? 'AM' : activePortal === 'CLUB' ? 'FM' : 'HQ'}
        </div>
      </div>

      <style>{`
        @media (min-width: 860px) {
          .network-stats-pill {
            display: flex !important;
          }
        }
      `}</style>
    </header>
  );
};

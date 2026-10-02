import { useState, type FC } from 'react';
import { useCircuit } from '../../context/CircuitContext';
import {
  MapPin,
  Flame,
  Search,
  Clock,
  Trophy,
  Bell,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Plus,
  Navigation,
  Compass
} from 'lucide-react';
import type { Club } from '../../types';

export const PlayerPortal: FC = () => {
  const {
    clubs,
    tables,
    waitlists,
    tournaments,
    sessions,
    journal,
    respondSeatOffer,
    joinWaitlist,
    leaveWaitlist,
    submitPlayerReport,
    recordSession
  } = useCircuit();

  const [activeTab, setActiveTab] = useState<'LIVE' | 'MAP' | 'TOURNAMENTS' | 'WAITLIST' | 'MY_POKER'>('LIVE');
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClubForModal, setSelectedClubForModal] = useState<Club | null>(null);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('TABLE_COUNT_INACCURATE');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [selectedPinClub, setSelectedPinClub] = useState<Club | null>(clubs[0]);

  // Session form state
  const [newSessionVenue, setNewSessionVenue] = useState<string>('Bellagio Poker Room');
  const [newSessionGame, setNewSessionGame] = useState<string>('NLH');
  const [newSessionStake, setNewSessionStake] = useState<string>('$2/$5');
  const [newSessionBuyIn, setNewSessionBuyIn] = useState<number>(500);
  const [newSessionCashOut, setNewSessionCashOut] = useState<number>(950);

  // Active seat offer to current user (Alex Morgan)
  const userOffer = waitlists.find(w => w.playerName.includes('Alex Morgan') && w.state === 'OFFERED');
  const userQueues = waitlists.filter(w => w.playerName.includes('Alex Morgan') && (w.state === 'QUEUED' || w.state === 'CONFIRMED'));

  // Calculate countdown time for offer
  const getOfferTimeLeft = (expiresAt?: string) => {
    if (!expiresAt) return '0:00';
    const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Filtered clubs
  const filteredClubs = clubs.filter(c => {
    const matchesSearch = c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || c.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGameFilter === 'ALL' || c.stakesSummary.some(s => s.includes(selectedGameFilter));
    return matchesSearch && matchesGame;
  }).sort((a, b) => b.discoveryScore - a.discoveryScore);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 16px' }} className="animate-fade-in">
      {/* Active Seat Offer Urgent Banner */}
      {userOffer && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.15) 100%)',
          border: '2px solid var(--accent-recent)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)',
          animation: 'pulse 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'var(--accent-recent)',
              color: '#080c14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              <Bell size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fbbf24' }}>SEAT OFFER READY!</span>
                <span className="badge badge-recent">HIGH PRIORITY</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginTop: '2px' }}>
                A seat is open at <strong>{userOffer.clubName}</strong> for <strong>{userOffer.stakeLabel} {userOffer.gameCode}</strong> (Table {userOffer.assignedTableCode || 'T-04'}).
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right', marginRight: '6px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Offer Expires In
              </div>
              <div className="mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f87171' }}>
                {getOfferTimeLeft(userOffer.offerExpiresAt)}
              </div>
            </div>

            <button
              onClick={() => respondSeatOffer(userOffer.id, 'CONFIRM')}
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '0.95rem' }}
            >
              <CheckCircle2 size={18} /> Confirm Seat
            </button>

            <button
              onClick={() => respondSeatOffer(userOffer.id, 'DECLINE')}
              className="btn btn-danger btn-sm"
              style={{ padding: '10px 14px' }}
            >
              <XCircle size={18} /> Decline
            </button>
          </div>
        </div>
      )}

      {/* Player App Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          <button
            onClick={() => setActiveTab('LIVE')}
            className={`btn btn-sm ${activeTab === 'LIVE' ? 'btn-primary' : 'btn-subtle'}`}
          >
            <Flame size={16} /> Live Now ({clubs.length})
          </button>

          <button
            onClick={() => setActiveTab('MAP')}
            className={`btn btn-sm ${activeTab === 'MAP' ? 'btn-primary' : 'btn-subtle'}`}
          >
            <Compass size={16} /> Live Map
          </button>

          <button
            onClick={() => setActiveTab('TOURNAMENTS')}
            className={`btn btn-sm ${activeTab === 'TOURNAMENTS' ? 'btn-primary' : 'btn-subtle'}`}
          >
            <Trophy size={16} /> Tournaments ({tournaments.length})
          </button>

          <button
            onClick={() => setActiveTab('WAITLIST')}
            className={`btn btn-sm ${activeTab === 'WAITLIST' ? 'btn-primary' : 'btn-subtle'}`}
            style={{ position: 'relative' }}
          >
            <Clock size={16} /> My Waitlists
            {userQueues.length > 0 && (
              <span style={{
                background: 'var(--accent-live)',
                color: '#080c14',
                padding: '1px 6px',
                borderRadius: '999px',
                fontSize: '0.68rem',
                fontWeight: 800
              }}>
                {userQueues.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('MY_POKER')}
            className={`btn btn-sm ${activeTab === 'MY_POKER' ? 'btn-primary' : 'btn-subtle'}`}
          >
            <Wallet size={16} /> My Poker OS
          </button>
        </div>

        {/* Location Scope Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <MapPin size={15} style={{ color: 'var(--accent-live)' }} />
          <span>Las Vegas Strip</span>
          <span style={{ color: 'var(--text-dim)' }}>•</span>
          <span className="mono" style={{ color: 'var(--text-main)' }}>25 km Radius</span>
        </div>
      </div>

      {/* TAB 1: LIVE NOW FEED */}
      {activeTab === 'LIVE' && (
        <div>
          {/* Search & Filter Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 14px',
              flex: '1',
              minWidth: '240px'
            }}>
              <Search size={16} style={{ color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search poker rooms, stakes, games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '0.88rem',
                  width: '100%'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto' }}>
              {['ALL', 'NLH', 'PLO', '1/3', '2/5', '5/10'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedGameFilter(filter)}
                  className={`chip ${selectedGameFilter === filter ? 'active' : ''}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Ranked Club Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {filteredClubs.map(club => {
              const clubTables = tables.filter(t => t.clubId === club.id && (t.status === 'ACTIVE' || t.status === 'FULL'));
              const activeCount = clubTables.length || (club.id === 'c2' ? 15 : club.id === 'c3' ? 19 : club.id === 'c4' ? 9 : 0);
              const waitCount = club.id === 'c1' ? 15 : club.id === 'c2' ? 11 : club.id === 'c3' ? 14 : 4;

              return (
                <div key={club.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.15rem' }}>{club.displayName}</h3>
                        {club.isVerified && (
                          <span title="Verified Room">
                            <ShieldCheck size={16} style={{ color: 'var(--accent-live)' }} />
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        <MapPin size={13} /> {club.distanceKm} km away &nbsp;•&nbsp; {club.city}
                      </div>
                    </div>

                    {/* Freshness Badge */}
                    <div>
                      {club.freshnessLabel === 'LIVE' && (
                        <span className="badge badge-live">
                          <span className="badge-pulse" /> LIVE ({club.lastUpdatedMinutesAgo}m)
                        </span>
                      )}
                      {club.freshnessLabel === 'RECENT' && (
                        <span className="badge badge-recent">
                          RECENT ({club.lastUpdatedMinutesAgo}m)
                        </span>
                      )}
                      {club.freshnessLabel === 'STALE' && (
                        <span className="badge badge-stale">
                          STALE ({club.lastUpdatedMinutesAgo}m)
                        </span>
                      )}
                      {club.freshnessLabel === 'UNAVAILABLE' && (
                        <span className="badge badge-unavailable">
                          UNAVAILABLE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Operational Telemetry Matrix */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Live Tables</div>
                      <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-live)' }}>
                        {activeCount}
                      </div>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Waiting</div>
                      <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-recent)' }}>
                        {waitCount}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Action Score</div>
                      <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                        {club.actionScore}
                      </div>
                    </div>
                  </div>

                  {/* Stakes Active Summary */}
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Running Stakes & Limits
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {club.stakesSummary.map((stake, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.75rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '3px 7px',
                          color: 'var(--text-main)'
                        }}>
                          {stake}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Discovery Ranking Transparency Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.74rem',
                    color: 'var(--text-dim)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '12px'
                  }}>
                    <span>Discovery Score: <strong style={{ color: 'var(--text-main)' }}>{club.discoveryScore}</strong></span>
                    <button
                      onClick={() => {
                        setSelectedClubForModal(club);
                        setShowReportModal(true);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-dim)',
                        fontSize: '0.72rem',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Report Inaccuracy
                    </button>
                  </div>

                  {/* Action CTAs */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                    <button
                      onClick={() => {
                        setSelectedClubForModal(club);
                        setShowJoinModal(true);
                      }}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                      disabled={club.freshnessLabel === 'UNAVAILABLE'}
                    >
                      Join Waitlist
                    </button>

                    <button
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(club.address)}`, '_blank')}
                      className="btn btn-outline"
                      title="Get Directions"
                    >
                      <Navigation size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE MAP VIEW */}
      {activeTab === 'MAP' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Geographic Discovery & Live Venues</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Real-time active table counts clustered by district. Select a venue pin for immediate live table telemetry.
              </p>
            </div>
            <div className="badge badge-live">
              <span className="badge-pulse" /> 6 Venues Geocoded
            </div>
          </div>

          {/* Simulated 2D Map Canvas */}
          <div style={{
            height: '420px',
            background: 'radial-gradient(ellipse at center, #111d33 0%, #090e18 100%)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Grid Lines Overlay */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

            {/* Strip Highway Representation */}
            <div style={{
              position: 'absolute',
              width: '8px',
              height: '100%',
              background: 'rgba(255, 255, 255, 0.08)',
              transform: 'rotate(-25deg)',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)'
            }}>
              <span style={{ position: 'absolute', top: '10%', left: '15px', fontSize: '0.65rem', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                LAS VEGAS BLVD (THE STRIP)
              </span>
            </div>

            {/* Venue Pins */}
            {clubs.map((c, index) => {
              const offsets = [
                { top: '48%', left: '42%' }, // Bellagio
                { top: '56%', left: '38%' }, // Aria
                { top: '35%', left: '50%' }, // Wynn
                { top: '24%', left: '56%' }, // Resorts World
                { top: '41%', left: '46%' }, // Venetian
                { top: '12%', left: '75%' }  // Golden Nugget (Downtown)
              ];
              const pos = offsets[index] || { top: '50%', left: '50%' };
              const isSelected = selectedPinClub?.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedPinClub(c)}
                  style={{
                    position: 'absolute',
                    top: pos.top,
                    left: pos.left,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    zIndex: isSelected ? 20 : 10,
                    textAlign: 'center'
                  }}
                >
                  <div style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: isSelected ? 'var(--accent-live)' : 'rgba(15, 23, 42, 0.9)',
                    color: isSelected ? '#022c22' : 'var(--text-main)',
                    border: `2px solid ${c.freshnessLabel === 'LIVE' ? 'var(--accent-live)' : c.freshnessLabel === 'STALE' ? 'var(--accent-stale)' : '#64748b'}`,
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    boxShadow: isSelected ? '0 0 20px rgba(16, 185, 129, 0.6)' : '0 4px 10px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <span>♠</span>
                    <span>{c.displayName.split(' ')[0]}</span>
                    <span style={{
                      background: isSelected ? '#047857' : 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      padding: '1px 5px',
                      borderRadius: '999px',
                      fontSize: '0.7rem'
                    }}>
                      {c.stakesSummary.length * 3 + 2}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Venue Drawer */}
          {selectedPinClub && (
            <div style={{
              marginTop: '20px',
              padding: '16px 20px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '1.1rem' }}>{selectedPinClub.displayName}</h4>
                  <span className={`badge badge-${selectedPinClub.freshnessLabel.toLowerCase()}`}>
                    {selectedPinClub.freshnessLabel}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {selectedPinClub.address} &nbsp;•&nbsp; {selectedPinClub.distanceKm} km from current location
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setSelectedClubForModal(selectedPinClub);
                    setShowJoinModal(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Join Remote Waitlist
                </button>
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedPinClub.address)}`, '_blank')}
                  className="btn btn-outline btn-sm"
                >
                  Get Directions
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TOURNAMENTS */}
      {activeTab === 'TOURNAMENTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Tournament Calendar & Live Clocks</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Real-time tournament levels, guarantees, buy-in structures, and entries across the network.
              </p>
            </div>
            <span className="badge badge-live">3 Active Events</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {tournaments.map(trn => {
              const mins = Math.floor(trn.levelSecondsRemaining / 60);
              const secs = trn.levelSecondsRemaining % 60;

              return (
                <div key={trn.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                        {trn.clubName}
                      </span>
                      <h4 style={{ fontSize: '1.1rem', marginTop: '2px' }}>{trn.title}</h4>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Start Time: {trn.startTime}
                      </div>
                    </div>
                    <span className="badge badge-live">{trn.state}</span>
                  </div>

                  {/* Financials & Stack Box */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    textAlign: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>BUY-IN</div>
                      <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        ${trn.buyInDollars}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>GUARANTEE</div>
                      <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                        ${(trn.guaranteeDollars / 1000).toFixed(0)}k GTD
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>START CHIPS</div>
                      <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                        {(trn.startingChips / 1000).toFixed(0)}k
                      </div>
                    </div>
                  </div>

                  {/* Live Clock Strip if Running */}
                  {trn.state === 'RUNNING' && (
                    <div style={{
                      padding: '12px',
                      background: 'rgba(6, 182, 212, 0.08)',
                      border: '1px solid rgba(6, 182, 212, 0.3)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                          LEVEL {trn.currentLevel} • BLINDS
                        </div>
                        <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                          {trn.smallBlind}/{trn.bigBlind} ({trn.ante})
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>LEVEL CLOCK</div>
                        <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                          {mins}:{secs < 10 ? '0' : ''}{secs}
                        </div>
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '12px'
                  }}>
                    <span>Entries: <strong>{trn.entriesCount}</strong> ({trn.remainingPlayersCount} remaining)</span>
                    <button className="btn btn-outline btn-sm">
                      Follow & Remind
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: MY WAITLISTS */}
      {activeTab === 'WAITLIST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Active Remote Waitlists</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Live position tracking in venue queues. You will receive a high-priority 180s push alert when a seat is ready.
            </p>
          </div>

          {userQueues.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
              <Clock size={40} style={{ color: 'var(--text-dim)', margin: '0 auto 12px' }} />
              <h4 style={{ fontSize: '1.1rem' }}>No Active Waitlists</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '420px', margin: '4px auto 16px' }}>
                Join a live queue from the Live Feed tab to secure your seat before traveling to the poker room.
              </p>
              <button onClick={() => setActiveTab('LIVE')} className="btn btn-primary btn-sm">
                Browse Live Games
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
              {userQueues.map(entry => (
                <div key={entry.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem' }}>{entry.clubName}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                        {entry.stakeLabel} {entry.gameCode}
                      </div>
                    </div>
                    <span className="badge badge-recent">QUEUED</span>
                  </div>

                  <div style={{
                    padding: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>YOUR POSITION</div>
                      <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-live)' }}>
                        #{entry.queuePosition}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>EST. WAIT</div>
                      <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                        ~15 mins
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => leaveWaitlist(entry.id)}
                      className="btn btn-danger btn-sm"
                      style={{ flex: 1 }}
                    >
                      Leave Queue
                    </button>
                    <button
                      onClick={() => alert('Geofence validated! Podiums notified of your arrival.')}
                      className="btn btn-outline btn-sm"
                    >
                      Podium Check-In
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: MY POKER OS (PRIVATE) */}
      {activeTab === 'MY_POKER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Privacy Seal Banner */}
          <div style={{
            padding: '14px 18px',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <ShieldCheck size={24} style={{ color: 'var(--accent-purple)' }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#c4b5fd' }}>
                Zero-Knowledge Privacy Firewall Active
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Your private bankroll, win/loss, and hand journals are strictly firewalled via PostgreSQL RLS. Clubs cannot view this data.
              </div>
            </div>
          </div>

          {/* Performance Summary Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Bankroll Balance</div>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-live)', marginTop: '4px' }}>
                $15,820.00
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-live)', marginTop: '2px' }}>
                +$3,370 lifetime profit
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Hourly Win Rate</div>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
                $44.20/hr
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Across 28 tracked hours
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tracked Sessions</div>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>
                {sessions.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                67% winning sessions
              </div>
            </div>
          </div>

          {/* Session Tracker & Journal */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            {/* Sessions Column */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '1.1rem' }}>Recent Poker Sessions</h4>
                <button
                  onClick={() => setShowSessionModal(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} /> Log Session
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {sessions.map(s => (
                  <div key={s.id} style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.venueName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {s.stake} {s.game} • {s.startedAt}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{
                        fontWeight: 800,
                        fontSize: '1rem',
                        color: s.profitLoss >= 0 ? 'var(--accent-live)' : 'var(--accent-unavailable)'
                      }}>
                        {s.profitLoss >= 0 ? `+$${s.profitLoss}` : `-$${Math.abs(s.profitLoss)}`}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        In: ${s.buyIn} / Out: ${s.cashOut}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hand Journal Column */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ fontSize: '1.1rem' }}>Strategy & Hand Journal</h4>
                <span className="badge badge-live">Private</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {journal.map(j => (
                  <div key={j.id} style={{
                    padding: '14px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h5 style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{j.title}</h5>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{j.date}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: 1.5 }}>
                      {j.content}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                      {j.tags.map((tag, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.7rem',
                          color: 'var(--accent-cyan)',
                          background: 'rgba(6, 182, 212, 0.1)',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Join Waitlist */}
      {showJoinModal && selectedClubForModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Join Remote Waitlist</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {selectedClubForModal.displayName} — Select your desired game and stake pool:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {[
                { game: 'NLH', stake: '$1/$3', wait: 3 },
                { game: 'NLH', stake: '$2/$5', wait: 5 },
                { game: 'NLH', stake: '$5/$10', wait: 1 },
                { game: 'PLO', stake: '$2/$5', wait: 4 }
              ].map((opt, i) => (
                <div
                  key={i}
                  onClick={() => {
                    joinWaitlist(selectedClubForModal.id, opt.game, opt.stake, true);
                    setShowJoinModal(false);
                    setActiveTab('WAITLIST');
                  }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-live)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{opt.stake} {opt.game}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Current queue: {opt.wait} players waiting
                    </div>
                  </div>
                  <button className="btn btn-primary btn-sm">Join Queue</button>
                </div>
              ))}
            </div>

            <button onClick={() => setShowJoinModal(false)} className="btn btn-outline" style={{ width: '100%' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Report Inaccurate Data */}
      {showReportModal && selectedClubForModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Report Inaccurate Live Data</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Submit verified feedback for <strong>{selectedClubForModal.displayName}</strong>. Circuit 52 Trust & Safety audits every report.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Reason</label>
                <select
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#1e293b',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    marginTop: '4px'
                  }}
                >
                  <option value="TABLE_COUNT_INACCURATE">Table count or occupancy is incorrect</option>
                  <option value="ROOM_CLOSED">Poker room is physically closed</option>
                  <option value="WRONG_STAKE">Listed stake/game is not running</option>
                  <option value="WAITLIST_BYPASS">Staff bypassed remote waitlist</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Details</label>
                <textarea
                  rows={3}
                  placeholder="Describe the discrepancy observed..."
                  value={reportDetails}
                  onChange={e => setReportDetails(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: '#1e293b',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-main)',
                    marginTop: '4px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  submitPlayerReport(selectedClubForModal.id, reportReason, reportDetails || 'Discrepancy reported by verified player.');
                  setShowReportModal(false);
                  alert('Thank you. Report filed with Circuit 52 Trust & Safety. Confidence score adjusted.');
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Submit Report
              </button>
              <button onClick={() => setShowReportModal(false)} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Log Session */}
      {showSessionModal && (
        <div className="modal-overlay" onClick={() => setShowSessionModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Log Poker Session</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Private by default. Saved to your encrypted bankroll journal.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>VENUE</label>
                <input
                  type="text"
                  value={newSessionVenue}
                  onChange={e => setNewSessionVenue(e.target.value)}
                  style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>GAME</label>
                  <input
                    type="text"
                    value={newSessionGame}
                    onChange={e => setNewSessionGame(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>STAKE</label>
                  <input
                    type="text"
                    value={newSessionStake}
                    onChange={e => setNewSessionStake(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>BUY-IN ($)</label>
                  <input
                    type="number"
                    value={newSessionBuyIn}
                    onChange={e => setNewSessionBuyIn(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>CASH-OUT ($)</label>
                  <input
                    type="number"
                    value={newSessionCashOut}
                    onChange={e => setNewSessionCashOut(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  recordSession({
                    venueName: newSessionVenue,
                    game: newSessionGame,
                    stake: newSessionStake,
                    buyIn: newSessionBuyIn,
                    cashOut: newSessionCashOut,
                    startedAt: 'Today',
                    endedAt: 'Today',
                    notes: 'Session recorded via Player App'
                  });
                  setShowSessionModal(false);
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Save Session
              </button>
              <button onClick={() => setShowSessionModal(false)} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

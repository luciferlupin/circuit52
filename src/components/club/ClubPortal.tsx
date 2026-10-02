import { useState, type FC } from 'react';
import { useCircuit } from '../../context/CircuitContext';
import {
  Plus,
  Minus,
  Radio,
  Clock,
  Trophy,
  Megaphone,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import type { TableStatus } from '../../types';

export const ClubPortal: FC = () => {
  const {
    clubs,
    tables,
    waitlists,
    tournaments,
    selectedClubId,
    setSelectedClubId,
    activeRole,
    setActiveRole,
    updateTableOccupancy,
    setTableStatus,
    openNewTable,
    sendHeartbeat,
    callWaitlistPlayer,
    createFillRequest
  } = useCircuit();

  const [activeSubTab, setActiveSubTab] = useState<'FLOOR' | 'WAITLIST' | 'TOURNAMENTS' | 'DEMAND' | 'ANALYTICS'>('FLOOR');
  const [showOpenTableModal, setShowOpenTableModal] = useState<boolean>(false);
  const [newTableCode, setNewTableCode] = useState<string>('T-09');
  const [newTableGame, setNewTableGame] = useState<string>('NLH');
  const [newTableStake, setNewTableStake] = useState<string>('$1/$3');

  // Fill My Table form
  const [fillGame, setFillGame] = useState<string>('NLH');
  const [fillStake, setFillStake] = useState<string>('$2/$5');
  const [fillSeatsNeeded, setFillSeatsNeeded] = useState<number>(3);
  const [fillSentSuccess, setFillSentSuccess] = useState<boolean>(false);

  const currentClub = clubs.find(c => c.id === selectedClubId) || clubs[0];
  const clubTables = tables.filter(t => t.clubId === currentClub.id);
  const clubWaitlists = waitlists.filter(w => w.clubId === currentClub.id);

  const totalOccupiedSeats = clubTables.reduce((acc, t) => acc + t.occupiedSeats, 0);
  const totalCapacity = clubTables.reduce((acc, t) => acc + t.seatCapacity, 0);
  const activeTablesCount = clubTables.filter(t => t.status === 'ACTIVE' || t.status === 'FULL').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 16px' }} className="animate-fade-in">
      {/* Top Club Header & 3-Click Philosophy Banner */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Left: Venue & Role Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={selectedClubId}
                onChange={e => setSelectedClubId(e.target.value)}
                style={{
                  background: '#1e293b',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  padding: '6px 12px',
                  cursor: 'pointer'
                }}
              >
                {clubs.map(c => (
                  <option key={c.id} value={c.id}>{c.displayName}</option>
                ))}
              </select>

              <span className={`badge badge-${currentClub.freshnessLabel.toLowerCase()}`}>
                <span className="badge-pulse" /> {currentClub.freshnessLabel}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>Operating Role:</span>
              <select
                value={activeRole}
                onChange={e => setActiveRole(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--accent-live)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  outline: 'none',
                  textDecoration: 'underline'
                }}
              >
                <option value="FLOOR_MANAGER">Floor/Pit Manager (3-Click Speed)</option>
                <option value="OPERATIONS_MANAGER">Operations Manager</option>
                <option value="OWNER_GM">Owner / General Manager</option>
                <option value="TOURNAMENT_MANAGER">Tournament Director</option>
                <option value="CRM_MARKETING">CRM / Growth Specialist</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: 1-Tap Heartbeat & Telemetry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Seated Capacity</div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {totalOccupiedSeats} / {totalCapacity} <span style={{ fontSize: '0.8rem', color: 'var(--accent-live)' }}>({Math.round((totalOccupiedSeats / (totalCapacity || 1)) * 100)}%)</span>
            </div>
          </div>

          <button
            onClick={() => {
              sendHeartbeat(currentClub.id);
              alert('Heartbeat ping dispatched! Data freshness refreshed to LIVE (0m).');
            }}
            className="btn btn-outline"
            style={{ borderColor: 'var(--accent-live)', color: 'var(--accent-live)' }}
            title="1-Tap Heartbeat to keep live feed status at 100% confidence"
          >
            <Radio size={16} /> 1-Tap Heartbeat
          </button>

          <button
            onClick={() => setShowOpenTableModal(true)}
            className="btn btn-primary"
          >
            <Plus size={16} /> Open Table
          </button>
        </div>
      </div>

      {/* Club OS Secondary Navigation Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '12px',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setActiveSubTab('FLOOR')}
          className={`btn btn-sm ${activeSubTab === 'FLOOR' ? 'btn-primary' : 'btn-subtle'}`}
        >
          ♠️ Live Floor ({activeTablesCount} Active)
        </button>

        <button
          onClick={() => setActiveSubTab('WAITLIST')}
          className={`btn btn-sm ${activeSubTab === 'WAITLIST' ? 'btn-primary' : 'btn-subtle'}`}
          style={{ position: 'relative' }}
        >
          <Clock size={15} /> Waitlist Queues ({clubWaitlists.length})
        </button>

        <button
          onClick={() => setActiveSubTab('TOURNAMENTS')}
          className={`btn btn-sm ${activeSubTab === 'TOURNAMENTS' ? 'btn-primary' : 'btn-subtle'}`}
        >
          <Trophy size={15} /> Tournament Ops
        </button>

        <button
          onClick={() => setActiveSubTab('DEMAND')}
          className={`btn btn-sm ${activeSubTab === 'DEMAND' ? 'btn-primary' : 'btn-subtle'}`}
        >
          <Megaphone size={15} /> Fill My Table
        </button>

        <button
          onClick={() => setActiveSubTab('ANALYTICS')}
          className={`btn btn-sm ${activeSubTab === 'ANALYTICS' ? 'btn-primary' : 'btn-subtle'}`}
        >
          <BarChart3 size={15} /> Room Telemetry
        </button>
      </div>

      {/* SUB-TAB 1: LIVE FLOOR DIGITAL TWIN */}
      {activeSubTab === 'FLOOR' && (
        <div>
          {/* Automation Rules Status Banner */}
          <div style={{
            padding: '10px 16px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} style={{ color: 'var(--accent-live)' }} />
              <span>
                <strong>3-Click Table Operations:</strong> Click `+`/`-` for 1-tap seat adjustments. Auto-sets <strong>FULL</strong> at {clubTables[0]?.seatCapacity || 9} seats.
              </span>
            </div>
            <span className="mono" style={{ color: 'var(--accent-live)', fontSize: '0.75rem' }}>
              Automation Rules Active
            </span>
          </div>

          {/* 2D Table Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {clubTables.map(t => {
              const fillPct = (t.occupiedSeats / t.seatCapacity) * 100;
              const isFull = t.status === 'FULL';
              const isPaused = t.status === 'PAUSED';

              return (
                <div
                  key={t.id}
                  className="glass-panel"
                  style={{
                    padding: '18px',
                    borderColor: isFull ? 'rgba(245, 158, 11, 0.35)' : isPaused ? 'rgba(239, 68, 68, 0.3)' : 'var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px'
                  }}
                >
                  {/* Table Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="mono" style={{ fontWeight: 800, fontSize: '1.25rem' }}>
                          {t.tableCode}
                        </span>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.08)',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}>
                          {t.stakeLabel} {t.gameCode}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                        Section: {t.roomSection} &nbsp;•&nbsp; v{t.version}
                      </div>
                    </div>

                    <select
                      value={t.status}
                      onChange={e => setTableStatus(t.id, e.target.value as TableStatus)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: '#1e293b',
                        border: '1px solid var(--border-subtle)',
                        color: isFull ? '#fbbf24' : isPaused ? '#f87171' : '#34d399',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="FULL">FULL</option>
                      <option value="FORMING">FORMING</option>
                      <option value="PAUSED">PAUSED</option>
                      <option value="CLOSING">CLOSING</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>

                  {/* Seat Occupancy Stepper (3-Click Heart of Floor Operations) */}
                  <div style={{
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>SEATED PLAYERS</div>
                      <div className="mono" style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                        {t.occupiedSeats} <span style={{ fontSize: '0.95rem', color: 'var(--text-dim)' }}>/ {t.seatCapacity}</span>
                      </div>
                    </div>

                    {/* Fast +/- Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => updateTableOccupancy(t.id, -1)}
                        className="btn btn-outline"
                        style={{ width: '40px', height: '40px', padding: 0, fontSize: '1.2rem', borderRadius: '50%' }}
                        disabled={t.occupiedSeats <= 0}
                        title="Seat vacating"
                      >
                        <Minus size={18} />
                      </button>

                      <button
                        onClick={() => updateTableOccupancy(t.id, 1)}
                        className="btn btn-primary"
                        style={{ width: '40px', height: '40px', padding: 0, fontSize: '1.2rem', borderRadius: '50%' }}
                        disabled={t.occupiedSeats >= t.seatCapacity}
                        title="Seat player"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div style={{
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${fillPct}%`,
                      height: '100%',
                      background: isFull ? 'var(--accent-recent)' : 'var(--accent-live)',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>

                  {/* Underutilization Consolidation Prompt */}
                  {t.occupiedSeats < 5 && t.status === 'ACTIVE' && (
                    <div style={{
                      padding: '8px 12px',
                      background: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.74rem',
                      color: '#fbbf24'
                    }}>
                      <AlertTriangle size={14} />
                      <span>Table under 5 players. Consider game consolidation.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: WAITLIST OPERATIONS */}
      {activeSubTab === 'WAITLIST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Podium & Remote Waitlist Queues</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                1-Click "Call Player" issues high-priority seat offer with 180s countdown timer.
              </p>
            </div>
            <span className="badge badge-recent">{clubWaitlists.length} Players Waiting</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
            {clubWaitlists.map(entry => (
              <div key={entry.id} className="glass-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono" style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-live)' }}>
                        #{entry.queuePosition}
                      </span>
                      <h4 style={{ fontSize: '1.05rem' }}>{entry.playerName}</h4>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {entry.stakeLabel} {entry.gameCode} &nbsp;•&nbsp; Requested: {entry.requestedAt}
                    </div>
                  </div>

                  <span className={`badge ${entry.state === 'OFFERED' ? 'badge-recent' : entry.state === 'CONFIRMED' ? 'badge-live' : 'badge-stale'}`}>
                    {entry.state}
                  </span>
                </div>

                {/* Offer countdown if state === OFFERED */}
                {entry.state === 'OFFERED' && (
                  <div style={{
                    padding: '10px 14px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>
                      Seat Offered (Table {entry.assignedTableCode || 'T-04'})
                    </span>
                    <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f87171' }}>
                      Awaiting Player...
                    </span>
                  </div>
                )}

                {/* Podium Operator Actions */}
                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                  {entry.state === 'QUEUED' && (
                    <button
                      onClick={() => callWaitlistPlayer(entry.id)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <PhoneCall size={14} /> Call / Offer Seat
                    </button>
                  )}

                  {entry.state === 'OFFERED' && (
                    <button
                      onClick={() => alert('Podium Walk-In Override: Offer revoked, walk-in player seated. Token issued to remote player.')}
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1 }}
                    >
                      Seat Walk-In (Override)
                    </button>
                  )}

                  {entry.state === 'CONFIRMED' && (
                    <button
                      onClick={() => alert(`Player seated! Table occupancy updated.`)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1 }}
                    >
                      <CheckCircle size={14} /> Check-In & Seat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: TOURNAMENT OPS */}
      {activeSubTab === 'TOURNAMENTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Tournament Director Console</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Live clock controls, structure levels, and attendance tracking.
              </p>
            </div>
            <button className="btn btn-primary btn-sm">
              <Plus size={14} /> Schedule Event
            </button>
          </div>

          {tournaments.filter(t => t.clubId === currentClub.id).map(trn => {
            const mins = Math.floor(trn.levelSecondsRemaining / 60);
            const secs = trn.levelSecondsRemaining % 60;

            return (
              <div key={trn.id} className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <span className="badge badge-live">{trn.state}</span>
                    <h3 style={{ fontSize: '1.35rem', marginTop: '6px' }}>{trn.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      ${trn.buyInDollars} Buy-In • ${(trn.guaranteeDollars / 1000).toFixed(0)}k GTD • Level {trn.currentLevel} ({trn.levelDurationMinutes} min blinds)
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>CLOCK</div>
                    <div className="mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                      {mins}:{secs < 10 ? '0' : ''}{secs}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>SMALL BLIND</div>
                    <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{trn.smallBlind}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>BIG BLIND</div>
                    <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{trn.bigBlind}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>BIG BLIND ANTE</div>
                    <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700 }}>{trn.ante}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>PLAYERS / ENTRIES</div>
                    <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                      {trn.remainingPlayersCount} / {trn.entriesCount}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-outline btn-sm">
                    <Pause size={14} /> Pause Clock
                  </button>
                  <button className="btn btn-primary btn-sm">
                    <Play size={14} /> Next Level
                  </button>
                  <button className="btn btn-outline btn-sm">
                    <Plus size={14} /> Add Late Entry
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 4: FILL MY TABLE */}
      {activeSubTab === 'DEMAND' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>"Fill My Table" Demand Broadcaster</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Broadcast targeted push notifications to opted-in poker players within 15 km who have played or followed this stake within 60 days.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>GAME</label>
              <select
                value={fillGame}
                onChange={e => setFillGame(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff', marginTop: '6px' }}
              >
                <option value="NLH">No-Limit Hold'em (NLH)</option>
                <option value="PLO">Pot-Limit Omaha (PLO)</option>
                <option value="ROE">Round-Of-Each (ROE)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>STAKE</label>
              <select
                value={fillStake}
                onChange={e => setFillStake(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff', marginTop: '6px' }}
              >
                <option value="$1/$3">$1/$3</option>
                <option value="$2/$5">$2/$5</option>
                <option value="$5/$10">$5/$10</option>
                <option value="$10/$25">$10/$25</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>PLAYERS NEEDED</label>
              <input
                type="number"
                min={1}
                max={6}
                value={fillSeatsNeeded}
                onChange={e => setFillSeatsNeeded(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', background: '#1e293b', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: '#fff', marginTop: '6px' }}
              />
            </div>
          </div>

          {/* Quota & Match Estimate Box */}
          <div style={{
            padding: '16px',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>Candidate Audience Match</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                18 active players meet geographic & anti-spam frequency criteria (capped at 2 blasts/48h).
              </div>
            </div>
            <div className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
              18 Players
            </div>
          </div>

          <button
            onClick={() => {
              createFillRequest(currentClub.id, fillGame, fillStake, fillSeatsNeeded);
              setFillSentSuccess(true);
              setTimeout(() => setFillSentSuccess(false), 4000);
            }}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px' }}
          >
            <Megaphone size={16} /> Broadcast Demand Request
          </button>

          {fillSentSuccess && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid var(--accent-live)',
              borderRadius: 'var(--radius-md)',
              color: '#34d399',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '0.88rem'
            }}>
              ✓ Demand request dispatched to 18 opted-in players. Real-time arrival conversion tracking enabled.
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: ROOM TELEMETRY */}
      {activeSubTab === 'ANALYTICS' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Table Seat Utilization</div>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-live)', marginTop: '4px' }}>
              84.6%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Occupied seat-hours vs available
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Median Wait Time</div>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
              14.2 min
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              P90 wait: 26.5 min
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Freshness SLA Compliance</div>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-live)', marginTop: '4px' }}>
              100.0%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Zero stale feed penalties today
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Operator Time Saved</div>
            <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '4px' }}>
              2.4 hrs
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Via 1-click seating & automated offers
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Open Table */}
      {showOpenTableModal && (
        <div className="modal-overlay" onClick={() => setShowOpenTableModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Open Live Table</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Instantly activates table and broadcasts `table.opened` event across the Circuit 52 network.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>PHYSICAL TABLE CODE</label>
                <input
                  type="text"
                  value={newTableCode}
                  onChange={e => setNewTableCode(e.target.value)}
                  style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>GAME</label>
                  <select
                    value={newTableGame}
                    onChange={e => setNewTableGame(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px' }}
                  >
                    <option value="NLH">NLH</option>
                    <option value="PLO">PLO</option>
                    <option value="ROE">ROE</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>STAKE</label>
                  <select
                    value={newTableStake}
                    onChange={e => setNewTableStake(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '4px' }}
                  >
                    <option value="$1/$3">$1/$3</option>
                    <option value="$2/$5">$2/$5</option>
                    <option value="$5/$10">$5/$10</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  openNewTable(currentClub.id, newTableCode, newTableGame, newTableStake);
                  setShowOpenTableModal(false);
                }}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Confirm Open Table
              </button>
              <button onClick={() => setShowOpenTableModal(false)} className="btn btn-outline">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

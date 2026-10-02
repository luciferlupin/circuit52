import { useState, type FC } from 'react';
import { useCircuit } from '../../context/CircuitContext';
import {
  ShieldAlert,
  Sliders,
  Activity,
  History,
  AlertOctagon,
  CheckCircle,
  Radio,
  Server
} from 'lucide-react';

export const AdminPortal: FC = () => {
  const {
    clubs,
    tables,
    exceptions,
    weights,
    auditLogs,
    resolveAdminException,
    updateWeights,
    sendHeartbeat
  } = useCircuit();

  const [activeAdminTab, setActiveAdminTab] = useState<'TELEMETRY' | 'EXCEPTIONS' | 'CONFIG' | 'AUDIT'>('TELEMETRY');

  const openExceptions = exceptions.filter(e => e.status === 'OPEN');
  const activeTablesCount = tables.filter(t => t.status === 'ACTIVE' || t.status === 'FULL').length;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px 16px' }} className="animate-fade-in">
      {/* Admin HQ Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #4c1d95 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800
          }}>
            <Server size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem' }}>Circuit 52 Control Centre</h2>
              <span className="badge badge-live">HQ NETWORK</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Operational Governance • Exception Queues • Remote Ranking Config
            </div>
          </div>
        </div>

        {/* Global SLA Pulse */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{
            padding: '8px 16px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Data Freshness SLA</div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-live)' }}>
              97.8% <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Target: &gt;95%)</span>
            </div>
          </div>

          <div style={{
            padding: '8px 16px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>System Health</div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
              99.98%
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sub Navigation */}
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
          onClick={() => setActiveAdminTab('TELEMETRY')}
          className={`btn btn-sm ${activeAdminTab === 'TELEMETRY' ? 'btn-primary' : 'btn-subtle'}`}
        >
          <Activity size={15} /> Network Telemetry
        </button>

        <button
          onClick={() => setActiveAdminTab('EXCEPTIONS')}
          className={`btn btn-sm ${activeAdminTab === 'EXCEPTIONS' ? 'btn-primary' : 'btn-subtle'}`}
          style={{ position: 'relative' }}
        >
          <ShieldAlert size={15} /> Exception Queues
          {openExceptions.length > 0 && (
            <span style={{
              background: 'var(--accent-unavailable)',
              color: '#fff',
              fontSize: '0.68rem',
              borderRadius: '999px',
              padding: '1px 6px',
              fontWeight: 800
            }}>
              {openExceptions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('CONFIG')}
          className={`btn btn-sm ${activeAdminTab === 'CONFIG' ? 'btn-primary' : 'btn-subtle'}`}
        >
          <Sliders size={15} /> Remote Config & Ranking Weights
        </button>

        <button
          onClick={() => setActiveAdminTab('AUDIT')}
          className={`btn btn-sm ${activeAdminTab === 'AUDIT' ? 'btn-primary' : 'btn-subtle'}`}
        >
          <History size={15} /> Audit Log ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: NETWORK TELEMETRY */}
      {activeAdminTab === 'TELEMETRY' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Key Metric Tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Live Tables</div>
              <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-live)', marginTop: '4px' }}>
                {activeTablesCount}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Across 6 onboarded clubs
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Verified Club Operators</div>
              <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginTop: '4px' }}>
                {clubs.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Las Vegas Strip & Downtown
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Open Exceptions</div>
              <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: openExceptions.length > 0 ? 'var(--accent-unavailable)' : 'var(--accent-live)', marginTop: '4px' }}>
                {openExceptions.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Requires operator intervention
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Total Players Seated</div>
              <div className="mono" style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '4px' }}>
                {tables.reduce((acc, t) => acc + t.occupiedSeats, 0)}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Real-time network occupancy
              </div>
            </div>
          </div>

          {/* Venues Overview Table */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '14px' }}>Network Venues Status & Freshness Matrix</h4>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-dim)' }}>
                    <th style={{ padding: '10px' }}>VENUE</th>
                    <th style={{ padding: '10px' }}>FRESHNESS</th>
                    <th style={{ padding: '10px' }}>CONFIDENCE</th>
                    <th style={{ padding: '10px' }}>ACTION SCORE</th>
                    <th style={{ padding: '10px' }}>DISCOVERY SCORE</th>
                    <th style={{ padding: '10px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {clubs.map(c => (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '12px 10px', fontWeight: 600 }}>
                        {c.displayName}
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>{c.address}</div>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span className={`badge badge-${c.freshnessLabel.toLowerCase()}`}>
                          {c.freshnessLabel} ({c.lastUpdatedMinutesAgo}m)
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span className="mono" style={{ fontWeight: 700, color: c.confidenceScore > 85 ? 'var(--accent-live)' : 'var(--accent-stale)' }}>
                          {c.confidenceScore}%
                        </span>
                      </td>
                      <td style={{ padding: '10px' }} className="mono">{c.actionScore}</td>
                      <td style={{ padding: '10px', fontWeight: 700 }} className="mono">{c.discoveryScore}</td>
                      <td style={{ padding: '10px' }}>
                        <button
                          onClick={() => {
                            sendHeartbeat(c.id);
                            alert(`Heartbeat ping requested for ${c.displayName}.`);
                          }}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem' }}
                        >
                          Ping Heartbeat
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXCEPTION QUEUES */}
      {activeAdminTab === 'EXCEPTIONS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Human-by-Exception Incident Queues</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Circuit 52 automates data quality and surfaces anomalies only when policy or low confidence requires human review.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {exceptions.map(ex => {
              const isResolved = ex.status === 'RESOLVED';

              return (
                <div
                  key={ex.id}
                  className="glass-panel"
                  style={{
                    padding: '20px',
                    borderColor: isResolved ? 'var(--border-subtle)' : ex.severity === 'P2_URGENT' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <AlertOctagon size={22} style={{ color: ex.severity === 'P2_URGENT' ? '#f87171' : '#fbbf24' }} />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.1rem' }}>{ex.title}</h4>
                          <span className={`badge ${ex.severity === 'P2_URGENT' ? 'badge-unavailable' : 'badge-recent'}`}>
                            {ex.severity}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                          Queue: <strong>{ex.queueType}</strong> • Club: <strong>{ex.clubName || 'Network-wide'}</strong> • Created: {ex.createdAt}
                        </div>
                      </div>
                    </div>

                    <span className={`badge ${isResolved ? 'badge-live' : 'badge-recent'}`}>
                      {ex.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                    {ex.summary}
                  </p>

                  {!isResolved && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      {ex.clubId && (
                        <button
                          onClick={() => {
                            sendHeartbeat(ex.clubId!);
                            resolveAdminException(ex.id, 'Pinged club operator; heartbeat validated & exception cleared.');
                          }}
                          className="btn btn-outline btn-sm"
                        >
                          <Radio size={14} /> Ping Operator Heartbeat
                        </button>
                      )}

                      <button
                        onClick={() => resolveAdminException(ex.id, 'Verified on CCTV & resolved with floor manager.')}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle size={14} /> Resolve & Dismiss
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: REMOTE CONFIG & RANKING WEIGHTS */}
      {activeAdminTab === 'CONFIG' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem' }}>Remote Configuration & DiscoveryScore Weights</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Organic ranking is deterministic and remote-configurable. Adjust weights below to test live feed ranking changes in real-time.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', maxWidth: '680px' }}>
            {[
              { key: 'relevance', label: 'Relevance (Player Preferences match)', val: weights.relevance },
              { key: 'actionScore', label: 'Action Score (Venue activity & table volume)', val: weights.actionScore },
              { key: 'freshness', label: 'Data Freshness (Heartbeat confidence)', val: weights.freshness },
              { key: 'proximity', label: 'Proximity (Distance to player)', val: weights.proximity },
              { key: 'followAffinity', label: 'Follow Affinity (Player favorited club)', val: weights.followAffinity },
              { key: 'tournamentRelevance', label: 'Tournament Relevance', val: weights.tournamentRelevance }
            ].map(w => (
              <div key={w.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span>{w.label}</span>
                  <span className="mono" style={{ fontWeight: 800, color: 'var(--accent-live)' }}>
                    {(w.val * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.05"
                  value={w.val}
                  onChange={e => updateWeights({ [w.key]: parseFloat(e.target.value) })}
                  style={{ accentColor: 'var(--accent-live)', cursor: 'pointer' }}
                />
              </div>
            ))}

            <div style={{
              marginTop: '16px',
              padding: '14px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.8rem',
              color: 'var(--text-muted)'
            }}>
              <strong>Formula:</strong> DiscoveryScore = 0.30×Relevance + 0.20×ActionScore + 0.20×Freshness + 0.15×Proximity + 0.10×FollowAffinity + 0.05×TournamentRelevance
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG */}
      {activeAdminTab === 'AUDIT' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Immutable Audit Log & Event Stream</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Every high-frequency mutation, seat offer, and administrative action is cryptographically tracked.
              </p>
            </div>
            <span className="badge badge-live">{auditLogs.length} Events Logged</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {auditLogs.map(log => (
              <div key={log.id} style={{
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'rgba(6,182,212,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                      {log.action}
                    </span>
                    <strong style={{ fontSize: '0.88rem' }}>{log.entityName}</strong>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {log.details}
                  </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  <div>By: <strong style={{ color: 'var(--text-main)' }}>{log.actor}</strong></div>
                  <div className="mono">{log.occurredAt}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

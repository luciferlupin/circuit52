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
  Compass,
  Star,
  Utensils,
  Sparkles,
  X,
  PhoneCall
} from 'lucide-react';
import type { Club } from '../../types';

interface StoryItem {
  id: string;
  title: string;
  subtitle: string;
  clubName: string;
  imageUrl: string;
  badge: string;
  description: string;
  ctaText: string;
  clubId: string;
}

const DISTRICT_STORIES: StoryItem[] = [
  {
    id: 'st-1',
    title: "Tonight's Action",
    subtitle: '$25k GTD Event',
    clubName: 'Bellagio Poker Room',
    imageUrl: '/images/bellagio.jpg',
    badge: 'LIVE TONIGHT',
    description: 'The Bellagio 2:00 PM Deepstack is down to the final 4 tables. High stakes cash games are overflowing with 18 live tables active right now.',
    ctaText: 'Join Waitlist',
    clubId: 'c1'
  },
  {
    id: 'st-2',
    title: 'Bobby\'s Room',
    subtitle: 'VIP High Roller',
    clubName: 'Bellagio VIP',
    imageUrl: '/images/bobbys_room.jpg',
    badge: 'EXCLUSIVE VIP',
    description: 'Bobby\'s Room has $10/$25 and $25/$50 NLH running with complimentary vintage bourbon and private tableside dining service.',
    ctaText: 'View VIP Stakes',
    clubId: 'c1'
  },
  {
    id: 'st-3',
    title: 'Tableside Wagyu',
    subtitle: 'Gourmet Perks',
    clubName: 'Wynn & Encore',
    imageUrl: '/images/dining.jpg',
    badge: 'DISTRICT DINING',
    description: 'Michelin-adjacent tableside dining served directly to poker players. Enjoy wagyu sliders, smoked rosemary cocktails, and artisan sushi rolls while you play.',
    ctaText: 'View Menu & Reserve',
    clubId: 'c3'
  },
  {
    id: 'st-4',
    title: 'Aria High Energy',
    subtitle: 'Deep PLO Action',
    clubName: 'Aria Poker Room',
    imageUrl: '/images/aria.jpg',
    badge: 'HIGH STAKES PLO',
    description: 'Aria is hosting 4 tables of deep $2/$5 and $5/$10 PLO with average stacks exceeding 500 big blinds.',
    ctaText: 'Join Omaha Queue',
    clubId: 'c2'
  },
  {
    id: 'st-5',
    title: 'Cyberpunk Poker',
    subtitle: 'RFID Smart Tables',
    clubName: 'Resorts World',
    imageUrl: '/images/resorts_world.jpg',
    badge: 'TECH FORWARD',
    description: 'Experience futuristic contactless poker gaming with 100% automated shufflers, instant RFID chip scanners, and cashless mobile payouts.',
    ctaText: 'Explore Tech Lounge',
    clubId: 'c4'
  },
  {
    id: 'st-6',
    title: 'Gold Chandeliers',
    subtitle: 'Signature Series',
    clubName: 'Wynn Poker Room',
    imageUrl: '/images/wynn.jpg',
    badge: '$250k GTD',
    description: 'The Wynn Signature Series kicks off tomorrow morning with a massive $250,000 guarantee. Register today via Circuit 52.',
    ctaText: 'Follow Tournament',
    clubId: 'c3'
  }
];

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
  const [selectedCuratedCategory, setSelectedCuratedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Drawers
  const [detailedClub, setDetailedClub] = useState<Club | null>(null);
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [selectedClubForModal, setSelectedClubForModal] = useState<Club | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('TABLE_COUNT_INACCURATE');
  const [reportDetails, setReportDetails] = useState<string>('');
  const [selectedPinClub, setSelectedPinClub] = useState<Club | null>(clubs[0]);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number>(0);

  // Session form state
  const [newSessionVenue, setNewSessionVenue] = useState<string>('Bellagio Poker Room');
  const [newSessionGame, setNewSessionGame] = useState<string>('NLH');
  const [newSessionStake, setNewSessionStake] = useState<string>('$2/$5');
  const [newSessionBuyIn, setNewSessionBuyIn] = useState<number>(500);
  const [newSessionCashOut, setNewSessionCashOut] = useState<number>(950);

  // Active seat offer to current user (Alex Morgan)
  const userOffer = waitlists.find(w => w.playerName.includes('Alex Morgan') && w.state === 'OFFERED');
  const userQueues = waitlists.filter(w => w.playerName.includes('Alex Morgan') && (w.state === 'QUEUED' || w.state === 'CONFIRMED'));

  const getOfferTimeLeft = (expiresAt?: string) => {
    if (!expiresAt) return '0:00';
    const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Filtered clubs
  const filteredClubs = clubs.filter(c => {
    const matchesSearch = c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.vibeTags.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesCategory = true;
    if (selectedCuratedCategory === 'HIGH_STAKES') {
      matchesCategory = c.vibeTags.includes('Bobby\'s Room VIP') || c.stakesSummary.some(s => s.includes('5/10') || s.includes('10/25'));
    } else if (selectedCuratedCategory === 'DINING') {
      matchesCategory = Boolean(c.menuHighlights && c.menuHighlights.length > 0);
    } else if (selectedCuratedCategory === 'FAST_SEATING') {
      matchesCategory = c.distanceKm < 3.0 && c.freshnessLabel === 'LIVE';
    } else if (selectedCuratedCategory === 'PLO') {
      matchesCategory = c.stakesSummary.some(s => s.includes('PLO'));
    }

    return matchesSearch && matchesCategory;
  }).sort((a, b) => b.discoveryScore - a.discoveryScore);

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '16px' }} className="animate-fade-in">
      {/* Active Seat Offer High Priority Banner */}
      {userOffer && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)',
          border: '2px solid var(--accent-recent)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          boxShadow: '0 0 25px rgba(245, 158, 11, 0.35)'
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
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Expires In
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

      {/* DISTRICT STORIES REEL STRIP (ZOMATO DISTRICT STYLE) */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
            DISTRICT SPOTLIGHTS & TONIGHT'S STORIES
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-live)', fontWeight: 600 }}>
            ● Live Updates
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: '14px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'none'
        }}>
          {DISTRICT_STORIES.map(story => (
            <div
              key={story.id}
              onClick={() => setActiveStory(story)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {/* Glowing Story Circle Ring */}
              <div style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                padding: '3px',
                background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #f59e0b 100%)',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <img
                  src={story.imageUrl}
                  alt={story.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #080c14'
                  }}
                />
              </div>

              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', textAlign: 'center', maxWidth: '80px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {story.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Player App Navigation Tabs */}
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
            <Flame size={16} /> District Clubs ({clubs.length})
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
          <span className="mono" style={{ color: 'var(--text-main)' }}>25 km Scope</span>
        </div>
      </div>

      {/* TAB 1: DISTRICT CLUBS FEED */}
      {activeTab === 'LIVE' && (
        <div>
          {/* Search & Curated Category Pills */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginBottom: '22px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '10px 16px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              <Search size={18} style={{ color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Search luxury rooms, high stakes, wagyu dining, PLO action..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: '0.92rem',
                  width: '100%'
                }}
              />
            </div>

            {/* Curated District Going-Out Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {[
                { id: 'ALL', label: '🔥 All Venues' },
                { id: 'HIGH_STAKES', label: '💎 High Stakes & VIP Lounges' },
                { id: 'DINING', label: '🍽 Tableside Wagyu & Drinks' },
                { id: 'PLO', label: '♠️ Deep PLO Action' },
                { id: 'FAST_SEATING', label: '⚡ Fast Seating (<10m)' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCuratedCategory(cat.id)}
                  className={`chip ${selectedCuratedCategory === cat.id ? 'active' : ''}`}
                  style={{ whiteSpace: 'nowrap' }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid: Zomato District Style with Hero Photos */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))', gap: '24px' }}>
            {filteredClubs.map(club => {
              const clubTables = tables.filter(t => t.clubId === club.id && (t.status === 'ACTIVE' || t.status === 'FULL'));
              const activeCount = clubTables.length || (club.id === 'c2' ? 15 : club.id === 'c3' ? 19 : club.id === 'c4' ? 9 : 0);
              const waitCount = club.id === 'c1' ? 14 : club.id === 'c2' ? 11 : club.id === 'c3' ? 14 : 4;

              return (
                <div
                  key={club.id}
                  className="glass-panel"
                  style={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.6)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-card)';
                  }}
                >
                  {/* HERO PHOTO WITH GRADIENT OVERLAY */}
                  <div
                    onClick={() => setDetailedClub(club)}
                    style={{
                      height: '210px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <img
                      src={club.imageUrl}
                      alt={club.displayName}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                    />

                    {/* Gradient Scrim */}
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(to top, rgba(8, 12, 20, 0.95) 0%, rgba(8, 12, 20, 0.2) 60%, transparent 100%)'
                    }} />

                    {/* Top Badges: Rating & Freshness */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      right: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      {/* Freshness Badge */}
                      {club.freshnessLabel === 'LIVE' && (
                        <span className="badge badge-live">
                          <span className="badge-pulse" /> LIVE TRUTH ({club.lastUpdatedMinutesAgo}m)
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

                      {/* Zomato District Gold Rating Badge */}
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.85)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(251, 191, 36, 0.4)',
                        borderRadius: 'var(--radius-full)',
                        padding: '4px 10px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#fbbf24',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)'
                      }}>
                        <Star size={13} fill="#fbbf24" />
                        <span>{club.rating}</span>
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', fontWeight: 500 }}>
                          ({club.reviewCount})
                        </span>
                      </div>
                    </div>

                    {/* Bottom Title on Image */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '16px',
                      right: '16px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <h3 style={{ fontSize: '1.25rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                            {club.displayName}
                          </h3>
                          {club.isVerified && (
                            <span title="Verified Room">
                              <ShieldCheck size={17} style={{ color: 'var(--accent-live)' }} />
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} /> {club.distanceKm} km away • {club.city}
                        </div>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>
                        {club.priceRange.split('•')[0]}
                      </div>
                    </div>
                  </div>

                  {/* CARD BODY CONTENT */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Live Room Telemetry Bar */}
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
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Live Tables</div>
                        <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-live)' }}>
                          {activeCount}
                        </div>
                      </div>
                      <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Waiting</div>
                        <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-recent)' }}>
                          {waitCount}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Action Score</div>
                        <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                          {club.actionScore}
                        </div>
                      </div>
                    </div>

                    {/* Vibe Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {club.vibeTags.map((tag, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.72rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-full)',
                          padding: '2px 8px',
                          color: 'var(--text-muted)'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Special District Perk / Offer Banner */}
                    {club.featuredOffer && (
                      <div style={{
                        padding: '8px 12px',
                        background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.1) 0%, rgba(16, 185, 129, 0.08) 100%)',
                        border: '1px solid rgba(251, 191, 36, 0.25)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.76rem',
                        color: '#fbbf24'
                      }}>
                        <Sparkles size={14} style={{ color: '#fbbf24', flexShrink: 0 }} />
                        <span>{club.featuredOffer}</span>
                      </div>
                    )}

                    {/* Tableside Food & Drinks Highlights */}
                    {club.menuHighlights && club.menuHighlights.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.74rem',
                        color: 'var(--text-dim)'
                      }}>
                        <Utensils size={13} style={{ color: 'var(--accent-cyan)' }} />
                        <span><strong>Tableside:</strong> {club.menuHighlights.join(' • ')}</span>
                      </div>
                    )}

                    {/* Action CTAs */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '6px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClubForModal(club);
                          setShowJoinModal(true);
                        }}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '10px 14px' }}
                        disabled={club.freshnessLabel === 'UNAVAILABLE'}
                      >
                        Join Waitlist
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailedClub(club);
                        }}
                        className="btn btn-outline"
                        style={{ padding: '10px 14px' }}
                      >
                        Explore Venue
                      </button>
                    </div>
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
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />

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

            {clubs.map((c, index) => {
              const offsets = [
                { top: '48%', left: '42%' },
                { top: '56%', left: '38%' },
                { top: '35%', left: '50%' },
                { top: '24%', left: '56%' },
                { top: '41%', left: '46%' },
                { top: '12%', left: '75%' }
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
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    background: isSelected ? 'var(--accent-live)' : 'rgba(15, 23, 42, 0.9)',
                    color: isSelected ? '#022c22' : 'var(--text-main)',
                    border: `2px solid ${c.freshnessLabel === 'LIVE' ? 'var(--accent-live)' : c.freshnessLabel === 'STALE' ? 'var(--accent-stale)' : '#64748b'}`,
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    boxShadow: isSelected ? '0 0 20px rgba(16, 185, 129, 0.6)' : '0 4px 10px rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>♠</span>
                    <span>{c.displayName.split(' ')[0]}</span>
                    <span style={{
                      background: isSelected ? '#047857' : 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      fontSize: '0.7rem'
                    }}>
                      ★ {c.rating}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={selectedPinClub.imageUrl}
                  alt={selectedPinClub.displayName}
                  style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: '1.1rem' }}>{selectedPinClub.displayName}</h4>
                    <span className={`badge badge-${selectedPinClub.freshnessLabel.toLowerCase()}`}>
                      {selectedPinClub.freshnessLabel}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {selectedPinClub.address} • {selectedPinClub.distanceKm} km from current location
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setDetailedClub(selectedPinClub)}
                  className="btn btn-outline btn-sm"
                >
                  View Club Profile
                </button>
                <button
                  onClick={() => {
                    setSelectedClubForModal(selectedPinClub);
                    setShowJoinModal(true);
                  }}
                  className="btn btn-primary btn-sm"
                >
                  Join Remote Waitlist
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

      {/* TAB 5: MY POKER OS */}
      {activeTab === 'MY_POKER' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
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

      {/* FULL DISTRICT VENUE PROFILE MODAL (ZOMATO DISTRICT DETAIL VIEW) */}
      {detailedClub && (
        <div className="modal-overlay" onClick={() => setDetailedClub(null)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '780px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 0,
              borderRadius: 'var(--radius-lg)'
            }}
          >
            {/* Gallery Carousel Header */}
            <div style={{ position: 'relative', height: '320px', background: '#000' }}>
              <img
                src={detailedClub.galleryUrls[activeGalleryIndex] || detailedClub.imageUrl}
                alt={detailedClub.displayName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Close Button */}
              <button
                onClick={() => setDetailedClub(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              {/* Gallery Thumbnails Strip */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '20px',
                display: 'flex',
                gap: '8px'
              }}>
                {detailedClub.galleryUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="gallery thumb"
                    onClick={() => setActiveGalleryIndex(idx)}
                    style={{
                      width: '50px',
                      height: '35px',
                      borderRadius: '6px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      border: activeGalleryIndex === idx ? '2px solid var(--accent-live)' : '1px solid rgba(255,255,255,0.4)',
                      opacity: activeGalleryIndex === idx ? 1 : 0.7
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Profile Content Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Title & Rating Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '1.6rem' }}>{detailedClub.displayName}</h2>
                    {detailedClub.isVerified && (
                      <ShieldCheck size={20} style={{ color: 'var(--accent-live)' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {detailedClub.address} • {detailedClub.distanceKm} km away
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    background: 'rgba(251, 191, 36, 0.15)',
                    border: '1px solid rgba(251, 191, 36, 0.4)',
                    borderRadius: 'var(--radius-md)',
                    padding: '6px 12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#fbbf24',
                    fontWeight: 800,
                    fontSize: '1.1rem'
                  }}>
                    <Star size={16} fill="#fbbf24" />
                    <span>{detailedClub.rating}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    {detailedClub.reviewCount} player reviews
                  </div>
                </div>
              </div>

              {/* Vibe & Atmosphere Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {detailedClub.vibeTags.map((v, i) => (
                  <span key={i} className="chip" style={{ fontSize: '0.78rem' }}>
                    {v}
                  </span>
                ))}
              </div>

              {/* District Perk / Offer Banner */}
              {detailedClub.featuredOffer && (
                <div style={{
                  padding: '14px 18px',
                  background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.35)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <Sparkles size={22} style={{ color: '#fbbf24' }} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fbbf24' }}>
                      DISTRICT EXCLUSIVE PERK
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginTop: '2px' }}>
                      {detailedClub.featuredOffer}
                    </div>
                  </div>
                </div>
              )}

              {/* Live Tables Running Now */}
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Live Games Running Now</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                  {detailedClub.stakesSummary.map((s, idx) => (
                    <div key={idx} style={{
                      padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)'
                    }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{s}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-live)', marginTop: '2px' }}>
                        ● Active Table
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tableside Dining Menu Preview */}
              {detailedClub.menuHighlights && (
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Tableside Gourmet Food & Cocktails</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                    {detailedClub.menuHighlights.map((dish, i) => (
                      <div key={i} style={{
                        padding: '12px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <Utensils size={16} style={{ color: 'var(--accent-cyan)' }} />
                        <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Venue Amenities */}
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Venue Amenities</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {detailedClub.amenities.map((a, i) => (
                    <span key={i} style={{
                      fontSize: '0.78rem',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--border-subtle)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-muted)'
                    }}>
                      ✓ {a}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div style={{
                display: 'flex',
                gap: '12px',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '20px',
                marginTop: '10px'
              }}>
                <button
                  onClick={() => {
                    setDetailedClub(null);
                    setSelectedClubForModal(detailedClub);
                    setShowJoinModal(true);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '12px' }}
                >
                  Join Remote Waitlist
                </button>

                <button
                  onClick={() => window.open(`tel:${detailedClub.phone}`)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  <PhoneCall size={16} /> Call Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STORY VIEWER MODAL */}
      {activeStory && (
        <div className="modal-overlay" onClick={() => setActiveStory(null)}>
          <div
            className="modal-content"
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: '460px',
              padding: 0,
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              background: '#080c14'
            }}
          >
            <div style={{ position: 'relative', height: '360px' }}>
              <img
                src={activeStory.imageUrl}
                alt={activeStory.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to top, #080c14 0%, transparent 60%)'
              }} />

              {/* Close Button */}
              <button
                onClick={() => setActiveStory(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                <span className="badge badge-live" style={{ marginBottom: '6px' }}>
                  {activeStory.badge}
                </span>
                <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>{activeStory.title}</h3>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)' }}>
                  {activeStory.clubName}
                </div>
              </div>
            </div>

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {activeStory.description}
              </p>

              <button
                onClick={() => {
                  const targetClub = clubs.find(c => c.id === activeStory.clubId);
                  setActiveStory(null);
                  if (targetClub) {
                    setSelectedClubForModal(targetClub);
                    setShowJoinModal(true);
                  }
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px' }}
              >
                {activeStory.ctaText}
              </button>
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

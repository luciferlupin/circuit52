import { useState, type FC } from 'react';
import { useCircuit } from '../../context/CircuitContext';
import {
  Search,
  Star,
  Clock,
  Trophy,
  Bell,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Compass,
  Utensils,
  Sparkles,
  X,
  PhoneCall,
  Heart,
  Mic,
  ChevronDown,
  Flame,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Camera
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
    title: 'Bellagio',
    subtitle: '18 Live Tables',
    clubName: 'Bellagio Poker Room',
    imageUrl: '/images/bellagio.jpg',
    badge: 'HOT ACTION',
    description: '18 live cash tables running tonight. High stakes $2/$5 and $5/$10 NLH with rapid seat turnaround.',
    ctaText: 'Join Waitlist',
    clubId: 'c1'
  },
  {
    id: 'st-2',
    title: "Bobby's",
    subtitle: 'High Roller VIP',
    clubName: "Bobby's Room VIP",
    imageUrl: '/images/bobbys_room.jpg',
    badge: 'HIGH STAKES',
    description: "Exclusive $10/$25 and $25/$50 deep-stack games with complimentary vintage bourbon and private service.",
    ctaText: 'View VIP Stakes',
    clubId: 'c1'
  },
  {
    id: 'st-3',
    title: 'Aria PLO',
    subtitle: 'Deep Omaha',
    clubName: 'Aria Poker Room',
    imageUrl: '/images/aria.jpg',
    badge: 'OMAHA ACTION',
    description: '4 tables of fast-paced $2/$5 and $5/$10 Pot Limit Omaha running with deep chip stacks.',
    ctaText: 'Join Omaha Queue',
    clubId: 'c2'
  },
  {
    id: 'st-4',
    title: 'Wynn VIP',
    subtitle: '$250k GTD',
    clubName: 'Wynn Poker Room',
    imageUrl: '/images/wynn.jpg',
    badge: 'TOURNAMENT',
    description: 'Wynn Signature Series qualifying flights start tomorrow at 11:00 AM with a massive guarantee.',
    ctaText: 'Follow Series',
    clubId: 'c3'
  },
  {
    id: 'st-5',
    title: 'Resorts W',
    subtitle: 'RFID Tech',
    clubName: 'Resorts World',
    imageUrl: '/images/resorts_world.jpg',
    badge: 'TECH LOUNGE',
    description: '100% automated RFID card scanners, contactless chip payouts, and zero waitlist delays.',
    ctaText: 'Explore Tech Lounge',
    clubId: 'c4'
  },
  {
    id: 'st-6',
    title: 'Dining',
    subtitle: 'Wagyu Perks',
    clubName: 'Wynn & Encore',
    imageUrl: '/images/dining.jpg',
    badge: 'TABLESIDE FOOD',
    description: 'Artisan sushi and wagyu sliders served directly to your poker table while you play.',
    ctaText: 'View Menu & Reserve',
    clubId: 'c3'
  }
];

const QUICK_CATEGORIES = [
  { id: 'ALL', label: 'All', icon: '🔥' },
  { id: 'NLH', label: "Hold'em", icon: '♠️' },
  { id: 'PLO', label: 'Omaha', icon: '🎲' },
  { id: 'HIGH_STAKES', label: 'VIP Stakes', icon: '💎' },
  { id: 'DINING', label: 'Dining', icon: '🥩' },
  { id: 'TOURNEY', label: 'Tourneys', icon: '🏆' }
];

export const PlayerPortal: FC = () => {
  const {
    clubs,
    tables,
    waitlists,
    tournaments,
    sessions,
    respondSeatOffer,
    joinWaitlist,
    leaveWaitlist,
    recordSession
  } = useCircuit();

  const [activeBottomNav, setActiveBottomNav] = useState<'DISTRICT' | 'RADAR' | 'EVENTS' | 'QUEUES' | 'PROFILE'>('DISTRICT');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedFavorites, setSavedFavorites] = useState<string[]>(['c1', 'c2']);
  
  // Modals & Drawers
  const [detailedClub, setDetailedClub] = useState<Club | null>(null);
  const [activeStory, setActiveStory] = useState<StoryItem | null>(null);
  const [showJoinModal, setShowJoinModal] = useState<boolean>(false);
  const [selectedClubForModal, setSelectedClubForModal] = useState<Club | null>(null);
  const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
  const [selectedPinClub, setSelectedPinClub] = useState<Club | null>(clubs[0] || null);
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

  const toggleFavorite = (clubId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedFavorites(prev => 
      prev.includes(clubId) ? prev.filter(id => id !== clubId) : [...prev, clubId]
    );
  };

  // Filtered clubs
  const filteredClubs = clubs.filter(c => {
    const matchesSearch = c.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.vibeTags.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchesCat = true;
    if (selectedCategory === 'NLH') {
      matchesCat = c.stakesSummary.some(s => s.includes('NLH'));
    } else if (selectedCategory === 'PLO') {
      matchesCat = c.stakesSummary.some(s => s.includes('PLO'));
    } else if (selectedCategory === 'HIGH_STAKES') {
      matchesCat = c.vibeTags.includes("Bobby's Room VIP") || c.stakesSummary.some(s => s.includes('5/10') || s.includes('10/25'));
    } else if (selectedCategory === 'DINING') {
      matchesCat = Boolean(c.menuHighlights && c.menuHighlights.length > 0);
    } else if (selectedCategory === 'TOURNEY') {
      matchesCat = c.amenities.some(a => a.toLowerCase().includes('tournament')) || c.id === 'c3' || c.id === 'c5';
    }

    return matchesSearch && matchesCat;
  }).sort((a, b) => b.discoveryScore - a.discoveryScore);

  return (
    <div className="mobile-shell-container">
      <div className="mobile-phone-frame">
        {/* TOP STATUS BAR (PHONE SHELL HEADER) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 18px 6px',
          background: 'rgba(8, 12, 20, 0.98)',
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          zIndex: 90
        }}>
          <span>9:41</span>
          {/* Dynamic Island Pill */}
          <div style={{
            padding: '3px 12px',
            background: '#000',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.1)'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 800 }}>LIVE 42 TABLES</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* SWIGGY / ZOMATO DISTRICT STICKY LOCATION HEADER */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 85,
          background: 'rgba(8, 12, 20, 0.98)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '8px 14px 10px'
        }}>
          {/* Location row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem'
              }}>
                ♠
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    Bellagio & The Strip
                  </span>
                  <ChevronDown size={13} style={{ color: 'var(--accent-live)' }} />
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                  Las Vegas NV
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setActiveBottomNav('QUEUES')}
                style={{
                  position: 'relative',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Bell size={15} />
                {userOffer && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    boxShadow: '0 0 6px #ef4444'
                  }} />
                )}
              </button>

              <div
                onClick={() => setActiveBottomNav('PROFILE')}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                  color: '#080c14',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                AM
              </div>
            </div>
          </div>

          {/* Search Input Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '7px 10px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            <Search size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search poker rooms, stakes, games..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.8rem',
                outline: 'none',
                width: '100%'
              }}
            />
            <Mic size={14} style={{ color: 'var(--accent-cyan)', cursor: 'pointer', flexShrink: 0 }} />
          </div>
        </div>

        {/* SCROLLABLE MAIN FEED CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px 84px' }}>
          {/* SEAT OFFER URGENT BANNER */}
          {userOffer && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.15) 100%)',
              border: '1.5px solid var(--accent-recent)',
              borderRadius: '14px',
              padding: '12px',
              marginBottom: '14px',
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge badge-recent" style={{ fontSize: '0.65rem' }}>SEAT READY</span>
                <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f87171' }}>
                  ⏱ {getOfferTimeLeft(userOffer.offerExpiresAt)}
                </span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-main)', marginBottom: '10px' }}>
                Seat open at <strong>{userOffer.clubName}</strong> ({userOffer.stakeLabel} {userOffer.gameCode}). Table {userOffer.assignedTableCode || 'T-04'}.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => respondSeatOffer(userOffer.id, 'CONFIRM')}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 2, padding: '7px' }}
                >
                  <CheckCircle2 size={14} /> Confirm Seat
                </button>
                <button
                  onClick={() => respondSeatOffer(userOffer.id, 'DECLINE')}
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1, padding: '7px' }}
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* VIEW: DISTRICT HOME FEED */}
          {activeBottomNav === 'DISTRICT' && (
            <div>
              {/* SWIGGY / INSTAGRAM STORIES STRIP */}
              <div style={{ marginBottom: '16px' }}>
                <div className="snap-carousel">
                  {DISTRICT_STORIES.map(story => (
                    <div
                      key={story.id}
                      onClick={() => setActiveStory(story)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px',
                        cursor: 'pointer',
                        width: '58px'
                      }}
                    >
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        padding: '2px',
                        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #f59e0b 100%)',
                        boxShadow: '0 0 8px rgba(16, 185, 129, 0.3)'
                      }}>
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
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        textAlign: 'center',
                        width: '58px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {story.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK GAME CATEGORIES (ROUNDELS) */}
              <div style={{ marginBottom: '16px' }}>
                <div className="snap-carousel">
                  {QUICK_CATEGORIES.map(cat => {
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '999px',
                          background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${isSelected ? 'var(--accent-live)' : 'var(--border-subtle)'}`,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ fontSize: '0.9rem' }}>{cat.icon}</span>
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: isSelected ? 800 : 500,
                          color: isSelected ? 'var(--accent-live)' : 'var(--text-main)',
                          whiteSpace: 'nowrap'
                        }}>
                          {cat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ZOMATO DISTRICT CURATED HIGHLIGHT BANNER */}
              <div
                style={{
                  position: 'relative',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  height: '105px',
                  marginBottom: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  const bellagio = clubs[0];
                  if (bellagio) setDetailedClub(bellagio);
                }}
              >
                <img
                  src="/images/dining.jpg"
                  alt="District Wagyu & Champagne"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(to right, rgba(8, 12, 20, 0.95) 0%, rgba(8, 12, 20, 0.45) 80%, transparent 100%)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <span className="badge badge-recent" style={{ width: 'fit-content', fontSize: '0.62rem', padding: '1px 6px', marginBottom: '4px' }}>
                    DISTRICT PERK
                  </span>
                  <h4 style={{ fontSize: '0.95rem', color: '#fff', fontWeight: 800, margin: 0 }}>
                    Tableside Wagyu & Cocktails
                  </h4>
                  <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                    Complimentary for $5/$10+ players tonight
                  </p>
                </div>
              </div>

              {/* VENUES LIST HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Poker Rooms Near You ({filteredClubs.length})
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--accent-live)', fontWeight: 600 }}>
                  ● Live Sync
                </span>
              </div>

              {/* CLUTTER-FREE SWIGGY / ZOMATO CLUB CARDS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredClubs.map(club => {
                  const clubTables = tables.filter(t => t.clubId === club.id && (t.status === 'ACTIVE' || t.status === 'FULL'));
                  const activeCount = clubTables.length || (club.id === 'c2' ? 15 : club.id === 'c3' ? 19 : club.id === 'c4' ? 9 : 0);
                  const waitCount = club.id === 'c1' ? 14 : club.id === 'c2' ? 11 : club.id === 'c3' ? 14 : 4;
                  const isFav = savedFavorites.includes(club.id);

                  return (
                    <div
                      key={club.id}
                      onClick={() => setDetailedClub(club)}
                      style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '16px',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.35)',
                        cursor: 'pointer'
                      }}
                    >
                      {/* HERO PHOTO CONTAINER */}
                      <div style={{ position: 'relative', height: '165px' }}>
                        <img
                          src={club.imageUrl}
                          alt={club.displayName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        {/* Top Overlay Badges */}
                        <div style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          right: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          {/* Live Status Pill */}
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(8, 12, 20, 0.85)',
                            backdropFilter: 'blur(4px)',
                            padding: '3px 8px',
                            borderRadius: '999px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#34d399'
                          }}>
                            <span className="badge-pulse" /> {activeCount} Tables Live
                          </span>

                          {/* Heart Bookmark Button */}
                          <button
                            onClick={(e) => toggleFavorite(club.id, e)}
                            style={{
                              width: '30px',
                              height: '30px',
                              borderRadius: '50%',
                              background: 'rgba(8, 12, 20, 0.75)',
                              backdropFilter: 'blur(4px)',
                              border: 'none',
                              color: isFav ? '#ef4444' : '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <Heart size={15} fill={isFav ? '#ef4444' : 'none'} />
                          </button>
                        </div>

                        {/* Bottom Overlay Badges */}
                        <div style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          right: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          {club.featuredOffer ? (
                            <span className="district-offer-tag">
                              <Sparkles size={10} /> Wagyu Perks
                            </span>
                          ) : <span />}

                          <span style={{
                            background: 'rgba(8, 12, 20, 0.85)',
                            backdropFilter: 'blur(4px)',
                            padding: '3px 7px',
                            borderRadius: '5px',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            color: '#fff'
                          }}>
                            ⏱ {Math.round(club.distanceKm * 4)}m • {club.distanceKm} km
                          </span>
                        </div>
                      </div>

                      {/* CARD DETAILS BODY */}
                      <div style={{ padding: '12px 14px' }}>
                        {/* Title & Green Rating */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {club.displayName}
                            </h3>
                            {club.isVerified && (
                              <ShieldCheck size={14} style={{ color: 'var(--accent-live)' }} />
                            )}
                          </div>

                          <div className="district-rating-badge">
                            <span>{club.rating}</span>
                            <Star size={10} fill="#86efac" />
                          </div>
                        </div>

                        {/* Location & Vibe */}
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          {club.vibeTags.slice(0, 2).join(' • ')} • {club.address.split(',')[0]}
                        </div>

                        {/* Stakes Chips */}
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          {club.stakesSummary.slice(0, 3).map((stk, idx) => (
                            <span key={idx} className="district-stake-pill">
                              {stk}
                            </span>
                          ))}
                          {club.stakesSummary.length > 3 && (
                            <span className="district-stake-pill" style={{ color: 'var(--text-dim)' }}>
                              +{club.stakesSummary.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Action Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                          <div style={{ fontSize: '0.74rem', color: 'var(--accent-recent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Users size={13} />
                            <span><strong>{waitCount}</strong> waiting</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedClubForModal(club);
                              setShowJoinModal(true);
                            }}
                            className="btn btn-primary btn-sm"
                            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                            disabled={club.freshnessLabel === 'UNAVAILABLE'}
                          >
                            Join Waitlist
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW: RADAR MAP */}
          {activeBottomNav === 'RADAR' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Radar Map</h3>
                <span className="badge badge-live">6 Rooms</span>
              </div>

              <div style={{
                height: '320px',
                background: 'radial-gradient(ellipse at center, #111d33 0%, #090e18 100%)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }} />

                {clubs.map((c, index) => {
                  const offsets = [
                    { top: '48%', left: '42%' },
                    { top: '58%', left: '38%' },
                    { top: '35%', left: '50%' },
                    { top: '24%', left: '56%' },
                    { top: '41%', left: '46%' },
                    { top: '15%', left: '75%' }
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
                        zIndex: isSelected ? 20 : 10
                      }}
                    >
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '999px',
                        background: isSelected ? 'var(--accent-live)' : 'rgba(15, 23, 42, 0.95)',
                        color: isSelected ? '#022c22' : '#fff',
                        fontWeight: 800,
                        fontSize: '0.68rem',
                        border: `1.5px solid ${c.freshnessLabel === 'LIVE' ? 'var(--accent-live)' : '#64748b'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                      }}>
                        <span>♠</span>
                        <span>{c.displayName.split(' ')[0]}</span>
                        <span style={{ fontSize: '0.62rem', opacity: 0.85 }}>★{c.rating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedPinClub && (
                <div style={{
                  padding: '12px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <img
                    src={selectedPinClub.imageUrl}
                    alt={selectedPinClub.displayName}
                    style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>{selectedPinClub.displayName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {selectedPinClub.distanceKm} km • {selectedPinClub.stakesSummary.length * 3} tables live
                    </div>
                  </div>
                  <button
                    onClick={() => setDetailedClub(selectedPinClub)}
                    className="btn btn-primary btn-sm"
                  >
                    View
                  </button>
                </div>
              )}
            </div>
          )}

          {/* VIEW: EVENTS & TOURNAMENTS */}
          {activeBottomNav === 'EVENTS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Tournaments</h3>
                <span className="badge badge-live">3 Today</span>
              </div>

              {tournaments.map(trn => {
                const mins = Math.floor(trn.levelSecondsRemaining / 60);
                const secs = trn.levelSecondsRemaining % 60;

                return (
                  <div key={trn.id} style={{
                    padding: '14px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          {trn.clubName}
                        </span>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '2px' }}>{trn.title}</h4>
                      </div>
                      <span className="badge badge-live" style={{ fontSize: '0.62rem' }}>{trn.state}</span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      padding: '8px',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>BUY-IN</div>
                        <div className="mono" style={{ fontSize: '0.88rem', fontWeight: 700 }}>${trn.buyInDollars}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>GUARANTEE</div>
                        <div className="mono" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                          ${(trn.guaranteeDollars / 1000).toFixed(0)}k
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>CLOCK</div>
                        <div className="mono" style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          {mins}:{secs < 10 ? '0' : ''}{secs}
                        </div>
                      </div>
                    </div>

                    <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                      Follow Alerts
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW: WAITLISTS */}
          {activeBottomNav === 'QUEUES' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>My Active Queues</h3>

              {userQueues.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '36px 16px', background: 'var(--bg-secondary)', borderRadius: '14px' }}>
                  <Clock size={32} style={{ color: 'var(--text-dim)', margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>No Active Queues</div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '12px' }}>
                    Join a remote poker queue to lock in your seat before arriving.
                  </p>
                  <button onClick={() => setActiveBottomNav('DISTRICT')} className="btn btn-primary btn-sm">
                    Browse Live Games
                  </button>
                </div>
              ) : (
                userQueues.map(q => (
                  <div key={q.id} style={{
                    padding: '14px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{q.clubName}</h4>
                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                          {q.stakeLabel} {q.gameCode}
                        </div>
                      </div>
                      <span className="badge badge-recent">QUEUED</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>POSITION</div>
                        <div className="mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-live)' }}>
                          #{q.queuePosition}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>EST. WAIT</div>
                        <div className="mono" style={{ fontSize: '1rem', fontWeight: 700 }}>
                          ~12 mins
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => leaveWaitlist(q.id)}
                      className="btn btn-danger btn-sm"
                      style={{ width: '100%' }}
                    >
                      Leave Queue
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* VIEW: MY POKER PROFILE */}
          {activeBottomNav === 'PROFILE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                padding: '14px',
                background: 'var(--bg-secondary)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                  color: '#080c14',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  AM
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Alex Morgan</h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    VIP District Member • Las Vegas Strip
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '3px' }}>
                    <span className="badge badge-live" style={{ fontSize: '0.62rem' }}>Verified Player</span>
                  </div>
                </div>
              </div>

              {/* Bankroll & Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div className="glass-panel" style={{ padding: '12px' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>BANKROLL</div>
                  <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-live)' }}>
                    $15,820
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--accent-live)' }}>+$3,370 profit</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>WIN RATE</div>
                  <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    $44.20/hr
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>28 hrs tracked</div>
                </div>
              </div>

              {/* Sessions List */}
              <div className="glass-panel" style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '0.88rem', fontWeight: 800 }}>Tracked Sessions</h4>
                  <button onClick={() => setShowSessionModal(true)} className="btn btn-primary btn-sm" style={{ padding: '4px 8px', fontSize: '0.72rem' }}>
                    <Plus size={12} /> Log
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {sessions.map(s => (
                    <div key={s.id} style={{
                      padding: '8px 10px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{s.venueName}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {s.stake} {s.game} • {s.startedAt}
                        </div>
                      </div>
                      <div className="mono" style={{
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        color: s.profitLoss >= 0 ? 'var(--accent-live)' : 'var(--accent-unavailable)'
                      }}>
                        {s.profitLoss >= 0 ? `+$${s.profitLoss}` : `-$${Math.abs(s.profitLoss)}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SWIGGY / ZOMATO FIXED BOTTOM TAB BAR */}
        <div className="mobile-tab-bar">
          <button
            onClick={() => setActiveBottomNav('DISTRICT')}
            className={`mobile-tab-btn ${activeBottomNav === 'DISTRICT' ? 'active' : ''}`}
          >
            <Flame size={18} />
            <span>District</span>
          </button>

          <button
            onClick={() => setActiveBottomNav('RADAR')}
            className={`mobile-tab-btn ${activeBottomNav === 'RADAR' ? 'active' : ''}`}
          >
            <Compass size={18} />
            <span>Radar</span>
          </button>

          <button
            onClick={() => setActiveBottomNav('EVENTS')}
            className={`mobile-tab-btn ${activeBottomNav === 'EVENTS' ? 'active' : ''}`}
          >
            <Trophy size={18} />
            <span>Events</span>
          </button>

          <button
            onClick={() => setActiveBottomNav('QUEUES')}
            className={`mobile-tab-btn ${activeBottomNav === 'QUEUES' ? 'active' : ''}`}
          >
            <Clock size={18} />
            <span>Waitlists</span>
          </button>

          <button
            onClick={() => setActiveBottomNav('PROFILE')}
            className={`mobile-tab-btn ${activeBottomNav === 'PROFILE' ? 'active' : ''}`}
          >
            <Wallet size={18} />
            <span>My Poker</span>
          </button>
        </div>

        {/* ZOMATO STYLE FULL PULL-UP BOTTOM SHEET FOR CLUB DETAILS */}
        {detailedClub && (
          <div className="bottom-sheet-overlay" onClick={() => setDetailedClub(null)}>
            <div className="bottom-sheet-content" onClick={e => e.stopPropagation()}>
              <div className="bottom-sheet-handle" />

              {/* Photo & Carousel Header */}
              <div style={{ position: 'relative', height: '220px', borderRadius: '14px', overflow: 'hidden', marginBottom: '14px', background: '#000' }}>
                <img
                  src={detailedClub.galleryUrls[activeGalleryIndex] || detailedClub.imageUrl}
                  alt={detailedClub.displayName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Vignette */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.85) 100%)',
                  pointerEvents: 'none'
                }} />

                {/* Close Button */}
                <button
                  onClick={() => setDetailedClub(null)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 5
                  }}
                >
                  <X size={16} />
                </button>

                {/* Prev & Next Arrows */}
                <button
                  type="button"
                  onClick={() => setActiveGalleryIndex(prev => (prev - 1 + detailedClub.galleryUrls.length) % detailedClub.galleryUrls.length)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.75)',
                    border: '1px solid rgba(59,130,246,0.4)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 5
                  }}
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveGalleryIndex(prev => (prev + 1) % detailedClub.galleryUrls.length)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '10px',
                    transform: 'translateY(-50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.75)',
                    border: '1px solid rgba(59,130,246,0.4)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 5
                  }}
                >
                  <ChevronRight size={18} />
                </button>

                {/* Counter Pill */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: 'rgba(4,10,28,0.85)',
                  border: '1px solid rgba(59,130,246,0.4)',
                  color: '#93c5fd',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  zIndex: 4
                }}>
                  <Camera size={12} />
                  <span>{activeGalleryIndex + 1} / {detailedClub.galleryUrls.length}</span>
                </div>

                {/* Thumbnails */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  zIndex: 4
                }}>
                  {detailedClub.galleryUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="thumb"
                      onClick={() => setActiveGalleryIndex(idx)}
                      style={{
                        width: '42px',
                        height: '28px',
                        borderRadius: '6px',
                        objectFit: 'cover',
                        border: activeGalleryIndex === idx ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.3)',
                        boxShadow: activeGalleryIndex === idx ? '0 0 10px rgba(59,130,246,0.8)' : 'none',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Ratings */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{detailedClub.displayName}</h3>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} />
                    <span>{detailedClub.address} • {detailedClub.distanceKm} km</span>
                  </div>
                </div>

                <div className="district-rating-badge" style={{ fontSize: '0.82rem', padding: '3px 8px' }}>
                  <span>{detailedClub.rating}</span>
                  <Star size={11} fill="#86efac" />
                </div>
              </div>

              {/* Perk Banner */}
              {detailedClub.featuredOffer && (
                <div style={{
                  padding: '8px 12px',
                  background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.74rem',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '12px'
                }}>
                  <Sparkles size={14} style={{ flexShrink: 0 }} />
                  <span>{detailedClub.featuredOffer}</span>
                </div>
              )}

              {/* Live Tables Breakdown */}
              <div style={{ marginBottom: '14px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Live Games Running Now
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {detailedClub.stakesSummary.map((s, idx) => (
                    <div key={idx} style={{
                      padding: '7px 9px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.74rem',
                      fontWeight: 700
                    }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tableside Food Menu */}
              {detailedClub.menuHighlights && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Tableside Dining & Cocktails
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {detailedClub.menuHighlights.map((dish, i) => (
                      <div key={i} style={{
                        padding: '6px 10px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.74rem'
                      }}>
                        <Utensils size={12} style={{ color: 'var(--accent-cyan)' }} />
                        <span>{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sticky Action Footer */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => {
                    setDetailedClub(null);
                    setSelectedClubForModal(detailedClub);
                    setShowJoinModal(true);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 2, padding: '10px' }}
                >
                  Join Remote Waitlist
                </button>
                <button
                  onClick={() => window.open(`tel:${detailedClub.phone}`)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '10px' }}
                >
                  <PhoneCall size={14} /> Call
                </button>
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
                maxWidth: '380px',
                padding: 0,
                overflow: 'hidden',
                borderRadius: '20px',
                background: '#080c14'
              }}
            >
              <div style={{ position: 'relative', height: '280px' }}>
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

                <button
                  onClick={() => setActiveStory(null)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    width: '28px',
                    height: '28px',
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
                  <X size={15} />
                </button>

                <div style={{ position: 'absolute', bottom: '12px', left: '14px', right: '14px' }}>
                  <span className="badge badge-live" style={{ marginBottom: '4px', fontSize: '0.62rem' }}>
                    {activeStory.badge}
                  </span>
                  <h3 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 800 }}>{activeStory.title}</h3>
                  <div style={{ fontSize: '0.74rem', color: 'rgba(255,255,255,0.8)' }}>
                    {activeStory.clubName}
                  </div>
                </div>
              </div>

              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
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
                  style={{ width: '100%', padding: '9px' }}
                >
                  {activeStory.ctaText}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: JOIN WAITLIST */}
        {showJoinModal && selectedClubForModal && (
          <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '360px', padding: '18px' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Join Remote Waitlist</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {selectedClubForModal.displayName} — Select stake:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
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
                      setActiveBottomNav('QUEUES');
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{opt.stake} {opt.game}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        Queue: {opt.wait} players
                      </div>
                    </div>
                    <button className="btn btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                      Join Queue
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={() => setShowJoinModal(false)} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* MODAL: LOG SESSION */}
        {showSessionModal && (
          <div className="modal-overlay" onClick={() => setShowSessionModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '360px', padding: '18px' }}>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Log Poker Session</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                Private bankroll ledger. Encrypted.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>VENUE</label>
                  <input
                    type="text"
                    value={newSessionVenue}
                    onChange={e => setNewSessionVenue(e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>GAME</label>
                    <input
                      type="text"
                      value={newSessionGame}
                      onChange={e => setNewSessionGame(e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>STAKE</label>
                    <input
                      type="text"
                      value={newSessionStake}
                      onChange={e => setNewSessionStake(e.target.value)}
                      style={{ width: '100%', padding: '6px 8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>BUY-IN ($)</label>
                    <input
                      type="number"
                      value={newSessionBuyIn}
                      onChange={e => setNewSessionBuyIn(Number(e.target.value))}
                      style={{ width: '100%', padding: '6px 8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>CASH-OUT ($)</label>
                    <input
                      type="number"
                      value={newSessionCashOut}
                      onChange={e => setNewSessionCashOut(Number(e.target.value))}
                      style={{ width: '100%', padding: '6px 8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
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
                  style={{ flex: 1, padding: '8px' }}
                >
                  Save
                </button>
                <button onClick={() => setShowSessionModal(false)} className="btn btn-outline" style={{ padding: '8px' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

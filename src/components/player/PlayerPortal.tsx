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
  Flame
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
    title: "Bobby's Room",
    subtitle: 'VIP High Roller',
    clubName: 'Bellagio VIP',
    imageUrl: '/images/bobbys_room.jpg',
    badge: 'EXCLUSIVE VIP',
    description: "Bobby's Room has $10/$25 and $25/$50 NLH running with complimentary vintage bourbon and private tableside dining service.",
    ctaText: 'View VIP Stakes',
    clubId: 'c1'
  },
  {
    id: 'st-3',
    title: 'Wagyu & Drinks',
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
    title: 'Aria Deep PLO',
    subtitle: 'High Energy',
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
    subtitle: 'RFID Tables',
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
    subtitle: '$250k GTD',
    clubName: 'Wynn Poker Room',
    imageUrl: '/images/wynn.jpg',
    badge: '$250k GTD',
    description: 'The Wynn Signature Series kicks off tomorrow morning with a massive $250,000 guarantee. Register today via Circuit 52.',
    ctaText: 'Follow Tournament',
    clubId: 'c3'
  }
];

const QUICK_CATEGORIES = [
  { id: 'ALL', label: 'All', icon: '🔥', color: '#f59e0b' },
  { id: 'NLH', label: "Hold'em", icon: '♠️', color: '#10b981' },
  { id: 'PLO', label: 'Omaha', icon: '🎲', color: '#06b6d4' },
  { id: 'HIGH_STAKES', label: 'VIP High Roller', icon: '💎', color: '#8b5cf6' },
  { id: 'DINING', label: 'Wagyu & Drinks', icon: '🥩', color: '#ec4899' },
  { id: 'TOURNEY', label: 'Tourneys', icon: '🏆', color: '#fbbf24' }
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
          padding: '12px 20px 6px',
          background: 'rgba(8, 12, 20, 0.95)',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          zIndex: 90
        }}>
          <span>9:41</span>
          {/* Dynamic Island Pill */}
          <div style={{
            width: '110px',
            height: '24px',
            background: '#000',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.1)'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700 }}>LIVE 42 TABLES</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* SWIGGY / ZOMATO DISTRICT STICKY LOCATION HEADER */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 85,
          background: 'rgba(8, 12, 20, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '8px 16px 12px'
        }}>
          {/* Location row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #10b981 0%, #064e3b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.95rem'
              }}>
                ♠
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    Bellagio & The Strip
                  </span>
                  <ChevronDown size={14} style={{ color: 'var(--accent-live)' }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  Las Vegas NV • 15 km Radius
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setActiveBottomNav('QUEUES')}
                style={{
                  position: 'relative',
                  width: '34px',
                  height: '34px',
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
                <Bell size={16} />
                {userOffer && (
                  <span style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#ef4444',
                    boxShadow: '0 0 6px #ef4444'
                  }} />
                )}
              </button>

              <div
                onClick={() => setActiveBottomNav('PROFILE')}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                  color: '#080c14',
                  fontWeight: 800,
                  fontSize: '0.8rem',
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

          {/* Swiggy/Zomato Search Bar with Mic & Filter */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '8px 12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <Search size={16} style={{ color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search 'Wagyu sliders', 'High Stakes 5/10', 'Aria'..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '0.84rem',
                outline: 'none',
                width: '100%'
              }}
            />
            <Mic size={15} style={{ color: 'var(--accent-cyan)', cursor: 'pointer' }} />
          </div>
        </div>

        {/* SCROLLABLE MAIN FEED CONTENT */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px 80px' }}>
          {/* SEAT OFFER URGENT POPUP BANNER (IF ACTIVE) */}
          {userOffer && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(239, 68, 68, 0.2) 100%)',
              border: '2px solid var(--accent-recent)',
              borderRadius: '16px',
              padding: '14px',
              marginBottom: '16px',
              boxShadow: '0 4px 20px rgba(245, 158, 11, 0.35)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-recent">SEAT OFFER READY</span>
                <span className="mono" style={{ fontSize: '1rem', fontWeight: 800, color: '#f87171' }}>
                  ⏱ {getOfferTimeLeft(userOffer.offerExpiresAt)}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-main)', marginBottom: '12px' }}>
                Seat open at <strong>{userOffer.clubName}</strong> ({userOffer.stakeLabel} {userOffer.gameCode}). Table {userOffer.assignedTableCode || 'T-04'}.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => respondSeatOffer(userOffer.id, 'CONFIRM')}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 2 }}
                >
                  <CheckCircle2 size={15} /> Confirm Seat
                </button>
                <button
                  onClick={() => respondSeatOffer(userOffer.id, 'DECLINE')}
                  className="btn btn-danger btn-sm"
                  style={{ flex: 1 }}
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* VIEW: DISTRICT HOME FEED */}
          {activeBottomNav === 'DISTRICT' && (
            <div>
              {/* SWIGGY STORIES STRIP (ROUND REELS) */}
              <div style={{ marginBottom: '18px' }}>
                <div className="snap-carousel">
                  {DISTRICT_STORIES.map(story => (
                    <div
                      key={story.id}
                      onClick={() => setActiveStory(story)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        padding: '2.5px',
                        background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #f59e0b 100%)',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.35)'
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
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-main)', textAlign: 'center', width: '70px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {story.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SWIGGY "WHAT'S ON YOUR MIND?" CATEGORY ROUNDELS */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  EXPLORE BY VIBE & GAME
                </div>

                <div className="snap-carousel">
                  {QUICK_CATEGORIES.map(cat => {
                    const isSelected = selectedCategory === cat.id;

                    return (
                      <div
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          width: '68px'
                        }}
                      >
                        <div style={{
                          width: '54px',
                          height: '54px',
                          borderRadius: '50%',
                          background: isSelected ? 'var(--accent-live)' : 'rgba(255, 255, 255, 0.05)',
                          border: `1.5px solid ${isSelected ? 'var(--accent-live)' : 'var(--border-subtle)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.4rem',
                          boxShadow: isSelected ? '0 0 12px rgba(16, 185, 129, 0.5)' : 'none'
                        }}>
                          {cat.icon}
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: isSelected ? 800 : 500,
                          color: isSelected ? 'var(--accent-live)' : 'var(--text-muted)',
                          textAlign: 'center',
                          lineHeight: 1.2
                        }}>
                          {cat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ZOMATO DISTRICT HERO PROMO CARD */}
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '140px',
                marginBottom: '20px',
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
                  background: 'linear-gradient(to right, rgba(8, 12, 20, 0.95) 0%, rgba(8, 12, 20, 0.4) 70%, transparent 100%)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <span className="badge badge-recent" style={{ width: 'fit-content', marginBottom: '6px' }}>
                    DISTRICT PASS EXCLUSIVE
                  </span>
                  <h4 style={{ fontSize: '1.05rem', color: '#fff', fontWeight: 800 }}>
                    Complimentary Valet & Tableside Wagyu
                  </h4>
                  <p style={{ fontSize: '0.74rem', color: '#e2e8f0', marginTop: '2px' }}>
                    Active for players seated in $5/$10+ games tonight on the Strip.
                  </p>
                </div>
              </div>

              {/* VENUES LIST HEADER & COUNT */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  ALL POKER CLUBS NEAR YOU ({filteredClubs.length})
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--accent-live)', fontWeight: 600 }}>
                  ● 100% Live Truth
                </span>
              </div>

              {/* SWIGGY / ZOMATO RESTAURANT CARD FEED */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                        borderRadius: '20px',
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease'
                      }}
                    >
                      {/* HERO PHOTO CONTAINER WITH OVERLAYS */}
                      <div style={{ position: 'relative', height: '190px' }}>
                        <img
                          src={club.imageUrl}
                          alt={club.displayName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        {/* Top Overlay Badges */}
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          right: '10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          {/* Live Status Pill */}
                          <span className={`badge badge-${club.freshnessLabel.toLowerCase()}`} style={{ background: 'rgba(8, 12, 20, 0.85)', backdropFilter: 'blur(4px)' }}>
                            <span className="badge-pulse" /> {club.freshnessLabel} ({club.lastUpdatedMinutesAgo}m)
                          </span>

                          {/* Heart Bookmark Button */}
                          <button
                            onClick={(e) => toggleFavorite(club.id, e)}
                            style={{
                              width: '32px',
                              height: '32px',
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
                            <Heart size={16} fill={isFav ? '#ef4444' : 'none'} />
                          </button>
                        </div>

                        {/* Bottom Overlay: Distance Pill & Perk Tag */}
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          left: '10px',
                          right: '10px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          {/* District Perk Ribbon */}
                          {club.featuredOffer ? (
                            <span className="district-offer-tag">
                              <Sparkles size={11} /> PERK ACTIVE
                            </span>
                          ) : <span />}

                          {/* Distance & ETA Badge */}
                          <span style={{
                            background: 'rgba(8, 12, 20, 0.85)',
                            backdropFilter: 'blur(6px)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: '#fff'
                          }}>
                            ⏱ {Math.round(club.distanceKm * 4)} mins • {club.distanceKm} km
                          </span>
                        </div>
                      </div>

                      {/* CARD DETAILS BODY (SWIGGY/ZOMATO TYPOGRAPHY) */}
                      <div style={{ padding: '14px' }}>
                        {/* Title & Green Rating Pill */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                              {club.displayName}
                            </h3>
                            {club.isVerified && (
                              <ShieldCheck size={16} style={{ color: 'var(--accent-live)' }} />
                            )}
                          </div>

                          {/* Iconic Green Rating Box */}
                          <div className="district-rating-badge">
                            <span>{club.rating}</span>
                            <Star size={11} fill="#86efac" />
                          </div>
                        </div>

                        {/* Stakes & Price Range */}
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          {club.vibeTags.slice(0, 2).join(' • ')} • {club.priceRange.split('•')[0]}
                        </div>

                        {/* Live Room Telemetry Strip */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px',
                          border: '1px solid var(--border-subtle)',
                          marginBottom: '10px',
                          fontSize: '0.76rem'
                        }}>
                          <div>
                            <span style={{ color: 'var(--accent-live)', fontWeight: 800 }}>● {activeCount} Tables</span> Live
                          </div>
                          <div style={{ color: 'var(--text-dim)' }}>•</div>
                          <div>
                            <span style={{ color: 'var(--accent-recent)', fontWeight: 800 }}>{waitCount}</span> on Waitlist
                          </div>
                          <div style={{ color: 'var(--text-dim)' }}>•</div>
                          <div>
                            Score: <strong style={{ color: 'var(--text-main)' }}>{club.discoveryScore}</strong>
                          </div>
                        </div>

                        {/* Tableside Food Snippet */}
                        {club.menuHighlights && club.menuHighlights.length > 0 && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
                            <Utensils size={12} style={{ color: 'var(--accent-cyan)' }} />
                            <span>{club.menuHighlights.join(' • ')}</span>
                          </div>
                        )}

                        {/* 1-Tap Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClubForModal(club);
                            setShowJoinModal(true);
                          }}
                          className="btn btn-primary"
                          style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
                          disabled={club.freshnessLabel === 'UNAVAILABLE'}
                        >
                          Join Remote Waitlist
                        </button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>District Live Radar</h3>
                <span className="badge badge-live">6 Venues</span>
              </div>

              <div style={{
                height: '360px',
                background: 'radial-gradient(ellipse at center, #111d33 0%, #090e18 100%)',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
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
                        fontSize: '0.72rem',
                        border: `1.5px solid ${c.freshnessLabel === 'LIVE' ? 'var(--accent-live)' : '#64748b'}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span>♠</span>
                        <span>{c.displayName.split(' ')[0]}</span>
                        <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>★{c.rating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedPinClub && (
                <div style={{
                  padding: '14px',
                  background: 'var(--bg-secondary)',
                  borderRadius: '14px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <img
                    src={selectedPinClub.imageUrl}
                    alt={selectedPinClub.displayName}
                    style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{selectedPinClub.displayName}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {selectedPinClub.distanceKm} km away • {selectedPinClub.stakesSummary.length * 3} tables running
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Tournaments & Series</h3>
                <span className="badge badge-live">3 Today</span>
              </div>

              {tournaments.map(trn => {
                const mins = Math.floor(trn.levelSecondsRemaining / 60);
                const secs = trn.levelSecondsRemaining % 60;

                return (
                  <div key={trn.id} className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          {trn.clubName}
                        </span>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '2px' }}>{trn.title}</h4>
                      </div>
                      <span className="badge badge-live">{trn.state}</span>
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
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>BUY-IN</div>
                        <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700 }}>${trn.buyInDollars}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>GUARANTEE</div>
                        <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                          ${(trn.guaranteeDollars / 1000).toFixed(0)}k
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>CLOCK</div>
                        <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                          {mins}:{secs < 10 ? '0' : ''}{secs}
                        </div>
                      </div>
                    </div>

                    <button className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                      Follow Tournament Alerts
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW: WAITLISTS */}
          {activeBottomNav === 'QUEUES' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>My Active Waitlists</h3>

              {userQueues.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 16px', background: 'var(--bg-secondary)', borderRadius: '16px' }}>
                  <Clock size={36} style={{ color: 'var(--text-dim)', margin: '0 auto 10px' }} />
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>No Active Queues</div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', marginBottom: '14px' }}>
                    Join a poker waitlist from the District feed to hold your seat before heading to the casino.
                  </p>
                  <button onClick={() => setActiveBottomNav('DISTRICT')} className="btn btn-primary btn-sm">
                    Browse Live Games
                  </button>
                </div>
              ) : (
                userQueues.map(q => (
                  <div key={q.id} style={{
                    padding: '16px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{q.clubName}</h4>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                          {q.stakeLabel} {q.gameCode}
                        </div>
                      </div>
                      <span className="badge badge-recent">QUEUED</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '10px'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>POSITION</div>
                        <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-live)' }}>
                          #{q.queuePosition}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>EST. SEAT</div>
                        <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700 }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Profile Card */}
              <div style={{
                padding: '18px',
                background: 'var(--bg-secondary)',
                borderRadius: '18px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
                  color: '#080c14',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  AM
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Alex Morgan</h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    VIP District Member • Las Vegas Strip
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <span className="badge badge-live">Verified Player</span>
                  </div>
                </div>
              </div>

              {/* Bankroll & Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="glass-panel" style={{ padding: '14px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>BANKROLL</div>
                  <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-live)' }}>
                    $15,820
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-live)' }}>+$3,370 profit</div>
                </div>
                <div className="glass-panel" style={{ padding: '14px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>WIN RATE</div>
                  <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                    $44.20/hr
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>28 hours tracked</div>
                </div>
              </div>

              {/* Sessions List */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Recent Tracked Sessions</h4>
                  <button onClick={() => setShowSessionModal(true)} className="btn btn-primary btn-sm">
                    <Plus size={13} /> Log
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sessions.map(s => (
                    <div key={s.id} style={{
                      padding: '10px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>{s.venueName}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {s.stake} {s.game} • {s.startedAt}
                        </div>
                      </div>
                      <div className="mono" style={{
                        fontWeight: 800,
                        fontSize: '0.9rem',
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
            <Flame size={20} />
            <span>District</span>
          </button>

          <button
            onClick={() => setActiveBottomNav('RADAR')}
            className={`mobile-tab-btn ${activeBottomNav === 'RADAR' ? 'active' : ''}`}
          >
            <Compass size={20} />
            <span>Radar</span>
          </button>

          <button
            onClick={() => setActiveBottomNav('EVENTS')}
            className={`mobile-tab-btn ${activeBottomNav === 'EVENTS' ? 'active' : ''}`}
          >
            <Trophy size={20} />
            <span>Events</span>
          </button>

          <button
            onClick={() => setActiveBottomNav('QUEUES')}
            className={`mobile-tab-btn ${activeBottomNav === 'QUEUES' ? 'active' : ''}`}
          >
            <Clock size={20} />
            <span>Waitlists</span>
          </button>

          <button
            onClick={() => setActiveBottomNav('PROFILE')}
            className={`mobile-tab-btn ${activeBottomNav === 'PROFILE' ? 'active' : ''}`}
          >
            <Wallet size={20} />
            <span>My Poker</span>
          </button>
        </div>

        {/* ZOMATO STYLE FULL PULL-UP BOTTOM SHEET FOR CLUB DETAILS */}
        {detailedClub && (
          <div className="bottom-sheet-overlay" onClick={() => setDetailedClub(null)}>
            <div className="bottom-sheet-content" onClick={e => e.stopPropagation()}>
              <div className="bottom-sheet-handle" />

              {/* Photo & Carousel Header */}
              <div style={{ position: 'relative', height: '220px', borderRadius: '16px', overflow: 'hidden', marginBottom: '16px' }}>
                <img
                  src={detailedClub.galleryUrls[activeGalleryIndex] || detailedClub.imageUrl}
                  alt={detailedClub.displayName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <button
                  onClick={() => setDetailedClub(null)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
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
                  <X size={16} />
                </button>

                {/* Thumbnails */}
                <div style={{ position: 'absolute', bottom: '10px', left: '12px', display: 'flex', gap: '6px' }}>
                  {detailedClub.galleryUrls.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="thumb"
                      onClick={() => setActiveGalleryIndex(idx)}
                      style={{
                        width: '42px',
                        height: '28px',
                        borderRadius: '4px',
                        objectFit: 'cover',
                        border: activeGalleryIndex === idx ? '2px solid var(--accent-live)' : '1px solid rgba(255,255,255,0.4)',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Title & Ratings */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{detailedClub.displayName}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {detailedClub.address} • {detailedClub.distanceKm} km away
                  </div>
                </div>

                <div className="district-rating-badge" style={{ fontSize: '0.9rem', padding: '4px 10px' }}>
                  <span>{detailedClub.rating}</span>
                  <Star size={13} fill="#86efac" />
                </div>
              </div>

              {/* Perk Banner */}
              {detailedClub.featuredOffer && (
                <div style={{
                  padding: '10px 14px',
                  background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '10px',
                  fontSize: '0.78rem',
                  color: '#fbbf24',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '16px'
                }}>
                  <Sparkles size={16} style={{ flexShrink: 0 }} />
                  <span>{detailedClub.featuredOffer}</span>
                </div>
              )}

              {/* Live Tables Breakdown */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                  Live Games Running Now
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {detailedClub.stakesSummary.map((s, idx) => (
                    <div key={idx} style={{
                      padding: '8px 10px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tableside Food Menu */}
              {detailedClub.menuHighlights && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
                    Tableside Dining & Cocktails
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {detailedClub.menuHighlights.map((dish, i) => (
                      <div key={i} style={{
                        padding: '8px 12px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.8rem'
                      }}>
                        <Utensils size={14} style={{ color: 'var(--accent-cyan)' }} />
                        <span>{dish}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sticky Action Footer */}
              <div style={{ display: 'flex', gap: '10px' }}>
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
                  <PhoneCall size={16} /> Call
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
                maxWidth: '420px',
                padding: 0,
                overflow: 'hidden',
                borderRadius: '24px',
                background: '#080c14'
              }}
            >
              <div style={{ position: 'relative', height: '320px' }}>
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
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
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
                  <X size={16} />
                </button>

                <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
                  <span className="badge badge-live" style={{ marginBottom: '4px' }}>
                    {activeStory.badge}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 800 }}>{activeStory.title}</h3>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>
                    {activeStory.clubName}
                  </div>
                </div>
              </div>

              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
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
                  style={{ width: '100%', padding: '10px' }}
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
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Join Remote Waitlist</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                {selectedClubForModal.displayName} — Select your game:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
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
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>{opt.stake} {opt.game}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Queue depth: {opt.wait} players
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

        {/* MODAL: LOG SESSION */}
        {showSessionModal && (
          <div className="modal-overlay" onClick={() => setShowSessionModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '4px' }}>Log Poker Session</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Private by default. Saved to encrypted bankroll ledger.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>VENUE</label>
                  <input
                    type="text"
                    value={newSessionVenue}
                    onChange={e => setNewSessionVenue(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '6px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>GAME</label>
                    <input
                      type="text"
                      value={newSessionGame}
                      onChange={e => setNewSessionGame(e.target.value)}
                      style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>STAKE</label>
                    <input
                      type="text"
                      value={newSessionStake}
                      onChange={e => setNewSessionStake(e.target.value)}
                      style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '6px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>BUY-IN ($)</label>
                    <input
                      type="number"
                      value={newSessionBuyIn}
                      onChange={e => setNewSessionBuyIn(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>CASH-OUT ($)</label>
                    <input
                      type="number"
                      value={newSessionCashOut}
                      onChange={e => setNewSessionCashOut(Number(e.target.value))}
                      style={{ width: '100%', padding: '8px', background: '#1e293b', border: '1px solid var(--border-subtle)', color: '#fff', borderRadius: '6px' }}
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
    </div>
  );
};

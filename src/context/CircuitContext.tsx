import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Club,
  LiveTable,
  WaitlistEntry,
  Tournament,
  PokerSession,
  JournalEntry,
  AdminException,
  DiscoveryWeights,
  AuditEvent,
  TableStatus,
  FreshnessLabel
} from '../types';

interface CircuitContextType {
  // Data
  clubs: Club[];
  tables: LiveTable[];
  waitlists: WaitlistEntry[];
  tournaments: Tournament[];
  sessions: PokerSession[];
  journal: JournalEntry[];
  exceptions: AdminException[];
  weights: DiscoveryWeights;
  auditLogs: AuditEvent[];
  selectedClubId: string;
  activeRole: string;
  currentUserId: string;
  currentUserName: string;
  
  // Setters & Actions
  setSelectedClubId: (id: string) => void;
  setActiveRole: (role: string) => void;
  updateTableOccupancy: (tableId: string, delta: number) => void;
  setTableStatus: (tableId: string, status: TableStatus) => void;
  openNewTable: (clubId: string, tableCode: string, gameCode: string, stakeLabel: string) => void;
  sendHeartbeat: (clubId: string) => void;
  callWaitlistPlayer: (entryId: string) => void;
  respondSeatOffer: (entryId: string, action: 'CONFIRM' | 'DECLINE') => void;
  joinWaitlist: (clubId: string, gameCode: string, stakeLabel: string, isRemote: boolean) => void;
  leaveWaitlist: (entryId: string) => void;
  submitPlayerReport: (clubId: string, reason: string, details: string) => void;
  resolveAdminException: (exceptionId: string, notes: string) => void;
  updateWeights: (newWeights: Partial<DiscoveryWeights>) => void;
  recordSession: (session: Omit<PokerSession, 'id' | 'profitLoss' | 'durationHours'>) => void;
  createFillRequest: (clubId: string, gameCode: string, stakeLabel: string, seatsNeeded: number) => void;
  
  // Simulation Helpers
  simulateOfferSeatToUser: () => void;
  simulateDecayStaleClub: () => void;
  simulatePlayerReport: () => void;
  resetDemoData: () => void;
}

const INITIAL_CLUBS: Club[] = [
  {
    id: 'c1',
    displayName: 'Bellagio Poker Room',
    legalName: 'Bellagio Resort & Casino LLC',
    slug: 'bellagio-las-vegas',
    city: 'Las Vegas',
    address: '3600 S Las Vegas Blvd, Las Vegas, NV',
    distanceKm: 1.8,
    operatingStatus: 'OPEN',
    isVerified: true,
    freshnessLabel: 'LIVE',
    lastUpdatedMinutesAgo: 1,
    confidenceScore: 98,
    actionScore: 94.2,
    discoveryScore: 96.5,
    amenities: ['Tableside Dining', 'High Stakes Bobby\'s Room', 'Valet Parking', 'Cocktail Service', 'USB Ports'],
    phone: '+1 (702) 693-7290',
    coordinates: { lat: 36.1126, lng: -115.1767 },
    stakesSummary: ['1/3 NLH (5)', '2/5 NLH (6)', '5/10 NLH (2)', '2/5 PLO (4)', '10/25 NLH (1)'],
    imageUrl: '/images/bellagio.jpg',
    galleryUrls: ['/images/bellagio.jpg', '/images/bobbys_room.jpg', '/images/dining.jpg'],
    rating: 4.9,
    reviewCount: 1420,
    priceRange: '$$$$ • Avg Buy-in $500 - $5,000',
    vibeTags: ['Legendary Room', 'Bobby\'s Room VIP', 'Tableside Wagyu', 'High Energy'],
    featuredOffer: 'Complimentary Valet & Tableside Champagne for $5/$10+ Players',
    menuHighlights: ['Wagyu Truffle Sliders', 'Smoked Rosemary Old Fashioned', 'Caviar Blinis']
  },
  {
    id: 'c2',
    displayName: 'Aria Poker Room',
    legalName: 'Aria Resort & Casino Holdings',
    slug: 'aria-las-vegas',
    city: 'Las Vegas',
    address: '3730 S Las Vegas Blvd, Las Vegas, NV',
    distanceKm: 2.3,
    operatingStatus: 'OPEN',
    isVerified: true,
    freshnessLabel: 'LIVE',
    lastUpdatedMinutesAgo: 2,
    confidenceScore: 96,
    actionScore: 91.0,
    discoveryScore: 93.8,
    amenities: ['The Ivey Room', 'Self-Serve Drink Station', 'Comfort Seating', 'Free WiFi'],
    phone: '+1 (702) 590-7232',
    coordinates: { lat: 36.1073, lng: -115.1764 },
    stakesSummary: ['1/3 NLH (4)', '2/5 NLH (5)', '5/10 NLH (3)', '2/5 PLO (3)'],
    imageUrl: '/images/aria.jpg',
    galleryUrls: ['/images/aria.jpg', '/images/dining.jpg', '/images/bobbys_room.jpg'],
    rating: 4.8,
    reviewCount: 980,
    priceRange: '$$$ • Avg Buy-in $300 - $2,500',
    vibeTags: ['Ultra Modern', 'The Ivey Room', 'Deep PLO Action', 'Craft Cocktails'],
    featuredOffer: 'Zero-Wait VIP Seating on Friday Nights with 24h Pass',
    menuHighlights: ['Prime Ribeye Bites', 'Hibiscus Mezcal Sour', 'Artisan Sushi Roll']
  },
  {
    id: 'c3',
    displayName: 'Wynn & Encore Poker Room',
    legalName: 'Wynn Las Vegas Operations',
    slug: 'wynn-las-vegas',
    city: 'Las Vegas',
    address: '3131 S Las Vegas Blvd, Las Vegas, NV',
    distanceKm: 3.5,
    operatingStatus: 'OPEN',
    isVerified: true,
    freshnessLabel: 'LIVE',
    lastUpdatedMinutesAgo: 3,
    confidenceScore: 94,
    actionScore: 89.4,
    discoveryScore: 91.2,
    amenities: ['Spacious 28-Table Room', 'Personal USBs', 'Luxury Decor', 'Dedicated Cashier'],
    phone: '+1 (702) 770-7654',
    coordinates: { lat: 36.1297, lng: -115.1654 },
    stakesSummary: ['1/3 NLH (6)', '2/5 NLH (6)', '5/10 NLH (3)', '2/5 PLO (4)', 'Mixed (1)'],
    imageUrl: '/images/wynn.jpg',
    galleryUrls: ['/images/wynn.jpg', '/images/dining.jpg', '/images/bellagio.jpg'],
    rating: 4.9,
    reviewCount: 1850,
    priceRange: '$$$$ • Avg Buy-in $500 - $10,000',
    vibeTags: ['Gold Chandeliers', 'Championship Arena', 'Luxury Hospitality', 'Immaculate Felt'],
    featuredOffer: '$250k GTD Signature Series Entry Pass Available',
    menuHighlights: ['Maine Lobster Rolls', 'Vintage Bourbon Flight', 'Truffle Parmesan Fries']
  },
  {
    id: 'c4',
    displayName: 'Resorts World Poker Room',
    legalName: 'Resorts World Las Vegas LLC',
    slug: 'resorts-world-las-vegas',
    city: 'Las Vegas',
    address: '3000 S Las Vegas Blvd, Las Vegas, NV',
    distanceKm: 4.1,
    operatingStatus: 'OPEN',
    isVerified: true,
    freshnessLabel: 'RECENT',
    lastUpdatedMinutesAgo: 7,
    confidenceScore: 86,
    actionScore: 78.5,
    discoveryScore: 81.3,
    amenities: ['RFID Table Scanners', 'Automated Shufflers', 'Digital Waitlist Displays'],
    phone: '+1 (702) 676-7000',
    coordinates: { lat: 36.1362, lng: -115.1668 },
    stakesSummary: ['1/3 NLH (3)', '2/5 NLH (4)', '2/5 PLO (2)'],
    imageUrl: '/images/resorts_world.jpg',
    galleryUrls: ['/images/resorts_world.jpg', '/images/aria.jpg', '/images/dining.jpg'],
    rating: 4.6,
    reviewCount: 640,
    priceRange: '$$$ • Avg Buy-in $300 - $1,500',
    vibeTags: ['Cyberpunk Neon', 'RFID Smart Tables', 'Cashless Gaming', 'High Tech Lounge'],
    featuredOffer: 'Instant Mobile Table Registration via Smart NFC',
    menuHighlights: ['Peking Duck Bao Buns', 'Tokyo Highball', 'Crispy Pork Belly Skewers']
  },
  {
    id: 'c5',
    displayName: 'The Venetian Poker Room',
    legalName: 'Venetian Casino Resort LLC',
    slug: 'venetian-las-vegas',
    city: 'Las Vegas',
    address: '3355 S Las Vegas Blvd, Las Vegas, NV',
    distanceKm: 3.1,
    operatingStatus: 'OPEN',
    isVerified: true,
    freshnessLabel: 'STALE',
    lastUpdatedMinutesAgo: 19,
    confidenceScore: 68,
    actionScore: 72.0,
    discoveryScore: 64.5,
    amenities: ['High Volume Tournaments', 'Large Wait Area', 'Deepstack Extravaganza'],
    phone: '+1 (702) 414-7657',
    coordinates: { lat: 36.1212, lng: -115.1697 },
    stakesSummary: ['1/3 NLH (4)', '2/5 NLH (3)', '2/5 PLO (2)'],
    imageUrl: '/images/dining.jpg',
    galleryUrls: ['/images/dining.jpg', '/images/wynn.jpg'],
    rating: 4.5,
    reviewCount: 1120,
    priceRange: '$$ • Avg Buy-in $200 - $1,000',
    vibeTags: ['Massive Room', 'Deepstack Extravaganza', 'Non-Stop Games'],
    featuredOffer: 'Daily Tournament Rakeback Voucher',
    menuHighlights: ['Artisanal Pizza', 'Craft Beer Selection', 'Italian Gelato']
  },
  {
    id: 'c6',
    displayName: 'Golden Nugget Poker Room',
    legalName: 'Golden Nugget Las Vegas',
    slug: 'golden-nugget-downtown',
    city: 'Las Vegas (Downtown)',
    address: '129 E Fremont St, Las Vegas, NV',
    distanceKm: 7.9,
    operatingStatus: 'OPEN',
    isVerified: true,
    freshnessLabel: 'UNAVAILABLE',
    lastUpdatedMinutesAgo: 42,
    confidenceScore: 35,
    actionScore: 50.0,
    discoveryScore: 42.1,
    amenities: ['Historic Downtown Room', 'Uncapped Buy-ins', 'Billiards'],
    phone: '+1 (702) 385-7111',
    coordinates: { lat: 36.1699, lng: -115.1444 },
    stakesSummary: ['Unverified — Contact Front Desk'],
    imageUrl: '/images/bobbys_room.jpg',
    galleryUrls: ['/images/bobbys_room.jpg', '/images/bellagio.jpg'],
    rating: 4.3,
    reviewCount: 520,
    priceRange: '$$ • Avg Buy-in $100 - $500',
    vibeTags: ['Historic Fremont', 'Uncapped Cash Games', 'Old School Vegas'],
    featuredOffer: 'Fremont Experience Night Pass',
    menuHighlights: ['Classic Casino Burger', 'Draft IPA', 'Buffalo Wings']
  }
];

const INITIAL_TABLES: LiveTable[] = [
  {
    id: 't-101',
    clubId: 'c1',
    tableCode: 'T-01',
    gameCode: 'NLH',
    stakeLabel: '$1/$3',
    seatCapacity: 9,
    occupiedSeats: 9,
    waitingCount: 4,
    status: 'FULL',
    confidenceScore: 99,
    lastHeartbeatMinutesAgo: 1,
    version: 4,
    roomSection: 'Main Floor'
  },
  {
    id: 't-102',
    clubId: 'c1',
    tableCode: 'T-02',
    gameCode: 'NLH',
    stakeLabel: '$1/$3',
    seatCapacity: 9,
    occupiedSeats: 8,
    waitingCount: 0,
    status: 'ACTIVE',
    confidenceScore: 98,
    lastHeartbeatMinutesAgo: 1,
    version: 3,
    roomSection: 'Main Floor'
  },
  {
    id: 't-103',
    clubId: 'c1',
    tableCode: 'T-03',
    gameCode: 'NLH',
    stakeLabel: '$2/$5',
    seatCapacity: 9,
    occupiedSeats: 9,
    waitingCount: 6,
    status: 'FULL',
    confidenceScore: 97,
    lastHeartbeatMinutesAgo: 1,
    version: 5,
    roomSection: 'Main Floor'
  },
  {
    id: 't-104',
    clubId: 'c1',
    tableCode: 'T-04',
    gameCode: 'NLH',
    stakeLabel: '$2/$5',
    seatCapacity: 9,
    occupiedSeats: 8,
    waitingCount: 2,
    status: 'ACTIVE',
    confidenceScore: 98,
    lastHeartbeatMinutesAgo: 2,
    version: 7,
    roomSection: 'Main Floor'
  },
  {
    id: 't-105',
    clubId: 'c1',
    tableCode: 'T-05',
    gameCode: 'NLH',
    stakeLabel: '$5/$10',
    seatCapacity: 9,
    occupiedSeats: 7,
    waitingCount: 0,
    status: 'ACTIVE',
    confidenceScore: 96,
    lastHeartbeatMinutesAgo: 2,
    version: 2,
    roomSection: 'High Stakes'
  },
  {
    id: 't-106',
    clubId: 'c1',
    tableCode: 'T-06',
    gameCode: 'PLO',
    stakeLabel: '$2/$5',
    seatCapacity: 9,
    occupiedSeats: 9,
    waitingCount: 3,
    status: 'FULL',
    confidenceScore: 97,
    lastHeartbeatMinutesAgo: 1,
    version: 6,
    roomSection: 'Omaha Pit'
  },
  {
    id: 't-107',
    clubId: 'c1',
    tableCode: 'VIP-1',
    gameCode: 'NLH',
    stakeLabel: '$10/$25',
    seatCapacity: 8,
    occupiedSeats: 6,
    waitingCount: 0,
    status: 'ACTIVE',
    confidenceScore: 99,
    lastHeartbeatMinutesAgo: 1,
    version: 2,
    roomSection: "Bobby's Room"
  },
  {
    id: 't-108',
    clubId: 'c1',
    tableCode: 'T-08',
    gameCode: 'NLH',
    stakeLabel: '$1/$3',
    seatCapacity: 9,
    occupiedSeats: 4,
    waitingCount: 0,
    status: 'FORMING',
    confidenceScore: 92,
    lastHeartbeatMinutesAgo: 3,
    version: 1,
    roomSection: 'Main Floor'
  }
];

const INITIAL_WAITLISTS: WaitlistEntry[] = [
  {
    id: 'wl-1',
    clubId: 'c1',
    clubName: 'Bellagio Poker Room',
    gameCode: 'NLH',
    stakeLabel: '$2/$5',
    playerName: 'Alex Morgan (You)',
    state: 'QUEUED',
    queuePosition: 2,
    source: 'REMOTE_APP',
    requestedAt: '18:15'
  },
  {
    id: 'wl-2',
    clubId: 'c1',
    clubName: 'Bellagio Poker Room',
    gameCode: 'NLH',
    stakeLabel: '$2/$5',
    playerName: 'David K.',
    state: 'OFFERED',
    queuePosition: 1,
    source: 'PODIUM_WALKIN',
    requestedAt: '18:02',
    offeredAt: new Date().toISOString(),
    offerExpiresAt: new Date(Date.now() + 145000).toISOString(),
    assignedTableCode: 'T-04'
  },
  {
    id: 'wl-3',
    clubId: 'c1',
    clubName: 'Bellagio Poker Room',
    gameCode: 'PLO',
    stakeLabel: '$2/$5',
    playerName: 'Michael S.',
    state: 'QUEUED',
    queuePosition: 1,
    source: 'REMOTE_APP',
    requestedAt: '18:22'
  },
  {
    id: 'wl-4',
    clubId: 'c1',
    clubName: 'Bellagio Poker Room',
    gameCode: 'NLH',
    stakeLabel: '$1/$3',
    playerName: 'Sarah J.',
    state: 'CONFIRMED',
    queuePosition: 1,
    source: 'REMOTE_APP',
    requestedAt: '17:55',
    assignedTableCode: 'T-02'
  }
];

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'trn-1',
    clubId: 'c1',
    clubName: 'Bellagio Poker Room',
    title: 'Bellagio 2:00 PM Daily Deepstack',
    gameCode: 'NLH',
    buyInDollars: 200,
    entryFeeDollars: 30,
    guaranteeDollars: 15000,
    startingChips: 25000,
    startTime: 'Today, 2:00 PM',
    state: 'RUNNING',
    currentLevel: 7,
    smallBlind: 500,
    bigBlind: 1000,
    ante: 1000,
    levelDurationMinutes: 25,
    levelSecondsRemaining: 680,
    entriesCount: 84,
    remainingPlayersCount: 42
  },
  {
    id: 'trn-2',
    clubId: 'c2',
    clubName: 'Aria Poker Room',
    title: 'Aria 7:00 PM Nightly Bounty ($50 Bounty)',
    gameCode: 'NLH',
    buyInDollars: 160,
    entryFeeDollars: 25,
    guaranteeDollars: 10000,
    startingChips: 20000,
    startTime: 'Today, 7:00 PM',
    state: 'REGISTRATION_OPEN',
    currentLevel: 1,
    smallBlind: 100,
    bigBlind: 200,
    ante: 200,
    levelDurationMinutes: 20,
    levelSecondsRemaining: 1200,
    entriesCount: 36,
    remainingPlayersCount: 36
  },
  {
    id: 'trn-3',
    clubId: 'c3',
    clubName: 'Wynn & Encore Poker Room',
    title: 'Wynn Signature Series $250k GTD Main Event',
    gameCode: 'NLH',
    buyInDollars: 1100,
    entryFeeDollars: 100,
    guaranteeDollars: 250000,
    startingChips: 50000,
    startTime: 'Tomorrow, 11:00 AM',
    state: 'ANNOUNCED',
    currentLevel: 1,
    smallBlind: 100,
    bigBlind: 200,
    ante: 200,
    levelDurationMinutes: 40,
    levelSecondsRemaining: 2400,
    entriesCount: 0,
    remainingPlayersCount: 0
  }
];

const INITIAL_SESSIONS: PokerSession[] = [
  {
    id: 's1',
    venueName: 'Bellagio Poker Room',
    game: 'NLH',
    stake: '$2/$5',
    buyIn: 500,
    cashOut: 1380,
    profitLoss: 880,
    startedAt: 'Yesterday, 19:30',
    endedAt: 'Yesterday, 23:45',
    durationHours: 4.25,
    notes: 'Ran warm, hero-called river with 2nd pair vs aggressive reg.'
  },
  {
    id: 's2',
    venueName: 'Aria Poker Room',
    game: 'PLO',
    stake: '$2/$5',
    buyIn: 1000,
    cashOut: 1750,
    profitLoss: 750,
    startedAt: '3 days ago',
    endedAt: '3 days ago',
    durationHours: 3.5,
    notes: 'Flopped nut wrap + flush draw twice. Deep table dynamic.'
  },
  {
    id: 's3',
    venueName: 'Wynn Poker Room',
    game: 'NLH',
    stake: '$5/$10',
    buyIn: 1500,
    cashOut: 1100,
    profitLoss: -400,
    startedAt: '5 days ago',
    endedAt: '5 days ago',
    durationHours: 5.0,
    notes: 'Tough lineup, folded sets on paired flush boards.'
  }
];

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: 'j1',
    title: 'River Bluff-Catcher Theory @ Bellagio $2/$5',
    date: 'Oct 1, 2026',
    content: 'Villain triple-barreled on A-K-7-3-2 rainbow after limp-calling pre. Sizing looked heavily polarized. My hand: K-J offsuit. Pot odds 3:1. Decided to call, caught missed diamond gutshot bluff.',
    tags: ['#hero-call', '#sizing-tell', '#deepstack']
  },
  {
    id: 'j2',
    title: 'PLO Wrap Sizing & Free Card Prevention',
    date: 'Sep 28, 2026',
    content: 'When holding 13+ out wrap on two-tone board, check-raising pot from out of position generated maximum fold equity while charging drawing hands correctly.',
    tags: ['#omaha', '#equity', '#check-raise']
  }
];

const INITIAL_EXCEPTIONS: AdminException[] = [
  {
    id: 'ex-1',
    queueType: 'STALE_CLUB',
    severity: 'P2_URGENT',
    title: 'Venetian Poker Room feed exceeds 15m SLA',
    summary: 'No operator heartbeat or POS snapshot received in 19 minutes during declared peak hours.',
    clubId: 'c5',
    clubName: 'The Venetian Poker Room',
    createdAt: '12m ago',
    status: 'OPEN'
  },
  {
    id: 'ex-2',
    queueType: 'DATA_CONFLICT',
    severity: 'P3_WARNING',
    title: 'Player reported inaccurate table occupancy',
    summary: 'Verified geolocated player flagged Table T-08 as empty while room listed 4 players seated.',
    clubId: 'c1',
    clubName: 'Bellagio Poker Room',
    createdAt: '24m ago',
    status: 'OPEN'
  }
];

const INITIAL_WEIGHTS: DiscoveryWeights = {
  relevance: 0.30,
  actionScore: 0.20,
  freshness: 0.20,
  proximity: 0.15,
  followAffinity: 0.10,
  tournamentRelevance: 0.05
};

const INITIAL_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-1',
    actor: 'Floor Manager (David S.)',
    action: 'table.update_occupancy',
    entityType: 'TABLE',
    entityName: 'T-01 ($1/$3 NLH)',
    occurredAt: '18:32:10',
    details: 'Occupancy set to 9/9 (Status -> FULL)'
  },
  {
    id: 'aud-2',
    actor: 'Waitlist Engine',
    action: 'seat.offer.created',
    entityType: 'WAITLIST',
    entityName: 'David K. ($2/$5 NLH)',
    occurredAt: '18:34:00',
    details: 'Seat offer dispatched with 180s TTL'
  },
  {
    id: 'aud-3',
    actor: 'Freshness Watchdog (Cron)',
    action: 'data.confidence.changed',
    entityType: 'CLUB',
    entityName: 'The Venetian',
    occurredAt: '18:25:00',
    details: 'Heartbeat timeout: Confidence downgraded to 68 (STALE)'
  }
];

const CircuitContext = createContext<CircuitContextType | null>(null);

export const CircuitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clubs, setClubs] = useState<Club[]>(INITIAL_CLUBS);
  const [tables, setTables] = useState<LiveTable[]>(INITIAL_TABLES);
  const [waitlists, setWaitlists] = useState<WaitlistEntry[]>(INITIAL_WAITLISTS);
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);
  const [sessions, setSessions] = useState<PokerSession[]>(INITIAL_SESSIONS);
  const [journal, setJournal] = useState<JournalEntry[]>(INITIAL_JOURNAL);
  const [exceptions, setExceptions] = useState<AdminException[]>(INITIAL_EXCEPTIONS);
  const [weights, setWeights] = useState<DiscoveryWeights>(INITIAL_WEIGHTS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_AUDIT_LOGS);
  const [selectedClubId, setSelectedClubId] = useState<string>('c1');
  const [activeRole, setActiveRole] = useState<string>('FLOOR_MANAGER');
  const currentUserId = 'usr-alex-morgan';
  const currentUserName = 'Alex Morgan';

  // Recalculate DiscoveryScore whenever weights or metrics change
  useEffect(() => {
    setClubs(prev => prev.map(club => {
      const rel = 0.95;
      const act = club.actionScore / 100;
      let fresh = 0.5;
      if (club.freshnessLabel === 'LIVE') fresh = 1.0;
      else if (club.freshnessLabel === 'RECENT') fresh = 0.8;
      else if (club.freshnessLabel === 'STALE') fresh = 0.4;
      else fresh = 0.1;

      const prox = Math.max(0.2, 1 - (club.distanceKm / 15));
      const follow = club.id === 'c1' || club.id === 'c2' ? 1.0 : 0.4;
      const trn = 0.8;

      const rawScore = (
        (weights.relevance * rel) +
        (weights.actionScore * act) +
        (weights.freshness * fresh) +
        (weights.proximity * prox) +
        (weights.followAffinity * follow) +
        (weights.tournamentRelevance * trn)
      ) * 100;

      return {
        ...club,
        discoveryScore: Number(rawScore.toFixed(1))
      };
    }));
  }, [weights]);

  // Real-time ticking effect: decrement active countdown timers and tournament clocks
  useEffect(() => {
    const timer = setInterval(() => {
      // 1. Check waitlist offer expiry
      setWaitlists(prev => prev.map(entry => {
        if (entry.state === 'OFFERED' && entry.offerExpiresAt) {
          const timeLeftMs = new Date(entry.offerExpiresAt).getTime() - Date.now();
          if (timeLeftMs <= 0) {
            // Auto expire
            return {
              ...entry,
              state: 'EXPIRED',
              offerExpiresAt: undefined
            };
          }
        }
        return entry;
      }));

      // 2. Decrement tournament level clock
      setTournaments(prev => prev.map(t => {
        if (t.state === 'RUNNING' && t.levelSecondsRemaining > 0) {
          return {
            ...t,
            levelSecondsRemaining: t.levelSecondsRemaining - 1
          };
        }
        return t;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 3-Click Floor Table Occupancy Stepper
  const updateTableOccupancy = (tableId: string, delta: number) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        const nextOccupied = Math.max(0, Math.min(t.seatCapacity, t.occupiedSeats + delta));
        let nextStatus: TableStatus = t.status;
        
        // Automated rule: Auto-set FULL when capacity reached
        if (nextOccupied === t.seatCapacity && t.status === 'ACTIVE') {
          nextStatus = 'FULL';
        } else if (nextOccupied < t.seatCapacity && t.status === 'FULL') {
          nextStatus = 'ACTIVE';
        }

        // Add audit log
        const newLog: AuditEvent = {
          id: `aud-${Date.now()}`,
          actor: 'Floor Manager',
          action: 'table.update_occupancy',
          entityType: 'TABLE',
          entityName: `${t.tableCode} (${t.stakeLabel})`,
          occurredAt: new Date().toLocaleTimeString(),
          details: `Seats changed from ${t.occupiedSeats} to ${nextOccupied} (Status: ${nextStatus})`
        };
        setAuditLogs(l => [newLog, ...l]);

        return {
          ...t,
          occupiedSeats: nextOccupied,
          status: nextStatus,
          lastHeartbeatMinutesAgo: 0,
          confidenceScore: 100,
          version: t.version + 1
        };
      }
      return t;
    }));

    // Update club's lastUpdated
    setClubs(prev => prev.map(c => {
      if (c.id === selectedClubId) {
        return {
          ...c,
          freshnessLabel: 'LIVE',
          lastUpdatedMinutesAgo: 0,
          confidenceScore: 99
        };
      }
      return c;
    }));
  };

  const setTableStatus = (tableId: string, status: TableStatus) => {
    setTables(prev => prev.map(t => {
      if (t.id === tableId) {
        const newLog: AuditEvent = {
          id: `aud-${Date.now()}`,
          actor: 'Floor Manager',
          action: 'table.status_change',
          entityType: 'TABLE',
          entityName: `${t.tableCode} (${t.stakeLabel})`,
          occurredAt: new Date().toLocaleTimeString(),
          details: `Status set to ${status}`
        };
        setAuditLogs(l => [newLog, ...l]);

        return {
          ...t,
          status,
          version: t.version + 1,
          lastHeartbeatMinutesAgo: 0
        };
      }
      return t;
    }));
  };

  const openNewTable = (clubId: string, tableCode: string, gameCode: string, stakeLabel: string) => {
    const newTable: LiveTable = {
      id: `t-${Date.now()}`,
      clubId,
      tableCode,
      gameCode,
      stakeLabel,
      seatCapacity: 9,
      occupiedSeats: 5,
      waitingCount: 0,
      status: 'FORMING',
      confidenceScore: 100,
      lastHeartbeatMinutesAgo: 0,
      version: 1,
      roomSection: 'Main Floor'
    };

    setTables(prev => [...prev, newTable]);

    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      actor: 'Floor Manager',
      action: 'table.opened',
      entityType: 'TABLE',
      entityName: `${tableCode} (${stakeLabel} ${gameCode})`,
      occurredAt: new Date().toLocaleTimeString(),
      details: 'New table opened with 5 players seated'
    };
    setAuditLogs(l => [newLog, ...l]);
  };

  const sendHeartbeat = (clubId: string) => {
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        return {
          ...c,
          freshnessLabel: 'LIVE',
          lastUpdatedMinutesAgo: 0,
          confidenceScore: 98
        };
      }
      return c;
    }));

    // Auto clear any stale exception
    setExceptions(prev => prev.filter(e => !(e.clubId === clubId && e.queueType === 'STALE_CLUB')));

    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      actor: 'Club Floor Terminal',
      action: 'club.heartbeat',
      entityType: 'CLUB',
      entityName: clubId,
      occurredAt: new Date().toLocaleTimeString(),
      details: '1-Tap Heartbeat refreshed. Freshness set to LIVE.'
    };
    setAuditLogs(l => [newLog, ...l]);
  };

  const callWaitlistPlayer = (entryId: string) => {
    const expiresAt = new Date(Date.now() + 180000).toISOString(); // 180 seconds

    setWaitlists(prev => prev.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          state: 'OFFERED',
          offeredAt: new Date().toISOString(),
          offerExpiresAt: expiresAt,
          assignedTableCode: 'T-04'
        };
      }
      return entry;
    }));

    const target = waitlists.find(w => w.id === entryId);
    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      actor: 'Floor Manager',
      action: 'waitlist.seat_offered',
      entityType: 'WAITLIST',
      entityName: target?.playerName || entryId,
      occurredAt: new Date().toLocaleTimeString(),
      details: 'Seat offer dispatched with 180s countdown'
    };
    setAuditLogs(l => [newLog, ...l]);
  };

  const respondSeatOffer = (entryId: string, action: 'CONFIRM' | 'DECLINE') => {
    setWaitlists(prev => prev.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          state: action === 'CONFIRM' ? 'CONFIRMED' : 'DECLINED',
          offerExpiresAt: undefined
        };
      }
      return entry;
    }));

    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      actor: 'Player App',
      action: 'seat.offer.responded',
      entityType: 'SEAT_OFFER',
      entityName: entryId,
      occurredAt: new Date().toLocaleTimeString(),
      details: `Player responded: ${action}`
    };
    setAuditLogs(l => [newLog, ...l]);
  };

  const joinWaitlist = (clubId: string, gameCode: string, stakeLabel: string, isRemote: boolean) => {
    const club = clubs.find(c => c.id === clubId);
    const existing = waitlists.filter(w => w.clubId === clubId && w.stakeLabel === stakeLabel);

    const newEntry: WaitlistEntry = {
      id: `wl-${Date.now()}`,
      clubId,
      clubName: club?.displayName || 'Poker Room',
      gameCode,
      stakeLabel,
      playerName: isRemote ? 'Alex Morgan (You)' : 'Podium Walk-In',
      state: 'QUEUED',
      queuePosition: existing.length + 1,
      source: isRemote ? 'REMOTE_APP' : 'PODIUM_WALKIN',
      requestedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setWaitlists(prev => [...prev, newEntry]);

    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      actor: isRemote ? 'Player App' : 'Front Desk GRE',
      action: 'waitlist.joined',
      entityType: 'WAITLIST',
      entityName: `${newEntry.playerName} (${stakeLabel})`,
      occurredAt: new Date().toLocaleTimeString(),
      details: `Position #${newEntry.queuePosition} assigned`
    };
    setAuditLogs(l => [newLog, ...l]);
  };

  const leaveWaitlist = (entryId: string) => {
    setWaitlists(prev => prev.filter(w => w.id !== entryId));
  };

  const submitPlayerReport = (clubId: string, reason: string, details: string) => {
    const club = clubs.find(c => c.id === clubId);
    const newEx: AdminException = {
      id: `ex-${Date.now()}`,
      queueType: 'DATA_CONFLICT',
      severity: 'P3_WARNING',
      title: `Player Report: ${reason}`,
      summary: details,
      clubId,
      clubName: club?.displayName,
      createdAt: 'Just now',
      status: 'OPEN'
    };

    setExceptions(prev => [newEx, ...prev]);

    // Slight confidence decay
    setClubs(prev => prev.map(c => {
      if (c.id === clubId) {
        return {
          ...c,
          confidenceScore: Math.max(30, c.confidenceScore - 15)
        };
      }
      return c;
    }));
  };

  const resolveAdminException = (exceptionId: string, notes: string) => {
    setExceptions(prev => prev.map(e => {
      if (e.id === exceptionId) {
        return { ...e, status: 'RESOLVED' };
      }
      return e;
    }));

    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      actor: 'Circuit 52 Admin (Network Ops)',
      action: 'exception.resolved',
      entityType: 'EXCEPTION',
      entityName: exceptionId,
      occurredAt: new Date().toLocaleTimeString(),
      details: `Resolution: ${notes}`
    };
    setAuditLogs(l => [newLog, ...l]);
  };

  const updateWeights = (newWeights: Partial<DiscoveryWeights>) => {
    setWeights(prev => ({ ...prev, ...newWeights }));
  };

  const recordSession = (sessionData: Omit<PokerSession, 'id' | 'profitLoss' | 'durationHours'>) => {
    const profitLoss = sessionData.cashOut - sessionData.buyIn;
    const newSession: PokerSession = {
      ...sessionData,
      id: `s-${Date.now()}`,
      profitLoss,
      durationHours: 3.5
    };
    setSessions(prev => [newSession, ...prev]);
  };

  const createFillRequest = (clubId: string, gameCode: string, stakeLabel: string, seatsNeeded: number) => {
    const club = clubs.find(c => c.id === clubId);
    const newLog: AuditEvent = {
      id: `aud-${Date.now()}`,
      actor: 'Club GM',
      action: 'demand.fill_request_created',
      entityType: 'DEMAND',
      entityName: `${club?.displayName} (${stakeLabel} ${gameCode})`,
      occurredAt: new Date().toLocaleTimeString(),
      details: `Demand blast for ${seatsNeeded} players. 18 nearby players matched.`
    };
    setAuditLogs(l => [newLog, ...l]);
  };

  // --- SIMULATION TRIGGERS ---
  const simulateOfferSeatToUser = () => {
    // Find or create an entry for Alex Morgan
    let entry = waitlists.find(w => w.playerName.includes('Alex Morgan'));
    if (!entry) {
      entry = {
        id: `wl-${Date.now()}`,
        clubId: 'c1',
        clubName: 'Bellagio Poker Room',
        gameCode: 'NLH',
        stakeLabel: '$2/$5',
        playerName: 'Alex Morgan (You)',
        state: 'QUEUED',
        queuePosition: 1,
        source: 'REMOTE_APP',
        requestedAt: 'Just now'
      };
      setWaitlists(prev => [entry!, ...prev]);
    }

    callWaitlistPlayer(entry.id);
  };

  const simulateDecayStaleClub = () => {
    setClubs(prev => prev.map(c => {
      if (c.id === 'c3') { // Wynn
        return {
          ...c,
          freshnessLabel: 'STALE' as FreshnessLabel,
          lastUpdatedMinutesAgo: 22,
          confidenceScore: 62
        };
      }
      return c;
    }));

    const newEx: AdminException = {
      id: `ex-${Date.now()}`,
      queueType: 'STALE_CLUB',
      severity: 'P2_URGENT',
      title: 'Wynn Poker Room heartbeat timeout',
      summary: 'No update received in 22 minutes. Confidence downgraded to 62.',
      clubId: 'c3',
      clubName: 'Wynn & Encore Poker Room',
      createdAt: 'Just now',
      status: 'OPEN'
    };
    setExceptions(prev => [newEx, ...prev]);
  };

  const simulatePlayerReport = () => {
    submitPlayerReport('c1', 'TABLE_COUNT_INACCURATE', 'Table T-06 listed as FULL with 9 players, but 3 seats have been empty for 25 mins.');
  };

  const resetDemoData = () => {
    setClubs(INITIAL_CLUBS);
    setTables(INITIAL_TABLES);
    setWaitlists(INITIAL_WAITLISTS);
    setTournaments(INITIAL_TOURNAMENTS);
    setSessions(INITIAL_SESSIONS);
    setJournal(INITIAL_JOURNAL);
    setExceptions(INITIAL_EXCEPTIONS);
    setWeights(INITIAL_WEIGHTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
  };

  return (
    <CircuitContext.Provider
      value={{
        clubs,
        tables,
        waitlists,
        tournaments,
        sessions,
        journal,
        exceptions,
        weights,
        auditLogs,
        selectedClubId,
        activeRole,
        currentUserId,
        currentUserName,
        setSelectedClubId,
        setActiveRole,
        updateTableOccupancy,
        setTableStatus,
        openNewTable,
        sendHeartbeat,
        callWaitlistPlayer,
        respondSeatOffer,
        joinWaitlist,
        leaveWaitlist,
        submitPlayerReport,
        resolveAdminException,
        updateWeights,
        recordSession,
        createFillRequest,
        simulateOfferSeatToUser,
        simulateDecayStaleClub,
        simulatePlayerReport,
        resetDemoData
      }}
    >
      {children}
    </CircuitContext.Provider>
  );
};

export const useCircuit = () => {
  const context = useContext(CircuitContext);
  if (!context) {
    throw new Error('useCircuit must be used within a CircuitProvider');
  }
  return context;
};

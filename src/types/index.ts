export type FreshnessLabel = 'LIVE' | 'RECENT' | 'STALE' | 'UNAVAILABLE';

export type TableStatus = 'FORMING' | 'ACTIVE' | 'FULL' | 'PAUSED' | 'CLOSING' | 'CLOSED';

export type WaitlistState = 
  | 'REQUESTED' 
  | 'ACCEPTED' 
  | 'QUEUED' 
  | 'OFFERED' 
  | 'CONFIRMED' 
  | 'CHECKED_IN' 
  | 'SEATED' 
  | 'COMPLETED' 
  | 'DECLINED' 
  | 'EXPIRED' 
  | 'NO_SHOW' 
  | 'CANCELLED';

export type TournamentState = 'ANNOUNCED' | 'REGISTRATION_OPEN' | 'RUNNING' | 'LATE_REG_CLOSED' | 'FINAL_TABLE' | 'COMPLETED';

export type ClubRole = 
  | 'OWNER_GM'
  | 'OPERATIONS_MANAGER'
  | 'FLOOR_MANAGER'
  | 'TOURNAMENT_MANAGER'
  | 'CRM_MARKETING'
  | 'FRONT_DESK_GRE'
  | 'ANALYST_READONLY';

export type AdminRole = 
  | 'SUPER_ADMIN'
  | 'NETWORK_OPERATIONS'
  | 'CLUB_SUCCESS'
  | 'SUPPORT_AGENT'
  | 'RISK_TRUST'
  | 'COMMERCIAL'
  | 'PRODUCT_ANALYST'
  | 'FINANCE';

export interface LiveTable {
  id: string;
  clubId: string;
  tableCode: string;
  gameCode: string; // 'NLH' | 'PLO' | 'ROE'
  stakeLabel: string; // '$1/$2', '$2/$5', '$5/$10'
  seatCapacity: number;
  occupiedSeats: number;
  waitingCount: number;
  status: TableStatus;
  confidenceScore: number;
  lastHeartbeatMinutesAgo: number;
  version: number;
  roomSection: string;
}

export interface Club {
  id: string;
  displayName: string;
  legalName: string;
  slug: string;
  city: string;
  address: string;
  distanceKm: number;
  operatingStatus: 'OPEN' | 'CLOSED' | 'TEMP_SUSPENDED';
  isVerified: boolean;
  freshnessLabel: FreshnessLabel;
  lastUpdatedMinutesAgo: number;
  confidenceScore: number;
  actionScore: number;
  discoveryScore: number;
  amenities: string[];
  phone: string;
  coordinates: { lat: number; lng: number };
  stakesSummary: string[];
}

export interface WaitlistEntry {
  id: string;
  clubId: string;
  clubName: string;
  gameCode: string;
  stakeLabel: string;
  playerName: string;
  state: WaitlistState;
  queuePosition: number;
  source: 'REMOTE_APP' | 'PODIUM_WALKIN';
  requestedAt: string;
  offeredAt?: string;
  offerExpiresAt?: string; // ISO string
  assignedTableCode?: string;
}

export interface Tournament {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  gameCode: string;
  buyInDollars: number;
  entryFeeDollars: number;
  guaranteeDollars: number;
  startingChips: number;
  startTime: string;
  state: TournamentState;
  currentLevel: number;
  smallBlind: number;
  bigBlind: number;
  ante: number;
  levelDurationMinutes: number;
  levelSecondsRemaining: number;
  entriesCount: number;
  remainingPlayersCount: number;
}

export interface PokerSession {
  id: string;
  venueName: string;
  game: string;
  stake: string;
  buyIn: number;
  cashOut: number;
  profitLoss: number;
  startedAt: string;
  endedAt: string;
  durationHours: number;
  notes: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  date: string;
  content: string;
  tags: string[];
}

export interface AdminException {
  id: string;
  queueType: 'STALE_CLUB' | 'DATA_CONFLICT' | 'INTEGRATION_FAILURE' | 'ABUSE_ALERT' | 'WAITLIST_SLA_BREACH';
  severity: 'P1_CRITICAL' | 'P2_URGENT' | 'P3_WARNING' | 'P4_INFO';
  title: string;
  summary: string;
  clubId?: string;
  clubName?: string;
  createdAt: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

export interface DiscoveryWeights {
  relevance: number;
  actionScore: number;
  freshness: number;
  proximity: number;
  followAffinity: number;
  tournamentRelevance: number;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityName: string;
  occurredAt: string;
  details: string;
}

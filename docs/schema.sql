-- ==============================================================================
-- Circuit 52: Live Poker Room Network & Operations Platform
-- Master Database Schema & DDL Migrations (PostgreSQL 16 + PostGIS)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. CUSTOM ENUMS
CREATE TYPE user_system_role AS ENUM (
    'PLAYER',
    'CLUB_STAFF',
    'PLATFORM_ADMIN'
);

CREATE TYPE club_role AS ENUM (
    'OWNER_GM',
    'OPERATIONS_MANAGER',
    'FLOOR_MANAGER',
    'TOURNAMENT_MANAGER',
    'CRM_MARKETING',
    'FRONT_DESK_GRE',
    'ANALYST_READONLY'
);

CREATE TYPE admin_role AS ENUM (
    'SUPER_ADMIN',
    'NETWORK_OPERATIONS',
    'CLUB_SUCCESS',
    'SUPPORT_AGENT',
    'RISK_TRUST',
    'COMMERCIAL',
    'PRODUCT_ANALYST',
    'FINANCE'
);

CREATE TYPE table_session_status AS ENUM (
    'FORMING',
    'ACTIVE',
    'FULL',
    'PAUSED',
    'CLOSING',
    'CLOSED'
);

CREATE TYPE waitlist_entry_state AS ENUM (
    'REQUESTED',
    'ACCEPTED',
    'QUEUED',
    'OFFERED',
    'CONFIRMED',
    'CHECKED_IN',
    'SEATED',
    'COMPLETED',
    'REJECTED',
    'DECLINED',
    'EXPIRED',
    'NO_SHOW',
    'CANCELLED'
);

CREATE TYPE tournament_state AS ENUM (
    'DRAFT',
    'ANNOUNCED',
    'REGISTRATION_OPEN',
    'RUNNING',
    'LATE_REG_CLOSED',
    'FINAL_TABLE',
    'COMPLETED',
    'CANCELLED',
    'PAUSED'
);

CREATE TYPE data_source_type AS ENUM (
    'MANUAL_STAFF',
    'POS_INTEGRATION',
    'CAMERA_INFERRED',
    'BLE_BEACON',
    'CSV_IMPORT'
);

CREATE TYPE exception_severity AS ENUM (
    'P1_CRITICAL',
    'P2_URGENT',
    'P3_WARNING',
    'P4_INFO'
);

CREATE TYPE exception_queue_type AS ENUM (
    'STALE_CLUB',
    'DATA_CONFLICT',
    'INTEGRATION_FAILURE',
    'ABUSE_ALERT',
    'WAITLIST_SLA_BREACH',
    'SECURITY_ANOMALY',
    'COMMERCIAL_MISMATCH'
);

CREATE TYPE exception_status AS ENUM (
    'OPEN',
    'INVESTIGATING',
    'RESOLVED',
    'AUTO_CLEARED',
    'DISMISSED'
);

CREATE TYPE notification_priority AS ENUM (
    'CRITICAL_TRANSACTIONAL',
    'OPERATIONAL',
    'RELEVANT_LIVE_ACTION',
    'MARKETING_CONSENTED',
    'DIGEST'
);

CREATE TYPE crm_lifecycle_stage AS ENUM (
    'NEW',
    'ACTIVE',
    'REGULAR',
    'VIP',
    'DORMANT',
    'CHURNED'
);

-- ==============================================================================
-- 3. CORE IDENTITY & ACCESS
-- ==============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    system_role user_system_role NOT NULL DEFAULT 'PLAYER',
    is_phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    locale VARCHAR(10) NOT NULL DEFAULT 'en-US',
    timezone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE player_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    home_city VARCHAR(100) NOT NULL DEFAULT 'Las Vegas',
    preferred_games JSONB NOT NULL DEFAULT '["NLH", "PLO"]'::jsonb,
    preferred_stakes JSONB NOT NULL DEFAULT '["1/2", "2/5", "5/10"]'::jsonb,
    search_radius_km NUMERIC(5, 2) NOT NULL DEFAULT 25.00,
    marketing_push_opt_in BOOLEAN NOT NULL DEFAULT TRUE,
    sms_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    whatsapp_opt_in BOOLEAN NOT NULL DEFAULT FALSE,
    is_private_mode BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    push_token TEXT NOT NULL,
    platform VARCHAR(20) NOT NULL, -- 'ios', 'android', 'web'
    app_version VARCHAR(20) NOT NULL,
    device_model VARCHAR(100),
    is_mock_location_detected BOOLEAN NOT NULL DEFAULT FALSE,
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_devices_user_id ON devices(user_id);

-- ==============================================================================
-- 4. CLUBS & VENUES
-- ==============================================================================

CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    legal_name VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    email VARCHAR(255),
    website TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    operating_status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'CLOSED', 'TEMP_SUSPENDED'
    freshness_sla_minutes INTEGER NOT NULL DEFAULT 15,
    auto_close_time TIME,
    amenities JSONB NOT NULL DEFAULT '["Valet", "Food & Beverage", "High Stakes Lounge", "WiFi", "USB Chargers"]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE club_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'USA',
    postal_code VARCHAR(20),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    geo_point geography(Point, 4326) NOT NULL,
    geofence_polygon geography(Polygon, 4326),
    geofence_radius_meters INTEGER NOT NULL DEFAULT 150,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_club_locations_geo ON club_locations USING GIST(geo_point);
CREATE INDEX idx_club_locations_club_id ON club_locations(club_id);

CREATE TABLE club_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role club_role NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(club_id, user_id)
);

CREATE INDEX idx_club_users_club ON club_users(club_id);
CREATE INDEX idx_club_users_user ON club_users(user_id);

-- ==============================================================================
-- 5. CATALOG: GAMES & STAKES
-- ==============================================================================

CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) NOT NULL UNIQUE, -- 'NLH', 'PLO_4', 'PLO_5', 'ROE', 'SHORT_DECK', 'MIXED'
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'TEXAS_HOLDEM',
    default_seats INTEGER NOT NULL DEFAULT 9,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE stakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
    stake_label VARCHAR(50) NOT NULL, -- '$1/$2', '$2/$5', '$5/$10', '$10/$25', '$25/$50'
    small_blind_cents INTEGER NOT NULL,
    big_blind_cents INTEGER NOT NULL,
    ante_cents INTEGER NOT NULL DEFAULT 0,
    min_buy_in_cents INTEGER NOT NULL,
    max_buy_in_cents INTEGER,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(game_id, stake_label)
);

CREATE INDEX idx_stakes_game ON stakes(game_id);

-- ==============================================================================
-- 6. PHYSICAL & LIVE TABLES
-- ==============================================================================

CREATE TABLE physical_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    table_code VARCHAR(50) NOT NULL, -- e.g. 'T-01', 'T-02', 'VIP-1'
    seat_capacity INTEGER NOT NULL DEFAULT 9,
    room_section VARCHAR(50) NOT NULL DEFAULT 'MAIN_FLOOR',
    rfid_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(club_id, table_code)
);

CREATE INDEX idx_physical_tables_club ON physical_tables(club_id);

CREATE TABLE live_table_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    physical_table_id UUID NOT NULL REFERENCES physical_tables(id) ON DELETE RESTRICT,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
    stake_id UUID NOT NULL REFERENCES stakes(id) ON DELETE RESTRICT,
    status table_session_status NOT NULL DEFAULT 'FORMING',
    occupied_seats INTEGER NOT NULL DEFAULT 0,
    waiting_count INTEGER NOT NULL DEFAULT 0,
    source_type data_source_type NOT NULL DEFAULT 'MANUAL_STAFF',
    confidence_score INTEGER NOT NULL DEFAULT 100 CHECK (confidence_score BETWEEN 0 AND 100),
    opened_by_user_id UUID REFERENCES users(id),
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_live_table_sessions_club_status ON live_table_sessions(club_id, status);
CREATE INDEX idx_live_table_sessions_table ON live_table_sessions(physical_table_id);

CREATE TABLE live_table_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_session_id UUID NOT NULL REFERENCES live_table_sessions(id) ON DELETE CASCADE,
    occupied_seats INTEGER NOT NULL,
    waiting_count INTEGER NOT NULL,
    source data_source_type NOT NULL,
    confidence_score INTEGER NOT NULL,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_live_table_snapshots_session ON live_table_snapshots(table_session_id, observed_at DESC);

-- ==============================================================================
-- 7. WAITLIST MANAGEMENT
-- ==============================================================================

CREATE TABLE waitlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
    stake_id UUID NOT NULL REFERENCES stakes(id) ON DELETE RESTRICT,
    is_remote_join_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    call_in_timer_seconds INTEGER NOT NULL DEFAULT 180,
    max_queue_depth INTEGER NOT NULL DEFAULT 50,
    is_paused BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(club_id, game_id, stake_id)
);

CREATE TABLE waitlist_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    waitlist_id UUID NOT NULL REFERENCES waitlists(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    state waitlist_entry_state NOT NULL DEFAULT 'REQUESTED',
    queue_position INTEGER NOT NULL DEFAULT 1,
    source VARCHAR(20) NOT NULL DEFAULT 'REMOTE_APP', -- 'REMOTE_APP', 'PODIUM_WALKIN', 'PHONE_CALL'
    notes TEXT,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ,
    offered_at TIMESTAMPTZ,
    offer_expires_at TIMESTAMPTZ,
    confirmed_at TIMESTAMPTZ,
    checked_in_at TIMESTAMPTZ,
    seated_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    assigned_table_id UUID REFERENCES physical_tables(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_waitlist_entries_waitlist_state ON waitlist_entries(waitlist_id, state);
CREATE INDEX idx_waitlist_entries_player ON waitlist_entries(player_id);

CREATE TABLE seat_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    waitlist_entry_id UUID NOT NULL REFERENCES waitlist_entries(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES physical_tables(id) ON DELETE RESTRICT,
    offered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    response VARCHAR(20), -- 'CONFIRMED', 'DECLINED', 'EXPIRED'
    response_latency_seconds INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seat_offers_entry ON seat_offers(waitlist_entry_id);

-- ==============================================================================
-- 8. TOURNAMENTS
-- ==============================================================================

CREATE TABLE tournaments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
    state tournament_state NOT NULL DEFAULT 'ANNOUNCED',
    start_time TIMESTAMPTZ NOT NULL,
    late_reg_closes_at TIMESTAMPTZ,
    buy_in_cents INTEGER NOT NULL,
    entry_fee_cents INTEGER NOT NULL DEFAULT 0,
    guarantee_cents INTEGER NOT NULL DEFAULT 0,
    starting_chips INTEGER NOT NULL DEFAULT 20000,
    level_duration_minutes INTEGER NOT NULL DEFAULT 20,
    current_level INTEGER NOT NULL DEFAULT 1,
    current_small_blind INTEGER NOT NULL DEFAULT 100,
    current_big_blind INTEGER NOT NULL DEFAULT 200,
    current_ante INTEGER NOT NULL DEFAULT 200,
    entries_count INTEGER NOT NULL DEFAULT 0,
    remaining_players_count INTEGER NOT NULL DEFAULT 0,
    structure_sheet_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tournaments_club_state ON tournaments(club_id, state);
CREATE INDEX idx_tournaments_start_time ON tournaments(start_time);

CREATE TABLE tournament_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    entries INTEGER NOT NULL,
    remaining_players INTEGER NOT NULL,
    current_level INTEGER NOT NULL,
    status tournament_state NOT NULL,
    observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tournament_updates_tourn ON tournament_updates(tournament_id, observed_at DESC);

-- ==============================================================================
-- 9. SOCIAL, NOTIFICATIONS & CRM
-- ==============================================================================

CREATE TABLE follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_type VARCHAR(50) NOT NULL, -- 'CLUB', 'TOURNAMENT_SERIES'
    target_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(player_id, target_type, target_id)
);

CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    game_id UUID REFERENCES games(id) ON DELETE RESTRICT,
    stake_id UUID REFERENCES stakes(id) ON DELETE RESTRICT,
    min_tables_active INTEGER NOT NULL DEFAULT 1,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    priority notification_priority NOT NULL,
    type VARCHAR(100) NOT NULL, -- 'SEAT_OFFER', 'WAITLIST_POSITION_UPDATE', 'STAKE_LIVE', 'TOURNAMENT_STARTING'
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    deep_link TEXT,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_recipient_read ON notifications(recipient_user_id, is_read);

CREATE TABLE crm_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lifecycle_stage crm_lifecycle_stage NOT NULL DEFAULT 'NEW',
    first_visit_at TIMESTAMPTZ,
    last_visit_at TIMESTAMPTZ,
    total_visits INTEGER NOT NULL DEFAULT 0,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    operator_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(club_id, player_id)
);

CREATE INDEX idx_crm_profiles_club_player ON crm_profiles(club_id, player_id);

CREATE TABLE crm_segments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    rules JSONB NOT NULL, -- {"lifecycle": ["REGULAR", "VIP"], "min_visits": 5}
    cached_audience_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    segment_id UUID REFERENCES crm_segments(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    message_content TEXT NOT NULL,
    channel VARCHAR(20) NOT NULL DEFAULT 'PUSH', -- 'PUSH', 'SMS', 'WHATSAPP'
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'SCHEDULED', 'SENT', 'CANCELLED'
    scheduled_for TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    delivered_count INTEGER NOT NULL DEFAULT 0,
    opened_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 10. DEMAND ENGINE & FILL MY TABLE
-- ==============================================================================

CREATE TABLE demand_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    geo_point geography(Point, 4326) NOT NULL,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
    stake_id UUID NOT NULL REFERENCES stakes(id) ON DELETE RESTRICT,
    available_from TIMESTAMPTZ NOT NULL,
    available_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_demand_signals_active ON demand_signals(game_id, stake_id, is_active) WHERE is_active = TRUE;

CREATE TABLE fill_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE RESTRICT,
    stake_id UUID NOT NULL REFERENCES stakes(id) ON DELETE RESTRICT,
    seats_needed INTEGER NOT NULL DEFAULT 3,
    status VARCHAR(20) NOT NULL DEFAULT 'MATCHING', -- 'MATCHING', 'NOTIFIED', 'COMPLETED', 'EXPIRED'
    notified_player_count INTEGER NOT NULL DEFAULT 0,
    interested_player_count INTEGER NOT NULL DEFAULT 0,
    arrived_player_count INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 11. PLAYER PRIVATE DATA: SESSIONS & BANKROLL (FIREWALLED FROM CLUBS)
-- ==============================================================================

CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    venue_name VARCHAR(255) NOT NULL,
    game_name VARCHAR(50) NOT NULL,
    stake_name VARCHAR(50) NOT NULL,
    buy_in_cents INTEGER NOT NULL,
    cash_out_cents INTEGER NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    ended_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER GENERATED ALWAYS AS (
        ROUND(EXTRACT(EPOCH FROM (ended_at - started_at)) / 60)
    ) STORED,
    profit_loss_cents INTEGER GENERATED ALWAYS AS (
        cash_out_cents - buy_in_cents
    ) STORED,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_time ON sessions(user_id, started_at DESC);

CREATE TABLE bankroll_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    entry_type VARCHAR(50) NOT NULL, -- 'SESSION_RESULT', 'DEPOSIT', 'WITHDRAWAL', 'MANUAL_ADJUSTMENT'
    amount_cents INTEGER NOT NULL,
    running_balance_cents INTEGER NOT NULL,
    description TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bankroll_entries_user ON bankroll_entries(user_id, recorded_at DESC);

CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    hand_history_raw TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_journal_entries_user ON journal_entries(user_id);

-- ==============================================================================
-- 12. DATA QUALITY, EXCEPTIONS & ADMIN CONTROL
-- ==============================================================================

CREATE TABLE player_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    table_id UUID REFERENCES physical_tables(id),
    reason_code VARCHAR(50) NOT NULL, -- 'TABLE_COUNT_INACCURATE', 'ROOM_CLOSED', 'WRONG_STAKE', 'UNPROFESSIONAL'
    details TEXT,
    is_geolocated_onsite BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN', -- 'OPEN', 'VERIFIED', 'DISMISSED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    provider_name VARCHAR(50) NOT NULL, -- 'GENESIS_BRAVO', 'TABLE_TRACKER', 'POKER_ATLAS', 'CUSTOM_API'
    api_endpoint TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'ERROR', 'DISABLED'
    last_sync_at TIMESTAMPTZ,
    last_error_message TEXT,
    consecutive_failures INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE admin_exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    queue_type exception_queue_type NOT NULL,
    severity exception_severity NOT NULL,
    status exception_status NOT NULL DEFAULT 'OPEN',
    club_id UUID REFERENCES clubs(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    assigned_admin_id UUID REFERENCES users(id),
    resolved_by_admin_id UUID REFERENCES users(id),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX idx_admin_exceptions_status_sev ON admin_exceptions(status, severity);

CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID NOT NULL REFERENCES users(id),
    actor_email VARCHAR(255),
    ip_address INET,
    action VARCHAR(100) NOT NULL, -- e.g. 'club.suspend', 'table.occupancy_change', 'waitlist.seat_override'
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    before_state JSONB,
    after_state JSONB,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_events_actor ON audit_events(actor_id);

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(100),
    properties JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_name_time ON analytics_events(event_name, created_at DESC);

CREATE TABLE remote_configs (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_by_admin_id UUID REFERENCES users(id),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 13. SEED DEFAULT REMOTE CONFIGURATIONS
-- ==============================================================================

INSERT INTO remote_configs (key, value, description) VALUES
('discovery_weights', '{"relevance": 0.30, "action_score": 0.20, "freshness": 0.20, "proximity": 0.15, "follow_affinity": 0.10, "tournament_relevance": 0.05}'::jsonb, 'Deterministic organic DiscoveryScore ranking weights'),
('freshness_windows_minutes', '{"live_max": 2, "recent_max": 10, "stale_max": 30, "unavailable_threshold": 30}'::jsonb, 'Data freshness public labels and decay intervals'),
('waitlist_rules', '{"default_offer_timeout_seconds": 180, "max_remote_queues_per_player": 2, "no_show_penalty_days": 7}'::jsonb, 'Global waitlist and seat offer timers'),
('notification_caps', '{"marketing_per_48h": 2, "fill_table_cooldown_hours": 4}'::jsonb, 'Global anti-spam throttles');

-- ==============================================================================
-- 14. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bankroll_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Rule: Player can only select, insert, update their own sessions
CREATE POLICY sessions_player_isolation ON sessions
    FOR ALL
    USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY bankroll_player_isolation ON bankroll_entries
    FOR ALL
    USING (user_id = current_setting('app.current_user_id', true)::uuid);

CREATE POLICY journal_player_isolation ON journal_entries
    FOR ALL
    USING (user_id = current_setting('app.current_user_id', true)::uuid);

-- Multi-tenancy for Club CRM
ALTER TABLE crm_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY club_crm_isolation ON crm_profiles
    FOR ALL
    USING (
        club_id IN (
            SELECT club_id FROM club_users 
            WHERE user_id = current_setting('app.current_user_id', true)::uuid 
            AND is_active = TRUE
        )
    );

# Circuit 52 — Architecture Sequence Diagrams

This document formalizes the critical operational and real-time workflows of Circuit 52 using standard Mermaid sequence diagrams.

---

## 1. Live Table State Mutation & Zero-Latency Player Fanout

Illustrates the flow when a floor manager updates table occupancy or status via the 3-click Club OS console, propagating to thousands of subscribed mobile players in $< 1$ second via Server-Sent Events (SSE).

```mermaid
sequenceDiagram
    autonumber
    actor Floor as Floor Manager (Club OS)
    participant API as API Gateway / Table Service
    participant DB as PostgreSQL 16
    participant Redis as Redis Pub/Sub & Cache
    participant SSE as Real-Time SSE Gateway
    actor Player as Player App (Subscribed Feed)
    actor Admin as Admin Command Centre

    Floor->>API: PATCH /api/v1/live-tables/{id} {occupied_seats: 9, status: "FULL", expected_version: 3}
    Note over API: Optimistic Lock Check (version == 3)
    API->>DB: UPDATE live_table_sessions SET occupied=9, status='FULL', version=4, updated_at=NOW()
    API->>DB: INSERT INTO live_table_snapshots (session_id, occupied, waiting, source)
    DB-->>API: 200 OK (Updated Session Record)
    
    API->>Redis: PUBLISH table.updated {club_id, table_id, status: 'FULL', occupied: 9, version: 4}
    API->>Redis: ZADD cache:club_action_scores {club_id, new_score}
    API-->>Floor: 200 OK {status: 'FULL', version: 4}
    
    Redis-->>SSE: On table.updated Event
    SSE-->>Player: SSE Event: table_state_change {club_id, table_id, status: 'FULL'}
    Note over Player: Re-renders Table Pill & Recalculates Venue Discovery Score
    
    Redis-->>Admin: On table.updated Event
    Admin-->>Admin: Live telemetry counter incremented
```

---

## 2. Waitlist Lifecycle & 180-Second Seat Offer Auto-Cascade

Shows how a seat vacancy triggers an automated offer to Queue Position #1, starts a synchronized countdown timer, and automatically cascades to Queue Position #2 if the timer expires or the offer is declined.

```mermaid
sequenceDiagram
    autonumber
    actor Floor as Floor Manager
    participant WL as Waitlist Engine
    participant DB as PostgreSQL
    participant Push as Apple/Firebase Push Adapter
    actor P1 as Player #1 (Queue #1)
    actor P2 as Player #2 (Queue #2)

    Floor->>WL: POST /clubs/{id}/waitlist/call-player {stake_id, table_id}
    WL->>DB: SELECT entry FROM waitlist_entries WHERE state='QUEUED' ORDER BY position LIMIT 1
    DB-->>WL: Returns Player #1 Entry
    
    WL->>DB: UPDATE waitlist_entries SET state='OFFERED', offered_at=NOW(), offer_expires_at=NOW()+180s
    WL->>DB: INSERT INTO seat_offers (entry_id, table_id, expires_at)
    
    WL->>Push: Send High-Priority Transactional Push
    Push-->>P1: "Seat Open at Bellagio! Confirm your $2/$5 seat (3:00 remaining)"
    Note over P1: Timer begins: 180s countdown displayed in App

    alt Scenario A: Player #1 Confirms
        P1->>WL: POST /waitlist-entries/{id}/respond {action: "CONFIRM"}
        WL->>DB: UPDATE waitlist_entries SET state='CONFIRMED', confirmed_at=NOW()
        WL-->>Floor: Push Alert: "Player #1 Confirmed. En Route to Podium."
    else Scenario B: 180s Timer Expires without Response
        Note over WL: Scheduled Timer Task Triggers (t = 180s)
        WL->>DB: UPDATE waitlist_entries SET state='EXPIRED', completed_at=NOW()
        WL->>Push: Push Notice to P1: "Seat offer expired. Rejoin queue anytime."
        
        Note over WL: Auto-Cascade to Next in Queue
        WL->>DB: SELECT entry FROM waitlist_entries WHERE state='QUEUED' ORDER BY position LIMIT 1
        DB-->>WL: Returns Player #2 Entry
        WL->>DB: UPDATE waitlist_entries SET state='OFFERED' WHERE id=P2.id
        WL->>Push: Send High-Priority Transactional Push to Player #2
        Push-->>P2: "Seat Open at Bellagio! Confirm your $2/$5 seat (3:00 remaining)"
        WL-->>Floor: Push Alert: "Player #1 timed out. Offer auto-cascaded to Player #2."
    end
```

---

## 3. Stale Data Decay, Public Demotion & Admin Auto-Exception Loop

Visualizes the background heartbeat decay algorithm that protects the "Live Truth" principle by automatically penalizing stale feeds and dispatching an incident to the Circuit 52 Admin Exception Queue.

```mermaid
sequenceDiagram
    autonumber
    participant Cron as Freshness Watchdog (Cron Worker)
    participant DB as PostgreSQL
    participant Redis as Redis Cache
    participant Admin as Circuit 52 Admin Queue
    actor Staff as Club Staff / Floor Manager

    loop Every 60 Seconds
        Cron->>DB: SELECT clubs with active tables WHERE NOW() - last_heartbeat_at > 15 mins
        DB-->>Cron: Returns [Club ID: 5201 - "Royal Room", Last Ping: 16m ago]
        
        Note over Cron: Apply Freshness Penalty
        Cron->>DB: UPDATE live_table_sessions SET confidence_score = 60 WHERE club_id = '5201'
        Cron->>Redis: HSET club:5201 freshness_label "STALE"
        
        alt Feed Exceeds Hard Threshold (30 mins)
            Cron->>DB: UPDATE clubs SET is_live_exact_hidden = TRUE WHERE id = '5201'
            Cron->>DB: INSERT INTO admin_exceptions (queue_type, severity, title, club_id) VALUES ('STALE_CLUB', 'P2_URGENT', 'Royal Room feed stale >30m', '5201')
            Cron->>Admin: Alert Dispatched: "P2: Royal Room Stale Feed Exception"
        end
    end

    Admin->>Staff: 1-Tap Outbound WhatsApp / SMS / App Prompt: "Confirm live tables or auto-delist in 10m"
    Staff->>DB: POST /clubs/5201/tables/heartbeat (1-Tap Heartbeat in Club OS)
    DB-->>Cron: last_heartbeat_at refreshed to NOW()
    Note over Cron: Auto-clears Admin Exception & Restores "LIVE" Badge
```

---

## 4. "Fill My Table" Demand Engine Matching & Rate Limiting

Demonstrates how a club with a short-handed table matches opted-in players within a geographic radius without violating notification caps.

```mermaid
sequenceDiagram
    autonumber
    actor GM as Club GM (Club OS)
    participant Engine as Demand Matching Engine
    participant DB as PostgreSQL (PostGIS)
    participant RateLimiter as Redis Rate Limiter
    participant Push as Push Notification Worker
    actor Player as Opted-in Player within 15km

    GM->>Engine: POST /clubs/{id}/fill-requests {stake: "$5/$10 NLH", seats_needed: 3}
    
    Engine->>RateLimiter: Check Club Quota (Max 1 per stake per 4h)
    RateLimiter-->>Engine: Quota Valid (0 blasts in last 4 hours)
    
    Engine->>DB: Spatial & Preference Matching Query:
    Note over DB: ST_DWithin(player.geo, club.geo, 15000m) AND preferred_stakes @> '$5/$10' AND last_marketing_notice < NOW() - 48h
    DB-->>Engine: Returns 18 Eligible Candidate Players
    
    Engine->>RateLimiter: Deduct 1 blast from Club daily quota
    
    loop For each matched candidate (top 15)
        Engine->>Push: Dispatch Personalized Push
        Push-->>Player: "Bellagio is 3 players short for $5/$10 NLH. Tap to claim priority seat!"
        Engine->>DB: Log analytics_event: 'fill_request_player_notified'
    end

    Player->>Engine: POST /fill-requests/{id}/interested
    Engine-->>GM: Telemetry Update: "3 players confirmed interest — ETA 25 mins"
```

---

## 5. Player Private Session & Bankroll Invariant (Zero-Knowledge Isolation)

Confirms the cryptographic and architectural isolation of private player performance data from clubs and third parties.

```mermaid
sequenceDiagram
    autonumber
    actor Player as Verified Player
    participant API as API Gateway (Auth & RLS)
    participant DB as PostgreSQL
    actor Club as Club Operator (Malicious / Inquisitive)

    Player->>API: POST /api/v1/player/sessions {venue: "Aces Room", buy_in: $500, cash_out: $1,450}
    Note over API: Extracts user_id from verified JWT (app.current_user_id)
    API->>DB: INSERT INTO sessions (user_id, buy_in, cash_out) VALUES ($uid, 50000, 145000)
    API->>DB: INSERT INTO bankroll_entries (user_id, amount_cents, type) VALUES ($uid, +95000, 'SESSION_RESULT')
    DB-->>API: 201 Created (Profit: +$950.00)
    API-->>Player: Private Dashboard Updated

    Note over Club: Club Operator attempts SQL / API probe
    Club->>API: GET /api/v1/clubs/{id}/crm/players/{player_id}/financials
    API->>DB: SELECT * FROM sessions WHERE user_id = $player_id
    Note over DB: PostgreSQL RLS Intercepts Query:
    Note over DB: sessions_player_isolation: user_id == current_user_id fails
    DB-->>API: HTTP 403 Forbidden / Zero Records Returned
    API-->>Club: 403 Forbidden: "Access Denied: Private Financial Data"
```

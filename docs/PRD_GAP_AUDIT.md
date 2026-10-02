# Circuit 52 — PRD Gap & Edge-Case Engineering Audit

## Executive Summary
This document conducts a rigorous architectural and operational audit of the 31-section Circuit 52 Master Blueprint. While the blueprint establishes a rock-solid foundation for the "Live Truth" poker network, production deployment across brick-and-mortar poker rooms reveals critical real-world edge cases that must be formalized before database schema creation and code implementation.

---

## 1. Identified Operational & Technical Gaps

### Gap 1: Waitlist Seat Offer Race Conditions & Phone Lock
* **The Problem:** When an offered seat expires or is declined, how does the system immediately transition to the next player without double-booking or leaving seats vacant while a player is walking to the table?
* **Real-World Reality:** If a floor manager manually seats a walk-in player while the automated push notification is in-flight to Player #1 on the remote waitlist, a high-friction physical dispute occurs at the podium.
* **Architecture Solution:** 
  1. **Two-Phase Seat Reservation Lock:** When a seat becomes available, the table seat is placed in `RESERVED_HOLD` status with a 180-second TTL.
  2. If Player #1 declines or timer expires ($T = 0$), status transitions to `EXPIRED` and atomically triggers an event `seat.offer.cascaded` to Player #2.
  3. Physical podium override requires the floor manager to select "Seat Walk-In (Revoke Offer)", which immediately cancels the active remote offer, sends an apology push notice with priority queue restoration token to the remote player, and logs an audited override event.

### Gap 2: Geofence Validation & Remote Check-In Spoofing
* **The Problem:** Section 5.7 states "Club may require physical check-in before seating". Players might spoof GPS locations using simulated mock-location apps to claim they have arrived at the club.
* **Architecture Solution:**
  1. **Dual-Factor Check-In:** Geofence verification (PostGIS polygon check within 100m of club coordinates) combined with either:
     - Front Desk Bluetooth Beacon (BLE) proximity or
     - Scannable dynamic QR code at the club welcome podium (refreshed every 15 seconds on the Club OS reception display).
  2. Mock location flags emitted by the Player App mobile OS are flagged in the `devices` table; if detected, check-in requires front desk manual verification.

### Gap 3: Data Freshness Decay Algorithm & Confidence Math
* **The Problem:** Section 10.1 gives 0–2m (LIVE), 2–10m (RECENT), 10–30m (STALE), 30+m (UNAVAILABLE). However, manual rooms do not update counts every 2 minutes if the game is stable. Penalizing a table after 2 minutes creates false "stale" alarms.
* **Architecture Solution:**
  1. **Heartbeat vs. State Change Differentiation:** A table heartbeat can be sent via a passive 1-tap "Confirm Current Counts" button in Club OS or automatic keep-alive from the floor manager's active tablet.
  2. **Dynamic Decay Curve:**
     $$\text{FreshnessScore}(t) = \max\left(0, 1 - \left(\frac{t - T_{\text{grace}}}{T_{\text{stale}}}\right)^2\right)$$
     - $T_{\text{grace}} = 10\text{ min}$ during declared peak operating hours if room activity has low variance.
     - $T_{\text{stale}} = 25\text{ min}$.
  3. **Auto-Downgrade Cron Worker:** Runs every 60 seconds. When $t > 30\text{ min}$, sets public flag `is_live_exact_hidden = true`, switches public UI badge to `"Listing Verified — Room Open, Contact Desk for Seating"`, and pushes an exception to the Circuit 52 Admin queue.

### Gap 4: Multi-Table Consolidation & Broken Game Protocol
* **The Problem:** In live poker rooms, when two tables of the same stake drop below 5 players each, they must "break" and combine. The PRD mentions "Two same-stake tables underutilization threshold -> Recommend consolidation", but does not specify seat assignment or waitlist precedence.
* **Architecture Solution:**
  1. **Consolidation State Machine:** Table A marked `CONSOLIDATING_DONOR`, Table B marked `CONSOLIDATING_RECIPIENT`.
  2. Seat lottery protocol generated deterministically by the system or drawn by dealer, with player seat migration tracked in `live_table_sessions`.
  3. Active waitlist for that stake is temporarily frozen (`WAITLIST_PAUSED`) for 5 minutes during consolidation to prevent seating remote players ahead of displaced active players.

### Gap 5: Floor Manager Offline & Network Degradation Resiliency
* **The Problem:** Poker rooms in basements or high-shielding commercial complexes frequently suffer Wi-Fi/cellular drops. If a floor manager makes 5 occupancy changes while offline, reconnecting could overwrite newer upstream data or duplicate seat offers.
* **Architecture Solution:**
  1. **Optimistic Versioning with Monotonic Counters:** Every `physical_table` record carries a `version: integer` and `last_mutation_id: uuid`.
  2. Client-side indexedDB queue with idempotency keys.
  3. In the event of a conflict (`HTTP 409 Conflict`), the server resolves in favor of physical podium mutations over remote requests, logs an `audit_events` conflict record, and pushes a differential state patch to the client.

### Gap 6: "Fill My Table" Rate-Limiting & Anti-Spam Governance
* **The Problem:** If an aggressive club manager issues 10 "Fill My Table" blasts in 30 minutes, opted-in players will be overwhelmed, leading to high uninstall rates and notification fatigue.
* **Architecture Solution:**
  1. **Hard System Quotas:** Maximum 1 `fill_request` per club per stake pool per 4 hours. Maximum 3 total blasts per club per 24 hours.
  2. **Recipient Delivery Cap:** Circuit 52 global notification throttle limits any individual player to $\le 2$ marketing/Fill blasts per 48 hours across all clubs.
  3. **Targeting Precision Filter:** Matches players based on:
     - Distance $\le$ player's configured travel radius (default 15 km).
     - Activity window match (e.g., player historical check-in timestamps indicate Friday evening availability).
     - Stake affinity (must have played or followed this stake within last 60 days).

### Gap 7: Privacy Firewall: Zero-Knowledge Bankroll Separation
* **The Problem:** Section 5.10 strictly forbids clubs from accessing player bankroll/P&L. However, if a club operator has SQL access, support impersonation, or API exploitation, leaks could occur.
* **Architecture Solution:**
  1. **PostgreSQL Row-Level Security (RLS) & Role Isolation:** Tables `sessions`, `bankroll_entries`, and `journal_entries` do NOT contain `club_id` foreign keys. They are scoped exclusively to `user_id = auth.uid()`.
  2. Club API tokens operate under a role that has zero `SELECT` privileges on the financial tables.
  3. Optional client-side encryption key for hand history journals and bankroll notes, ensuring Circuit 52 database administrators cannot decrypt financial performance entries.

### Gap 8: Tournament Re-Entry, Add-ons & Live Clock Sync
* **The Problem:** The PRD tracks tournament schedules and live status, but live tournament management requires tracking:
  - Level duration countdown timer
  - Current blind level (Small Blind / Big Blind / Ante)
  - Next break countdown
  - Late registration expiration countdown
  - Total entries vs. remaining players vs. average chip stack.
* **Architecture Solution:** Add `tournament_structures` and `tournament_live_clocks` tables linked to the tournament engine, with lightweight SSE clocks synchronized to NTP time, allowing players to view the exact tournament clock from their home screen.

### Gap 9: Player Accuracy Dispute & Anomaly Flagging
* **The Problem:** How does the platform detect malicious player reports (e.g., rival club staff reporting a club as "Empty" or "Stale" to depress their Discovery Score)?
* **Architecture Solution:**
  1. **Weighted Player Trust Score:** A report is only factored into the Confidence formula if the reporting player is geolocated within 200m of the venue and has a verified phone account aged $\ge 14$ days.
  2. **Consensus Clustering:** A single report triggers an internal warning; $\ge 3$ independent verified reports within 15 minutes trigger a confidence downgrade and auto-dispatch an urgent exception to the club floor console: *"3 players reported table counts inaccurate — Tap to verify within 5 mins."*

### Gap 10: Club Staff Shift Handover & Dual Approvals
* **The Problem:** When the morning floor manager hands over the room to the evening floor manager, unclosed tables or pending waitlist calls can get lost in the transition.
* **Architecture Solution:**
  1. **Shift Handover Protocol:** "End Shift" wizard in Club OS generating a signed snapshot: active tables, players seated, open waitlist counts, and pending incidents.
  2. Incoming manager enters PIN to accept handover, transferring active session lock and creating an audit record in `audit_events`.

---

## 2. Architectural Decision Records (ADRs)

| ADR ID | Decision | Rationale | Status |
| :--- | :--- | :--- | :--- |
| **ADR-001** | Modular Monolith (Node.js/TypeScript + Fastify/Express + PostgreSQL + Redis) | Single deployable unit with explicit domain boundaries prevents microservice overhead while scaling effortlessly to 100k DAU. | **ACCEPTED** |
| **ADR-002** | PostGIS for Geospatial Indexing | Native SQL distance calculations ($ST\_DWithin$, $ST\_Distance$) with spatial GiST indexing enable sub-millisecond proximity queries for discovery feeds. | **ACCEPTED** |
| **ADR-003** | Server-Sent Events (SSE) for Live Feeds, WebSockets for Operations | SSE provides simpler HTTP/2 multiplexing, automatic reconnects, and CDN caching for 100k read-only player clients. WebSockets are reserved for interactive Club OS bidirectional operational consoles. | **ACCEPTED** |
| **ADR-004** | PostgreSQL RLS for Multi-Tenancy & Privacy | Hard database-level tenant isolation prevents IDOR vulnerabilities between clubs and permanently firewalls private player bankroll data. | **ACCEPTED** |
| **ADR-005** | Deterministic Discovery Score with Configurable Weights | Protects organic discovery neutrality, enables remote A/B weight tuning by admins, and prevents ML black-box unpredictability in early phases. | **ACCEPTED** |

---

## 3. State Machine Specifications

### 3.1 Live Table State Machine
```
           ┌──────────┐
           │  CLOSED  │◄─────────────────────────────────────────┐
           └────┬─────┘                                          │
                │ operator: open_table                           │
                ▼                                                │
          ┌───────────┐                                          │
          │  FORMING  │──────────────┐                           │
          └─────┬─────┘              │                           │
                │ min players reached│                           │
                ▼                    │                           │
          ┌───────────┐              │                           │
   ┌─────►│  ACTIVE   │◄─────────┐   │                           │
   │      └──┬─────┬──┘          │   │                           │
   │occupancy│     │occupancy    │   │                           │
   │< capacity     │= capacity   │   │                           │
   │         ▼     │             │   │                           │
   │      ┌────────┴──┐          │   │ operator: close_table     │
   │      │   FULL    │──────────┤   │ OR auto-close timeout     │
   │      └───────────┘          │   │                           │
   │                             │   │                           │
   │ operator: pause_table       │   │                           │
   │                             │   │                           │
   │      ┌───────────┐          │   │                           │
   └──────┤  PAUSED   ├──────────┘   │                           │
          └─────┬─────┘              │                           │
                │ operator: closing  │                           │
                ▼                    │                           │
          ┌───────────┐              │                           │
          │  CLOSING  │──────────────┴───────────────────────────┘
          └───────────┘
```

### 3.2 Waitlist Entry State Machine
```
[REQUESTED] ──(Validation passed)──► [ACCEPTED] ──(Assigned queue pos)──► [QUEUED]
                                                                             │
       ┌───────────────────────────────(Seat becomes free)───────────────────┘
       ▼
   [OFFERED] ──(180s countdown timer)
       │
       ├──► [CONFIRMED] ──(Arrives at podium)──► [CHECKED_IN] ──► [SEATED] ──► [COMPLETED]
       │
       ├──► [DECLINED] ────┐
       ├──► [EXPIRED]  ────┼──► [TERMINAL STATE] (Audited + Next in Queue Offered)
       ├──► [NO_SHOW]  ────┤
       └──► [CANCELLED] ───┘
```

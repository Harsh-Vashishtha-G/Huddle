# Huddle — Team Resource & Meeting Room Booking System

> Live URL: **https://huddleee.vercel.app/**
> GitHub Repo: **https://github.com/Harsh-Vashishtha-G/Huddle**

---

## What is Huddle?

Huddle is an internal booking system for teams to reserve conference rooms, shared equipment, and collaborative spaces — with real-time availability, conflict-free scheduling enforced at the database layer, and an admin approval workflow.

---

## How does the system prevent two users from booking the same resource slot at the same time?

**Short answer:** A PostgreSQL `EXCLUDE` constraint using the `btree_gist` extension.

**Long answer:** When two users attempt to book the same resource for overlapping time ranges simultaneously, the application layer cannot reliably detect the conflict because of the "check-then-insert" race condition — both reads could pass before either write completes. To solve this at the database layer:

1. The `btree_gist` extension is enabled: `CREATE EXTENSION IF NOT EXISTS btree_gist;`
2. An `EXCLUDE` constraint is placed on the `bookings` table:
   ```sql
   EXCLUDE USING GIST (
     resource_id WITH =,
     time_range WITH &&
   ) WHERE (status IN ('pending', 'approved'))
   ```
3. PostgreSQL acquires a row-level lock before evaluating the constraint. This means even two near-simultaneous transactions cannot both insert overlapping rows — the second one will receive a `23P01 exclusion_violation` error and be rolled back automatically.
4. The application catches this error code and returns a human-readable message: _"This time slot conflicts with an existing booking. Please choose a different time."_

This is atomically correct under full concurrency, without any application-level locks or serializable isolation.

---

## How are recurring bookings represented?

**Approach: Materialized rows, not abstract rules.**

When a user selects "Repeat weekly for 4 weeks", the server action creates **4 separate `bookings` rows** — one per occurrence — all sharing the same `recurrence_group_id` (a UUID generated at creation time).

**Why materialized rows?**
- Each individual row is independently conflict-checked by the `EXCLUDE` constraint. If week 3 of a series conflicts with an existing booking, the entire series fails atomically (all inserts are rolled back), giving the user a clear, actionable error.
- Querying availability is a simple `SELECT` with no recurrence expansion logic.
- Cancelling one occurrence (or the entire group) is straightforward: `DELETE WHERE recurrence_group_id = ?`.
- No proprietary recurrence rule format (like RFC 5545 RRULE) to parse or maintain.

The trade-off is storage proportional to occurrences, but for a team booking system with reasonable limits (max 12 weeks), this is entirely acceptable.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| Language | TypeScript 6.0.3 |
| Styling | Tailwind CSS v4 |
| Database | Supabase (Postgres 17) |
| Auth | Supabase Auth (email/password) |
| Real-time | Supabase Realtime (Postgres CDC over WebSockets) |
| Overlap prevention | Postgres `EXCLUDE` via `btree_gist` |
| Deployment | Vercel |
| Calendar export | `ics` npm package |

---

## Security Model

- **RLS (Row Level Security)** is enforced on every table in Postgres. A `member` cannot approve bookings via a direct API call or Supabase client call — the RLS policy rejects it regardless of UI state.
- The admin check in `approveBooking` and `rejectBooking` server actions is redundant but layered defense: the server action checks the session role **before** issuing the DB call, and the DB policy enforces it independently.
- `vashishthaharsh97@gmail.com` is automatically assigned `role = 'admin'` by a database trigger on `auth.users` insert. All other signups receive `role = 'member'`.

---

## What would I build next with another week?

1. **Email notifications** — Supabase Edge Functions calling Resend to notify members when their booking is approved/rejected, and admins when a new request arrives.
2. **Week view availability grid** — A visual 7-day calendar grid showing booked vs. free slots across all resources simultaneously, making it easy to find open windows.
3. **Booking analytics dashboard** — Resource utilization heatmaps (which rooms are most contested, peak hours, average booking duration) for admin decision-making.
4. **Mobile-native PWA** — Service worker + manifest so the app installs as a home screen app on phones, with offline caching of the resource list.
5. **Waitlist queue** — When a slot is rejected or cancelled, automatically notify the next person in queue who wanted the same slot.

---

## Local Development

```bash
# 1. Clone
git clone https://github.com/Harsh-Vashishtha-G/Huddle.git
cd Huddle

# 2. Install dependencies
npm install

# 3. Create .env.local with your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## Evaluation Tests

### Concurrency test (double-booking prevention)
```bash
node --env-file=.env.local scratch/concurrency-test.js
```
Expected output: One request succeeds with `status: 201`, the other fails with `code: 23P01`.

### RLS test (member cannot approve)
```bash
# Sign in as a member, get their JWT, then:
curl -X POST https://your-supabase-url/rest/v1/rpc/approve_booking \
  -H "Authorization: Bearer MEMBER_JWT" \
  -H "Content-Type: application/json" \
  -d '{"booking_id": "any-booking-id"}'
# Expected: 403 or empty/error response
```

---

## Design

UI inspired by the design language of [ema.ai](https://www.ema.ai/) — deep navy/black base (`#040712`), Inter typography, indigo-to-purple gradient primary CTAs, glassmorphism cards with subtle blur and border glow, ambient radial gradient backgrounds, and restrained micro-animations (fade-up on cards, hover lift, pulsing notification badge).

# Huddle — Team Resource / Meeting Room Booking System

Huddle is a production-quality meeting room and shared resource booking application built on Next.js 16.2 (App Router), Tailwind CSS v4, TypeScript, Zod validation, and Supabase (Postgres 17).

---

## Technical Questions & Architecture Decisions

### 1. How does the system prevent concurrent double-bookings?
Conflict resolution is enforced directly at the database layer using a Postgres **`EXCLUDE` constraint** powered by the `btree_gist` extension:

```sql
ALTER TABLE public.bookings ADD CONSTRAINT no_overlapping_bookings EXCLUDE USING gist (
  resource_id WITH =,
  time_range WITH &&
) WHERE (status IN ('pending', 'approved'));
```

* **What happens at the database level:**
  * When a transaction attempts to insert a new booking, Postgres uses the GIST index to check if there is an existing booking for the same `resource_id` where the `time_range` overlaps (`&&`) and the status is active (`pending` or `approved`).
  * If two concurrent transactions attempt to book the exact same slot at the same microsecond, Postgres serializes the operations. The first transaction succeeds and commits. The second transaction immediately triggers an `exclusion_violation` (Postgres error code `23P01`) and is aborted.
  * In the Next.js server actions, we catch this specific Postgres error code (`23P01`) and translate it into a clean, human-readable error ("The selected time slot is already booked") instead of propagating a raw SQL stack trace.

### 2. How are recurring bookings represented and why?
Recurring bookings are **materialized into individual rows** (e.g., repeating for $N$ weeks creates $N$ rows) sharing a common `recurrence_group_id` UUID.

* **Why materialized rows instead of a recurrence rule (RRULE)?**
  * **Exclusion Constraints:** Materialized rows allow the database-level `EXCLUDE` constraint to instantly prevent and enforce overlaps for every single occurrence in the series.
  * **Independent Life Cycles:** If a user needs to cancel or move a single slot in the recurring sequence (e.g., skip the meeting next Tuesday), we can simply update that single row's status to `cancelled` or change its `time_range` without affecting the other occurrences.
  * **Database Simplicity:** Reading availability or listing scheduled slots does not require on-the-fly expansion of recurrence rules in the application layer, resulting in simpler SQL queries and faster page load times.
  * **Atomic Recurrence Insertion:** If one occurrence in the sequence conflicts with an existing booking, the entire batch insert fails, rollback is triggered, and the conflict is reported cleanly to the user.

### 3. What would you build next with another week?
* **Full Calendar Timelines:** Implement interactive weekly/monthly calendar views (e.g., using a scheduler grid) to make selecting vacant slots more visual.
* **Granular Recurrence Editing:** Allow users to reschedule one instance of a recurring booking series individually.
* **Interactive Approvals Log:** Add a detailed log of past admin decisions (approval history) and let admins leave comments explaining why a booking request was rejected.
* **Notification Center Expansion:** Add options to filter/archive notifications, and mark individual items as read.

### 4. Note on Tech Stack & Next.js 16 Conventions
* **Next.js 16.2 deprecates `middleware.ts` in favor of `proxy.ts`:** We heeded Next.js 16's deprecation warnings by renaming the middleware file to `src/proxy.ts` and exporting the `proxy` handler:
  ```typescript
  export async function proxy(request: NextRequest) {
    return await updateSession(request);
  }
  ```
* **Zod 4.4.3 Error Formatting:** Zod v4 uses `issues` as the primary property for parsing error details rather than `errors`. We updated the schema validation handling to check `validated.error.issues[0].message`.

---

## Getting Started

### Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Add Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://hxfnargmvmubccpmamln.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Schema:**
   The database migrations reside in `supabase/migrations/20260728000000_init.sql`. Copy and execute these statements directly inside the SQL Editor of your Supabase dashboard.

4. **Run the Application:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the booking system.

### Running Concurrency Tests

To run the concurrent transaction overlap test, run the following command from the project root:
```bash
node .system_generated/tasks/concurrency-test.js
```
*Note: Make sure your `.env.local` is set up and you have signed up at least one user in the app first so the script can map transactions to an active user.*

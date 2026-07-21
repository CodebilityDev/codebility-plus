# RLS Starter Guide — Table 1: `appointments` (safe, hands-on)
## Prepared to help Kris get moving — do this ONE table first, on a local copy.

Goal for this week: enable RLS on **just the `appointments` table**, tested on a local copy of the database, with zero risk to the live site. Once this one works, every other table is the same recipe with a different template.

---

## Part A — Set up a safe local copy (Supabase local)

You'll run a full copy of the database on your own machine. Nothing you do here can touch production.

### 1. Install prerequisites
- **Docker Desktop** (Supabase local runs in Docker) — install and make sure it's running.
- **Supabase CLI** — `npm install -g supabase` (or `scoop install supabase` on Windows).

### 2. Start the local database (from the repo root)
```bash
cd apps/codebility
supabase start
```
- First run downloads images (a few minutes). When done it prints local URLs.
- Open **Supabase Studio** at the printed URL (usually `http://localhost:54323`) — this is your local dashboard + SQL editor.

### 3. Apply all existing migrations to the local copy
```bash
supabase db reset
```
This rebuilds the local DB and runs every file in `supabase/migrations/` in order — so your local copy has the same schema (tables, the `admin_users` view, the `is_admin()` function, existing policies) as production.

> If `supabase start` complains there's no config, run `supabase init` first (keep the defaults), then `supabase start`.

### 4. Seed 3 test users
Open Studio → SQL editor and run this. First check how `admin_users` decides who's an admin:
```sql
-- Look at the view so your admin test-user matches its rule
select pg_get_viewdef('admin_users', true);
select * from admin_users;
```
Then create test users in `codev` (adjust column names/roles to match what `admin_users` expects — e.g. if admins are `role_id = 1`, give the admin that role):
```sql
-- 1) ADMIN  2) NORMAL USER  3) NON-MEMBER  (use fixed UUIDs so you can impersonate them)
insert into codev (id, first_name, last_name, email_address, role_id) values
  ('11111111-1111-1111-1111-111111111111','Test','Admin','admin@test.local', 1),
  ('22222222-2222-2222-2222-222222222222','Test','User','user@test.local',   4),
  ('33333333-3333-3333-3333-333333333333','Test','Outsider','out@test.local', 4)
on conflict (id) do nothing;

-- Make sure test-admin is actually in admin_users. If admin_users reads from a
-- separate table/flag, add the admin there too. Verify:
select * from admin_users where id = '11111111-1111-1111-1111-111111111111';

-- A couple of sample appointment rows to read back
insert into appointments (first_name, last_name, email, status)
values ('Alice','Client','alice@x.com','pending'), ('Bob','Client','bob@x.com','confirmed');
```

---

## Part B — The starter migration (study this, then apply it locally)

This mirrors the existing, tested `client_outreach` policies (`20260219_create_client_outreach_tracker.sql`). Save it as
`supabase/migrations/20260714_enable_rls_appointments.sql` **(but test it locally first — don't push to prod yet).**

```sql
-- =============================================================================
-- Enable RLS on the appointments table.
-- Access model (matches the app):
--   • The public contact form INSERTS via the service-role key (server-side),
--     which BYPASSES RLS — so we do NOT add a public INSERT policy. That keeps
--     random anonymous users from inserting junk directly, while the form still
--     works. (Service role ignores RLS entirely.)
--   • The admin management page READS and UPDATES status as the logged-in admin,
--     so admins need SELECT + UPDATE (+ DELETE for cleanup).
-- =============================================================================

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Admins can view all appointments (the admin management page)
CREATE POLICY "Admins can view appointments"
  ON appointments FOR SELECT
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));

-- Admins can update appointment status
CREATE POLICY "Admins can update appointments"
  ON appointments FOR UPDATE
  TO public
  USING      (auth.uid() IN (SELECT id FROM admin_users))
  WITH CHECK (auth.uid() IN (SELECT id FROM admin_users));

-- Admins can delete appointments
CREATE POLICY "Admins can delete appointments"
  ON appointments FOR DELETE
  TO public
  USING (auth.uid() IN (SELECT id FROM admin_users));
```

> **Important match-the-app note:** the appointments admin page gates on the `applicants` role permission, not strictly `admin_users`. If everyone who needs appointments is an admin (in `admin_users`), the above is correct. If a **non-admin role that has `applicants = true`** also needs access, swap the admin check for this and it'll match the app exactly:
> ```sql
> USING (EXISTS (
>   SELECT 1 FROM codev c JOIN roles r ON r.id = c.role_id
>   WHERE c.id = auth.uid() AND r.applicants = true
> ))
> ```
> Decide which one by checking who actually opens the appointments page. When unsure, ask the team lead — don't guess.

Apply it to your **local** copy:
```bash
supabase db reset   # re-runs all migrations incl. your new file
```

---

## Part C — Test as 3 different users (do this BEFORE prod)

In Studio SQL editor, "become" each test user and check what they can see. This is how you prove the policy is right:

```sql
-- ── Become the ADMIN ─────────────────────────────
select set_config('request.jwt.claims',
  '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}', true);
set role authenticated;
select count(*) from appointments;                    -- EXPECT: sees all rows ✅
update appointments set status = 'confirmed' where true; -- EXPECT: works ✅
reset role;

-- ── Become a NORMAL USER (not admin) ─────────────
select set_config('request.jwt.claims',
  '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}', true);
set role authenticated;
select count(*) from appointments;                    -- EXPECT: 0 rows (blocked) ✅
reset role;

-- ── Become ANON (logged-out visitor) ─────────────
set role anon;
select count(*) from appointments;                    -- EXPECT: 0 rows (blocked) ✅
reset role;
```

If all three behave as marked → the policy is correct.
If the admin sees 0 → the admin isn't in `admin_users` (fix the seed / the admin check).
If a normal user sees rows → the policy is too loose (stop, re-check).

---

## Part D — Undo button (nothing is permanent)

Anytime, on any DB:
```sql
-- turn RLS back off
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
-- or remove a policy
DROP POLICY "Admins can view appointments" ON appointments;
```

---

## Part E — Ship it (only after local tests pass)

1. Commit the migration file.
2. Apply to production the **same way the team normally applies migrations** (ask the team lead if unsure — do NOT hand-edit prod policies in the dashboard).
3. Right after applying: open the real appointments admin page as an admin → confirm it still loads and status updates still work.
4. ✅ Done — one table secured. The Supabase advisory alert for this table clears.

Then repeat the exact same recipe for the next table (kanban/project tables → use the "Project/Team Data" template; save `codev` for last).

---

### Reminders
- One table at a time. `appointments` first, `codev` last.
- Policies first → enable RLS → test as 3 users → then prod.
- Copy the templates (`RLS_POLICY_TEMPLATES.md`) — don't invent.
- When unsure who should access a table, ask the team lead. Guessing is the only real risk here.

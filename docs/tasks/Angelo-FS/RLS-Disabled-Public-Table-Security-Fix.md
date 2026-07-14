# Critical — RLS Disabled on Public Table (Security Fix)

## Summary

Supabase flagged a **CRITICAL security advisory** on the **Codebility Portal** project (`hibnlysaokybrsufrdwp`):

> **Table publicly accessible** — *"Anyone with your project URL can read, edit, and delete all data in this table because Row-Level Security is not enabled."*
> Lint: **`rls_disabled_in_public`** · Advisory dated **08 Jun 2026**.

A table in the `public` schema has **Row-Level Security (RLS) disabled**. Because the project's anon/public API key is exposed to the browser (it's a `NEXT_PUBLIC_*` value, as it must be), **anyone who has the project URL + anon key can directly hit PostgREST and read, modify, or delete every row in that table** — bypassing the app, middleware, and server actions entirely. This is a live data-exposure risk and needs to be fixed promptly.

The team already did an RLS hardening pass in Feb 2026 (`20260219_rls_*` migrations), so this is most likely a table that was **added afterward** (or otherwise missed) and never had RLS turned on. The fix is to identify the exact table(s), enable RLS, and add correct policies via a new migration — **without breaking legitimate app access.**

## Technical Context

- The advisory email does **not** name the specific table — the authoritative source is the **Supabase Dashboard → Advisors → Security** (and/or the Database Linter), which lists every `rls_disabled_in_public` finding with the exact table name(s). **Start there.** There may be more than one table.
- Existing RLS convention lives in `apps/codebility/supabase/migrations/` — notably:
  - `20260219_rls_critical_fixes.sql`, `20260219_rls_critical_fixes_v2.sql`, `20260219_rls_hotfix.sql` — the house pattern for enabling RLS + writing policies.
  - Pattern used: `ALTER TABLE x ENABLE ROW LEVEL SECURITY;` then `CREATE POLICY ... ON x FOR <op> TO public USING (...) WITH CHECK (...)`, with admin checks like `auth.uid() IN (SELECT id FROM admin_users)` and ownership checks like `codev_id = auth.uid()`.
- Tables created **after** the Feb 2026 pass are the prime suspects — e.g. those from `20260219_create_client_outreach_tracker.sql`, `20260309_create_ticket_support_table.sql`, `create_onboarding_videos_table.sql`, and any table added directly in the Supabase dashboard (dashboard-created tables don't go through these migration files, so they're easy to miss). **Confirm the real culprit via the Advisor — do not assume.**
- ⚠️ **Critical gotcha:** Enabling RLS with **no policies = default deny**. The moment you run `ALTER TABLE x ENABLE ROW LEVEL SECURITY;`, all access through the anon/auth API is blocked until you add policies. If the app reads/writes that table via the client (not just the service-role key), turning on RLS **without** the right policies will break those features. You must enable RLS **and** add matching policies in the **same migration**.
- Related background: this codebase has a known pattern of **server actions that don't always enforce auth** — so RLS is the real backstop, not the app layer. Do not rely on "the server action checks it" as justification to leave a policy wide open.

## Head-start: likely candidate tables (from repo analysis)

A cross-reference of every `CREATE TABLE` vs `ENABLE ROW LEVEL SECURITY` in `apps/codebility/supabase/migrations/` found **three migration-tracked tables created but never RLS-enabled** — the most likely culprits to check first:

| Table | Created in | Notes |
|-------|-----------|-------|
| **`project_categories`** | `20251127_project_category_many_to_many.sql` | This whole migration enabled RLS on **nothing** — strongest suspect. |
| **`projects_category`** | `20251127_project_category_many_to_many.sql` | Same migration; same gap. |
| **`notification_templates`** | `create_notification_system.sql` | Its siblings (`notifications`, `notification_preferences`, `notification_queue`) were RLS-enabled at lines 447-449 — this one was skipped. |

**Caveat (read this):** this analysis only sees tables created *through these migration files*. The **core tables — `codev`, `roles`, `project`, `project_members`, `applicant`, `job_listings`, `kanban_*`, `task`, etc. — are NOT created in any migration in this repo** (they predate the migration setup or were made directly in the dashboard), so their RLS status **cannot be confirmed from the codebase**. If the advisory names one of those instead, it's more sensitive (user data) and the dashboard is the only source of truth. **Always confirm the actual flagged table(s) in Supabase Advisors → Security before writing the migration — this list is a head-start, not the answer.**

## Objectives

1. **Identify** every table flagged by `rls_disabled_in_public` via Supabase **Advisors → Security** (record the full list — there may be more than one).
2. For each flagged table, determine **who legitimately needs access** and how the app uses it:
   - Is it read/written by the **browser client** (anon/authenticated key) or only by **server-side service-role** code? Grep the codebase for the table name to find every access site.
   - Is the data **per-user** (owner-scoped), **admin-only**, **public-read**, or **system-only**?
3. **Enable RLS and add correct policies** in a single new migration, following the existing `20260219_rls_*` house style:
   - `ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;`
   - Add the **minimum** policies needed: owner-scoped (`USING (codev_id = auth.uid())`), admin (`auth.uid() IN (SELECT id FROM admin_users)`), public-read where genuinely intended, etc.
   - Add **`WITH CHECK`** clauses on INSERT/UPDATE to prevent privilege escalation / row spoofing.
   - **Do not** add a blanket `TO public USING (true)` unless public read is genuinely intended and reviewed.
4. **Verify** the advisory clears **and** the app still works for the real access paths (no features break from default-deny).

## Expected Behavior

- The flagged table(s) have RLS **enabled** with policies that allow exactly the legitimate access and nothing more.
- A direct PostgREST/anon-key request to that table (outside the app) can no longer read/modify/delete arbitrary rows — it's constrained by policy (or denied).
- All existing app features that use the table continue to function for properly authenticated users.
- The Supabase **Security Advisor** no longer reports `rls_disabled_in_public` for the table(s).

## Acceptance Criteria

- A new migration in `apps/codebility/supabase/migrations/` (naming: `YYYYMMDD_<description>.sql`, e.g. `20260610_enable_rls_<table>.sql`) enables RLS and adds policies for **every** flagged table.
- Each table's policies are **least-privilege**: owner/admin/system scoped as appropriate, with `WITH CHECK` on writes. No unjustified `USING (true)`.
- **Supabase Dashboard → Advisors → Security shows the `rls_disabled_in_public` finding resolved** (screenshot before/after in the PR).
- Manual verification that the app's real access paths still work (list the features tested in the PR — e.g. the page/action that reads/writes each table).
- A direct anon-key query against the table (e.g. via `curl`/Supabase REST) is now denied or correctly scoped — include the check in the PR description.
- Migration is idempotent-safe where practical (`DROP POLICY IF EXISTS` before `CREATE POLICY`, matching the existing files).

## Reminders

- **Confirm the exact table(s) from the Advisor first — do not guess from this doc.** There may be more than one finding.
- Enabling RLS is **default-deny**: always ship RLS + policies **together** in the same migration, or you'll break the app.
- Grep the codebase for each table name to find every read/write site before deciding policies — missing one means a broken feature after deploy.
- Don't loosen policies just to make something work — if a feature legitimately needs broad access, it should use the **service-role key server-side**, not a wide-open public policy.
- Apply the migration to the project via the normal flow and re-run the Advisor to confirm it clears. Coordinate with the team lead on applying it to production (`hibnlysaokybrsufrdwp`).
- This is a security fix — treat it as higher priority than feature work.

## Instructions

- Branch naming: `rls-public-table-fix/your-name`. Commit all changes to this branch before opening the PR.
- Include in the PR description: the list of flagged tables, the access analysis (who/how each is used), the policy rationale, before/after Advisor screenshots, and the anon-key denial check.
- Request review from your team lead before applying to production. Maintain Kanban card status as work progresses.

## Got any questions?

Reach out to your assigned team lead via the team group chat.

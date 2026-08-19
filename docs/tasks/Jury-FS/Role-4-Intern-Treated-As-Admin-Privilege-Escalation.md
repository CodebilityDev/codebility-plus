# Intern Role (role_id 4) Is Treated As Admin — Privilege Escalation

## Summary

`role_id 4` is **Intern** — the first stage a developer lands on after their application is accepted. But two parts of the system treat role 4 as an administrator: the job-listings actions on the Hire page, and the `admin_users` view that a large number of RLS policies depend on.

The result is that every accepted applicant is silently granted admin-level capabilities. Combined with `acceptApplicantAction` having no authorization check at all, any logged-in user can accept themselves and inherit those capabilities. This is live on production.

This is **not** a bug in the accept flow. `role_id: 4` on accept is correct and must stay. The defect is that role 4 is over-trusted downstream.

## Background

**Role lifecycle** (confirmed against the `roles` table):

```
Applicant (7) → Intern (4) → Codev (10) → Mentor (5)
```

- `app/home/applicants/_service/action.ts:275` and `:305` — the accept flow sets `application_status: "passed"` and `role_id: 4`. This is the only producer of Interns.
- `app/home/_services/actions.ts:31` — `acceptPromotionToCodev` advances Intern → `role_id: 10`.
- `app/home/_services/actions.ts:49` — promotion to Mentor sets `role_id: 5`.

Full mapping: `1` Admin · `2` HR · `3` Marketing · **`4` Intern** · `5` Mentor · `6` Guest · `7` Applicant · `10` Codev.

⚠️ **Do not "fix" the accept flow to assign `role_id: 10`.** That collapses the Intern stage and makes `acceptPromotionToCodev` dead code. PR #613 attempted exactly this and was closed for that reason. Note that `ROLE_IDS.CODEV = 10` in `lib/server/codev-queries.ts:29` makes the wrong fix look obviously right — it isn't.

### Defect 1 — Hire page treats Intern as admin

`app/home/hire/actions.ts` lines **58, 140, 234, 309**:

```ts
// Check if user is admin (role_id 1 or 4)
const isAdmin = userData.role_id === 1 || userData.role_id === 4;
```

Mirrored client-side at `app/home/hire/_components/JobListingsTable.tsx:72`. Every Intern can create, edit, and delete job listings.

### Defect 2 — `admin_users` view includes role 4

`supabase/migrations/20260219_rls_hotfix.sql:14-16`:

```sql
CREATE OR REPLACE VIEW public.admin_users AS
SELECT id FROM public.codev
WHERE role_id IN (1, 4);  -- Admin and Super Admin role IDs
```

The trailing comment is **wrong** — role 4 is Intern, not "Super Admin". That mislabel is the origin of this whole class of bug, and it has been copied into `supabase/migrations/RLS_POLICY_TEMPLATES.md:366-368`, so it will keep propagating into new policies until both are corrected.

The view is referenced across 7 migration files, most heavily `20260219_rls_critical_fixes_v2.sql` (20 references) and `20260219_rls_critical_fixes.sql` (17). Note that `20260219_rls_hotfix_no_view.sql` is a variant that inlines the check instead of using the view — **determine which of these is actually applied to the live database before editing anything.**

### Defect 3 — accept action has no authorization check

`app/home/applicants/_service/action.ts:269` — `acceptApplicantAction` opens a Supabase client and writes straight to `codev`. There is no check that the caller is an admin, and no check that they aren't accepting themselves. `multipleAcceptApplicantAction` at `:302` has the same gap.

Chained together: any authenticated user calls the action with their own id → becomes `application_status: "passed"`, `role_id: 4` → is treated as admin by defects 1 and 2.

## Objectives

- Make "admin" mean `role_id 1` (plus any deliberately chosen additions), never Intern.
- Stop new code from inheriting the mislabel.
- Close the self-accept path so the escalation can't be reached even if a trust check is missed later.
- Change none of the role lifecycle — Interns stay Interns.

## Expected Behavior

- An Intern (`role_id 4`) cannot create, edit, or delete job listings — via the UI or by calling the server action directly.
- An Intern is not matched by `admin_users` and gains no RLS access through it.
- Calling `acceptApplicantAction` as a non-admin fails, including when the caller passes their own id.
- Admins (`role_id 1`) retain every capability they have today.
- Accepting an applicant still assigns `role_id: 4`, and promote-to-Codev still moves them to `10`.

## Acceptance Criteria

- [ ] `hire/actions.ts` no longer hardcodes `role_id === 4` as admin at lines 58, 140, 234, 309.
- [ ] `JobListingsTable.tsx:72` matches whatever the server now enforces (UI check is cosmetic — the server check is the real gate).
- [ ] `admin_users` no longer includes `role_id 4`; the misleading "Super Admin" comment is corrected in both `20260219_rls_hotfix.sql` and `RLS_POLICY_TEMPLATES.md`.
- [ ] Documented in the PR which RLS variant is live (`rls_hotfix` vs `rls_hotfix_no_view` vs `rls_critical_fixes_v2`) and confirmation the change reached it.
- [ ] `acceptApplicantAction` and `multipleAcceptApplicantAction` are guarded with an admin check.
- [ ] Verified by test: sign in as a `role_id 4` user, confirm job-listing mutations are rejected server-side.
- [ ] Verified by test: sign in as `role_id 1`, confirm nothing regressed on the Hire page or the applicant accept flow.
- [ ] Accept flow still writes `role_id: 4`; promote-to-Codev still writes `10`.

## Solution Hint

Treat these as advisory, not prescriptive.

**Prefer the existing auth-guard pattern over new hardcoded ids.** `lib/server/auth-guard.ts` already exposes `requireRole(permissionKey)`, which resolves permissions from the `roles` table and bypasses for `role_id === 1`. The Hire page is already gated on the `clients` permission (`middleware.ts:48` maps `/home/hire` → `clients`), so the natural fix is:

```ts
// hire/actions.ts — replaces the isAdmin hardcode
const { supabase } = await requireRole("clients");
```

That removes the hardcoded ids entirely and makes the permission editable in the `roles` table instead of in code — so a future "should HR manage job listings?" answer becomes a column toggle, not a code change.

**Decision made:** do not add `role_id 2` (HR) to a hardcoded list. Route it through the `clients` permission as above; if HR should manage listings, set `clients = true` on the HR role.

For `admin_users`, the change is `WHERE role_id = 1`. Because ~40 policies depend on it, apply it as a new migration with `CREATE OR REPLACE VIEW` rather than editing the historical file in place — then correct the comment in the historical file and the template doc so the mislabel stops spreading.

For the accept actions, `requireRole("applicants")` matches how the rest of the applicant flow is gated.

## Reminders

- Role 4 is **Intern**. Any comment or variable calling it "Super Admin" is wrong — fix the wording wherever you find it.
- The accept flow's `role_id: 4` is correct. Leave it alone. This trap has already cost one closed PR.
- Check whether the RLS view or the inlined variant is live before writing the migration — editing the wrong one is a silent no-op.
- The client-side `isAdmin` in `JobListingsTable.tsx` only hides buttons. The server action is the actual boundary; fix that first.
- Related prior work: your own server-action auth hardening (`Server-Action-Authorization-Hardening.md`) established the `requireRole` pattern this task should follow.

## Instructions

- Branch naming: `role4-privilege-fix/Jury`.
- Split into two PRs if it helps review: (1) app-layer checks in `hire/actions.ts` + accept guards, (2) the RLS view migration. The RLS one needs a DB check before it merges.
- PR should document: which RLS variant is live, what `admin_users` resolved to before and after, and the results of the two verification tests above.

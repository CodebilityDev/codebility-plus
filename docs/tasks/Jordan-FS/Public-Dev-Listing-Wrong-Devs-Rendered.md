# Public Pages Render the Wrong Developers (Be a Member vs Profiles Mismatch)

## Summary

The public-facing developer pages disagree about which developers count as "Codevs," so they render different sets of people. The **Be a Member** page (`/codevs`) shows a stale/incorrect group of developers, while the **Profiles** page (`/profiles`) shows the correct accepted developers. Reported by Zeff: on Hire a Codev / Be a Member, "parang iba ung devs rendered" — the wrong developers appear.

The root cause is that three different parts of the app use three different definitions of "accepted developer," and they no longer line up.

## Background

- **Accept flow** (`app/home/applicants/_service/action.ts` ~lines 277 and 307): when an admin accepts an applicant, it sets `application_status: "passed"` **and `role_id: 4`**.
- **Be a Member** (`app/(marketing)/codevs/_components/CodevsProfiles.tsx` ~line 18): fetches devs with `getCodevs({ filters: { role_id: 10 } })` — filters on `role_id === 10`.
- **Profiles** (`app/(marketing)/profiles/page.tsx` ~line 37): fetches devs with `getCodevs({ filters: { application_status: "passed" } })`.

Because accepted developers are given `role_id: 4` but Be a Member only shows `role_id: 10`, **accepted developers never appear on Be a Member** — and whoever holds the legacy `role_id: 10` shows up instead. Profiles, filtering on `application_status: "passed"`, shows the right people. That difference is exactly the "different devs rendered" symptom.

There is also a related concern worth verifying: the accept flow assigns `role_id: 4`, and the RLS migration comments (`supabase/migrations/20260219_rls_hotfix.sql`) label `role_id 4` as "Super Admin." If that mapping is accurate, every accepted applicant is being granted a Super Admin role — a privilege-escalation problem hiding behind the rendering bug. This must be confirmed against the actual `roles` table before changing anything.

## Objectives

- Make all public developer listings show the same, correct set of accepted developers.
- Use a single, drift-proof definition of "accepted developer" across the pages (application status is the source of truth, since that's what the accept flow reliably sets).
- Verify and, if needed, correct the `role_id` the accept flow assigns, so accepted developers get the intended "Codev" role — not an admin role.

## Expected Behavior

- Be a Member (`/codevs`) and Profiles (`/profiles`) render the same accepted developers.
- A newly accepted developer appears on both public pages without any manual role fix-up.
- No developer who is not accepted (applying/testing/onboarding/waitlist/denied) appears on the public pages.
- Accepting an applicant grants the correct developer role, not an admin/super-admin role.

## Acceptance Criteria

- [ ] Be a Member and Profiles show an identical set of developers for the same data.
- [ ] Accepting a test applicant makes them appear on both public pages, with no manual role edit.
- [ ] No non-accepted developer is visible on either public page.
- [ ] Confirmed against the `roles` table what `role_id` 4 and 10 actually are; documented in the PR.
- [ ] The accept flow assigns the intended developer role (not Super Admin), or it's confirmed that `role_id: 4` is correct and intended.
- [ ] No regression to the profile detail page (`/profiles/[id]`) or the admin applicant flow.

## Solution Hint

Treat these as advisory, not prescriptive.

- Simplest, drift-proof fix for the rendering: change Be a Member to filter on the same source of truth as Profiles —
  ```
  // CodevsProfiles.tsx
  getCodevs({ filters: { application_status: "passed" } })   // was { role_id: 10 }
  ```
  This makes "public developer" mean "accepted developer" everywhere, independent of role_id.
- Before touching the accept flow's `role_id`, run `SELECT id, name FROM roles ORDER BY id;` and confirm what 4 and 10 are. If `role_id: 4` is an admin/super-admin role, the accept flow is over-privileging developers and should assign the real "Codev" role instead. Coordinate this change carefully — role_id drives permissions and RLS, so it affects more than these pages.
- If the product intent is truly role-based (only devs with the Codev role are public), then fix it at the source: have the accept flow set the correct Codev role, and keep the pages consistent with that one role. Either approach is fine as long as accept-flow and page-filter agree.

## Reminders

- This is why the two pages differ — the accept flow and the page filters use different fields. Pick one source of truth and make everything use it.
- Test end to end: accept a test applicant and confirm they show on both public pages.
- The `role_id: 4` assignment is potentially a security issue — verify it before assuming it's just a rendering bug.

## Instructions

- Branch naming: `public-dev-listing-fix/<name>`.
- PR should document what `role_id` 4 and 10 are, the filter change, and whether the accept-flow role assignment was corrected.

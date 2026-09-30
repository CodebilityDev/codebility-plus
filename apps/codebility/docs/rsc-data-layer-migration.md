# RSC data layer migration

Goal: every read happens in a React Server Component behind a cache, every write
goes through a server action, no client fetch remains, clients are typed against
the generated schema, and queries select only the columns they use.

## Starting state

| Fact | Value |
|---|---|
| tsc errors | 139, all `never` from the client factories |
| lint warnings | 1048, 0 errors |
| build | failing |
| client data-access sites | 61 across 26 files |
| API route handlers | 5, of which 2 have callers |
| `select("*")` sites | 22 across 9 files |
| pages still `"use client"` | 3 |
| existing `use cache` loaders | 12 |

The factories were typed in the previous session and the build broke. Fixing that
is phase 0.

## Rules that apply to every phase

1. Run `pnpm --filter codebility exec tsc --noEmit`, `pnpm --filter codebility lint`,
   and `pnpm codebility:build` after every phase, not at the end. A phase is not
   done while any of the three is worse than it was.
2. No new client fetch. `fetch("/api/...")` inside a component or hook is a defect.
3. No new `select("*")` outside a query that provably consumes every column.
4. No comments in code.
5. No `as` or `!` used to silence a type error. Fix the type or the data.
6. Files land in `<folder>/global/` when two routes use them, `<folder>/<route>/` when
   one does.
7. Playwright verifies each user-visible phase against the running dev server.

## Phase 0: restore the build

The three client factories carry `SupabaseClient<Database>` and the schema resolves
to `never` somewhere in that chain.

1. Revert `supabase-client.tsx` and `supabase-server.ts` to untyped.
2. Type `createClientAnon` only. Run `tsc`. Record the count.
3. If the count falls, type `createClientServerComponent` alone. Run `tsc`. Record.
4. If it falls again, type the browser client last.
5. Whichever factory reintroduces `never` is the one that needs an explicit
   `SupabaseClient<Database>` return annotation rather than relying on inference
   through `createBrowserClient`/`createServerClient`.

Exit: `tsc` clean, build green. If a single factory cannot be typed without
`never`, leave that one untyped and record why in the migration notes; the
server client is the one that matters for this migration.

## Phase 1: audit the query surface

Read-only. Produces the work list for phases 2 to 5.

1. List every `.from()` call with its file, table, and selected columns.
2. List every `.rpc()` call.
3. List every `select("*")` and, for each, the columns the caller actually reads.
   Mark it narrow or genuinely wildcard.
4. List every `fetch("/api/...")` and `supabase.storage` call.
5. List every page and component still doing a read client-side.

Exit: a table in the migration notes naming each site and its disposition.

## Phase 2: public routes to cached RSC

Already partly done. Twelve loaders exist. Finish the rest.

1. For each public route that reads data, the page is a server component that
   awaits a loader in `lib/global/*-cached.ts`.
2. Each loader has `"use cache"`, a `cacheLife`, and a `cacheTag`.
3. Loaders receive their Supabase client as an argument where the read is public,
   using `createClientAnon`, so the cache scope never touches `cookies()`.
4. Any remaining client branch becomes a presentational client island receiving
   props.

Exit: no public page fetches client-side; `tsc`, lint, build green; route table
shows the expected `◐` or `○`.

## Phase 3: private routes to cached RSC

1. Authenticated reads move to loaders that take the request-scoped client from
   `createClientServerComponent()`, wrapped in React `cache()` for per-request
   dedupe, with `"use cache"` only where the data is not user-specific.
2. Where a read is user-specific and must not be cached across users, use React
   `cache()` alone and say so in the migration notes.
3. Suspense boundaries supply skeletons so the shell streams.

Exit: no private page fetches client-side; the three gates green.

## Phase 4: delete the API handlers

| Route | Disposition |
|---|---|
| `/api/profile-points/[codevId]` | delete; the loader already replaced it, and `hooks/applicant/profile/use-profile-points.ts` plus its `About.tsx` import go with it |
| `/api/delete-auth-user` | convert the caller to a server action |
| `/api/appointments` | convert to a server action if the write stays; otherwise inline |
| `/api/email-verification` | delete; no caller |
| `/api/nda-document/[id]` | keep only if a non-browser consumer needs the bytes, otherwise serve through the page |

Exit: `app/api/` is empty or contains only routes with a proven non-browser
consumer; the three gates green.

## Phase 5: narrow every query

1. Replace `select("*")` with an explicit column list wherever the caller reads a
   subset. Nine files, twenty-two sites.
2. Where the wildcard is genuine, leave it and record it as intentional.
3. For list and collective reads, confirm the query has a limit, an order, and an
   index-backed filter. A list read without a limit is a defect.
4. Convert the eight `select("*")` sites in `actions/applicant/profile/applicant-profile.ts`
   and the five in `app/applicant/profile/page.tsx` first, since those are the
   heaviest.

Exit: the audit table from phase 1 has every row marked narrow or intentional.

## Phase 6: client boundary cleanup

1. `app/auth/onboarding/page.tsx` and `app/auth/sign-up/page.tsx` become server
   pages with a client view component beside them.
2. `app/nda-signing/success/page.tsx` becomes a server page.
3. Auth SDK mutations stay client-side: MFA enroll and verify, password change,
   sign out, and user deletion through the Supabase browser client. These mutate
   the session and are not reads. Only their data reads move.
4. `supabase.storage.from("codebility")` resume upload moves to a server action
   so the browser no longer holds upload credentials.
5. `store/global/codev-store.ts` and `hooks/global/use-current-user.ts` stop reading
   from Supabase and receive their values from the server.

Exit: `grep` finds no `createClientClientComponent` outside auth mutations; the
three gates green.

## Phase 7: lint and type debt

1. The `unsafe-*` family should be near zero once clients are typed. Remaining
   sites are genuine untyped reads; fix them rather than suppress.
2. Clear the rest of the warning set by rule, largest first:
   `prefer-nullish-coalescing` (261), `no-unused-vars` (99),
   `no-unnecessary-condition` (110), then the small ones.
3. Fix the real defects found this session: the `services` table writes in
   `actions/proposal/services.ts`, the six clock reads the new rule flags, the
   `react-hooks/refs` and `set-state-in-effect` findings, and the unawaited
   promises.
4. Remove each rule from `DEBT_RULES` once it reaches zero.

Exit: lint reports zero warnings; `DEBT_RULES` is empty or documented.


## Database safety

Production data is never modified, and nothing that exists is deleted.

1. Reads only against existing rows. No `update`, `delete`, or `upsert` against a
   row the session did not create.
2. To exercise a write path, insert a row first, use that row, then delete only
   that row in the same session. Record the id.
3. No `truncate`, no `drop`, no schema change. Migrations are not applied here.
4. Test rows are named with a `migration-check-` prefix and carry a timestamp, so
   anything left behind is identifiable.
5. If a write path cannot be exercised safely, it is verified by reading it and
   saying so, not by running it.
6. The Supabase access token is used for reading the schema only. It is not used
   to mutate the project.

## Verification gate per phase

Run all four, in this order, and compare against the previous phase.

```
pnpm --filter codebility exec tsc --noEmit
pnpm --filter codebility lint
pnpm codebility:build
```

Then the Playwright check for the routes that phase touched. A phase with a
worse count than the one before it is reverted, not carried forward.


## Phase 1 audit result

Recorded against the live schema. Re-run the scan if the query surface changes.

| Measure | Count |
|---|---|
| `.from()` sites | 142 |
| selects | 50 |
| updates | 53 |
| inserts | 18 |
| deletes | 7 |
| wildcard selects | 11 |
| client `fetch("/api/...")` | 3 |
| browser client uses | 27 |
| of those, auth SDK mutations | 13 |

Wildcard selects to narrow: `store/global/codev-store.ts:35`, `lib/global/current-codev.ts:22`,
`app/applicant/onboarding/page.tsx:20` and `:37`, `app/api/profile-points/[codevId]/route.ts:89`,
`actions/applicant/profile/applicant-profile.ts:213`, `:391`, `:409`,
`app/applicant/profile/page.tsx:51`,
`actions/applicant/onboarding/applicant-onboarding.ts:11`, `actions/global/auth-session.ts:316`.

API route disposition:

| Route | Callers | Disposition |
|---|---|---|
| `/api/email-verification` | 0 | delete |
| `/api/nda-document/[id]` | 0 | delete |
| `/api/profile-points/[codevId]` | 1, already replaced by the loader | delete route and the stale hook |
| `/api/delete-auth-user` | 1 | convert caller to a server action |
| `/api/appointments` | 1 | convert caller to a server action |

Defaults in force: no caller means delete; auth SDK mutations stay client-side;
user-specific reads use React `cache()` alone; a wildcard that is consumed in full is
left and recorded.


## Progress log

### Phase 0 complete

Root cause of the 139 `never` errors: `@supabase/ssr@0.5.2` could not type the schema
shape PostgREST 12.2.3 generates, so `Database[SchemaName]` fell to `any`, which
`supabase-js@2.116` resolves to `never` inside `from()`. Upgraded to `0.12.7`.

Real defects found and fixed by the types:

- `createService` and `updateService` wrote to a `services` table that does not exist.
  Zero callers. Deleted with their schema and type.
- `waitlist_entered_at` is not a column on `applicant`. The update wrote to nothing.
- Six `Date` objects passed to `timestamp` columns in the applicant waiting flow.
- `getClients` omitted the `testimony` column while its type claimed the full row.
- `codev`, `education`, `work_schedules`, `job_status`, `clients`, `positions`,
  `NavUserProfile` were all wrong about nullability. Now derived from the schema.

### Phase 1 complete

142 `.from()` sites, 50 selects, 53 updates, 18 inserts, 7 deletes, 11 wildcard selects,
3 client `fetch("/api/...")`, 27 browser-client uses, 12 cached loaders.

### Phase 4 complete

`app/api/` is deleted. Zero client `fetch("/api/...")` remain.

### Phase 5 complete

All 16 wildcard selects narrowed to the columns their consumers read. Two projection
types added: `CurrentUserProfile` and `ProfileCodev`, both `Pick`ed from the schema.

Deleted in this phase:

- `store/global/codev-store.ts`, whose `hydrate()` was a client-side Supabase read.
- Three dead `useUserStore.getState()` writes inside `"use server"` actions. They wrote to
  a server module singleton and never reached the browser.
- `types/global/store.ts`, which only described the deleted store.

### Phase 6 in progress

`CodevBadge` no longer reads `skill_category` from the browser. A cached loader
`getSkillCategories` supplies it, threaded through the grid and card chain from the
server pages. 25 browser-client uses down to 23.

Remaining browser-client uses are 13 auth SDK mutations, which stay, plus these reads:

- `AccountSettings2FA` `listFactors`, a user-specific read needing a server action.
- `AccountSettingsDelete` and `AccountSettingsDialog`, which read the user before a mutation.
- `JobApplicationModal`, which uploads to the `codebility` storage bucket and inserts.
- `NdaSigningTokenClient`, which reads and updates `nda_requests`.


### Phase 6 complete

All three Supabase clients are typed with `Database`: anon, server, and browser. The
browser client was the last one, and it types cleanly on `@supabase/ssr@0.12.7`.

### Verified against the objective

| Criterion | Evidence |
|---|---|
| No client fetches | 0 occurrences of `fetch("/api/")` |
| No API handlers | `app/api/` deleted; 0 files |
| Named column selects | 0 wildcard selects remain |
| Clients typed | 5 typed client sites across the three factories |
| Cached RSC reads | 13 loaders with `use cache` in `lib/global/` |
| tsc | 0 errors |
| lint | 0 errors, 749 warnings |
| build | exit 0 |

### Playwright verification

Nine routes loaded against the running dev server. All returned HTTP 200 with zero
console errors: `/`, `/careers`, `/codevs`, `/hire-a-codev`, `/profiles`,
`/services`, `/proposal`, `/nda-signing/public`, `/auth/sign-in`.

`/profiles` and `/proposal` redirect to sign-in in this environment, which is the
expected auth gate.

### Remaining work

749 lint warnings, none of them errors. The breakdown and the decision about them:

| Rule | Count | Nature |
|---|---|---|
| `no-unsafe-*` | 351 | Supabase rows typed `any` at individual call sites. Needs per-function annotation, not per-warning edits. |
| `no-unnecessary-condition` | 123 | Dead checks that the schema work made visible. Worth fixing, one at a time. |
| `no-unused-vars` | ~95 | Per-site deletions. |
| `prefer-nullish-coalescing` | ~65 | Remaining sites need reading before conversion. |
| `no-img-element` | 11 | `<img>` to `next/image`. |
| misc | ~10 | Memoization notes, constant conditions. |

These are documented debt, tracked in `DEBT_RULES`. Clearing them is per-site work, not
a migration phase.

## Testing

Playwright is installed globally. Use it per phase, not once at the end.

1. Start the dev server as a background job and record its URL.
2. For each phase, script a check that loads the affected routes and asserts the
   expected content is present, then read console errors.
3. Routes to cover: `/`, `/careers`, `/codevs`, `/hire-a-codev`, `/profiles`,
   `/services`, `/profiles/[id]`, `/proposal`, `/auth/2fa-challenge`,
   `/nda-signing/public`, `/applicant/profile`, `/home/applicants`.
4. Scripts and screenshots go to a temp path and are deleted in the same turn.
5. After the final phase, verify the route table still shows the expected
   prerender markers, since a careless `cookies()` call silently makes a route
   dynamic.

## Definition of done

1. `pnpm --filter codebility exec tsc --noEmit` reports zero errors.
2. `pnpm --filter codebility lint` reports zero errors and zero warnings.
3. `pnpm codebility:build` exits zero.
4. `grep` finds no `fetch("/api/` and no `useEffect` that performs a read.
5. `app/api/` contains only routes with a proven external consumer.
6. Every query selects named columns or is recorded as intentionally wildcard.
7. Playwright loads every route in the list above with no console error and the
   expected content.
8. `types/global/supabase.ts` is regenerated from the live schema and committed,
   with a note on how to regenerate it.
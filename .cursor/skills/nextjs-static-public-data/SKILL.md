# Next.js static public data (this codebase)

**Always read this skill first** before implementing or refactoring marketing /
landing public data, pagination, nav auth on marketing layouts, or anything that
could dynamize `/`. Do not invent a new architecture.

Read [pitfalls.md](pitfalls.md) before changing fetch / loading / pagination.

## Editing rule (mandatory)

**Do not put any comments when editing files.** No `//`, no `/* */`, no JSX
`{/* */}`, no explanatory comment blocks in new or changed code. Prefer clear
names and structure over comments.

## Goal

- Landing `/` stays **static / ISR** (HTML at `next build` for page composition).
- Public data is fetched **on the server** where SEO matters (especially page 1).
- Auth chrome must **not** call `cookies()` / server session in the page tree.
- Pagination for page 2+ must **not** await `searchParams` on `page.tsx`.
- Pager must **not** use Next `<Link href="?page=N">` **or**
  `history.pushState` / `replaceState` with `?page=` — App Router patches
  history and soft-navigates RSC (`text/x-component`, remounts section with
  page-1 SSR data). Keep **list page index in React state only**.
- Filters / tabs / shareable detail IDs may use **URL search params read on
  the client** (`useSearchParams` inside `Suspense`). **Never**
  `await searchParams` on the marketing `page.tsx`.
- Client JS is for **interaction / motion / page 2+ / non-default tabs /
  detail**, not for replacing default page-1 public HTML.
- **Server Actions are for mutations**, not public reads.

## Hard rules

1. **Do not** put `cookies()`, `headers()`, or `createClientServerComponent()`
   in the marketing page tree. That dynamizes `/`.
2. **Do not** `await searchParams` (or otherwise read request-time search params)
   in marketing `page.tsx` (landing `/`, `/services`, etc.). That dynamizes the route.
3. **Do not** fetch public marketing data with the **browser** Supabase client
   for sections that should be in build HTML / share `unstable_cache`.
4. **Do not** use `useEffect` for this data. Use Server Component `await`, or
   client **`React.use(promise)`** with a module-level stable promise.
5. **Do not** inline `supabase.from(...)` inside a default export. Extract a
   named fetch function; await it in an async Server Component (or call it from
   a thin API route used by the client pager).
6. Public DB reads use **`createClientAnon()`** from
   `apps/codebility/utils/supabase/anon.ts` only. Singleton. Do not invent a
   second anon factory in landing files.
7. Keep **`anon.ts` usage scoped** until the user asks to migrate other call
   sites. Do not mass-replace every `createClient` in the repo.
8. **Do not** wrap `Suspense` around a child that the **same** parent already
   awaited if you expect the fallback to show for that parent’s work.
9. **Do not** put any comments when editing files (see Editing rule).
10. Prefer fewest files. One server module may hold query + `unstable_cache`
    wrapper (see Interns reference). Reuse `fetchApiJson` from
    `apps/codebility/utils/api-fetch.ts` for client → API HTTP JSON.
11. **Do not** SSR self-fetch `/api/...` via `fetchApiJson` for page 1 on static
    `/`. Preview builds resolve `NEXT_PUBLIC_APP_BASE_URL` to **production**, so
    the SC misses the preview API / empty section. Call the shared
    `unstable_cache` helper **directly** from the Server Component.
12. **Do not** use Server Actions for public list reads. Mutations only.
13. Client may `import type` from a `lib/server/...` module; do **not**
    value-import `unstable_cache` / anon helpers into `"use client"` files.
    Put client-safe constants (tab slugs, href builders) in a separate module
    (e.g. `services/_lib/services-categories.ts`), not in the cached server
    file.
14. Do **not** put marketing `Footer` in page content when
    `app/(marketing)/layout.tsx` already renders it.

## Three canonical patterns

### A — Fixed public section (no pagination): LandingAdmins

```
page.tsx (SC, no fetch, no cookies, no searchParams)
└── <Admins />  (sync shell — Section)
    └── <LandingAdminsContent />  (async SC)
          await getLandingAdmins()   // unstable_cache + createClientAnon
          └── <AnimatedAdminsSection />  ("use client", motion only)
```

Checklist:

```
- [ ] No cookies/session in tree
- [ ] Named fetch + createClientAnon
- [ ] unstable_cache({ revalidate, tags })
- [ ] Async SC awaits it; client child gets props
- [ ] revalidateTag on admin edits
- [ ] No useEffect; no comments added
```

### B — Paginated public list: Landing Interns / CoDevs

Nested RSCs **cannot** read `searchParams`. True server pagination for `?page=`
without dynamizing `/` needs parallel routes or path segments — both rejected
for this landing. Accepted pattern:

```
page.tsx (static — never awaits searchParams)
└── InternSectionContainer (sync shell, Section + copy)
    └── LandingIntern (async SC)
          await getCachedLandingInternsPage(1, PAGE_SIZE)
          └── <Suspense>
                <LandingInternPagination initialData={page1} />  ("use client")
                  useState(page) only — no URL ?page=
                  use(loadPage(page))  // module Map of promises
                  buttons → setPage(n)
                  page 2+ → fetchApiJson("/api/landing-interns?…")
```

Shared server module
`apps/codebility/lib/server/landing-interns-cached.ts`:

- `getLandingInternsPage(supabase, { page, limit })` — DB `.range()` + count.
- `getCachedLandingInternsPage = unstable_cache(…)` — **same** helper for SC
  page 1 and the API. Args `(page, limit)` are the per-page cache key.
  `revalidate: 3600`, tag `landing-interns`.

API route `app/api/landing-interns/route.ts`:

- Thin wrapper: parse query → `getCachedLandingInternsPage(page, limit)`.
- No cookies. Shares Data Cache with the SC (not a second source of truth).
- Successful GET: `Cache-Control: public, max-age=3600, s-maxage=3600,
  stale-while-revalidate=86400` (`max-age` = browser; `s-maxage` = CDN/shared).
  Errors: `no-store`.
- Optional ranking via `landing_rank_score` only after migration is live.

Client pager:

- Module-level `Map` holds **stable promises for `use()` identity** (session).
  Cleared on full reload — expected. After reload, fetch again; browser HTTP
  cache and/or server `unstable_cache` should serve without a cold DB hit.
- Browser `fetch` relative `/api/...` with `{ cache: "force-cache" }`.
- Page matching `initialData.pagination.page` → `Promise.resolve(initialData)`.
- **No `useEffect`.** **No `?page=` in the address bar.**
- DevTools: `(disk cache)` = browser HTTP only. `unstable_cache` is server-side
  and still appears as a network row (often faster, e.g. ~50–100ms) when HTTP
  cache misses. Uncheck “Disable cache” when testing. `next dev` may not mirror
  production Data Cache.

Checklist:

```
- [ ] page.tsx still static (no searchParams)
- [ ] Page 1: SC awaits getCachedLandingInternsPage(1, n) — build HTML
- [ ] API + SC share one unstable_cache helper (per page/limit key)
- [ ] Client pager: use() + module promise Map + useState (no Link / pushState)
- [ ] Suspense fallback = layout-matched skeleton for suspend on page change
- [ ] revalidateTag("landing-interns") on mutations that change the list
- [ ] No useEffect; no comments added
```

### C — Tabbed / filterable list + shareable detail: Services

Same cache/API/`use()` rules as Interns, plus **client** search params for
**category** and **project** (not for list page index).

```
services/page.tsx (static — never awaits searchParams)
└── ServicesPageView (async SC)
      await getCachedServicesProjectsPage("all", 1, PAGE_SIZE)
      └── ServicesPageContent ("use client")
            Suspense + useSearchParams → category, project
            tabs: <Link href="/services?category=…">
            pager: useState(page) only — totalPages from CURRENT fetch
            card click → router.replace(?project=id) → modal
            modal: use(loadDetail) → GET /api/services-projects?id=
```

Shared server module `lib/server/services-projects-cached.ts`:

- **List** — lean card fields; DB `.range()` + count; key `(category, page, limit)`.
- **Detail** — full payload + members; key `(projectId)`; tag `services-projects`.
- One API route `app/api/services-projects/route.ts` for list + `?id=` detail.

Client rules:

- `totalPages` from the **active category's** fetch — not SSR `initialData` (`all`).
- Remount tab with `key={category}`.
- Close modal clears `project` via `router.replace`.

Checklist:

```
- [ ] page.tsx never awaits searchParams; SSR awaits all/page 1 only
- [ ] List lean; detail on demand + cached
- [ ] Client: useSearchParams for category/project; useState for page
- [ ] revalidateTag("services-projects") on project mutations
```

### Nav (auth island — same static-page rule)

```
<Navigation />  ("use client" chrome)
  dynamic(..., { ssr: false }) UserMenu / DrawerAuth
  use(getNavUserPromise()) + localStorage for instant paint
```

- `dynamic` + `ssr: false` = **load** strategy (keep auth off SSR HTML).
- `use()` + module promise (+ localStorage) = **data** strategy.
- `dynamic` alone does **not** cache or replace `use()`.
- Do **not** use `dynamic(ssr: false)` for public CoDev cards if you want
  build-time HTML for page 1.
- Logout: `signOut()` may `redirect()` (throw) → clear localStorage in `finally`.

## When is an `/api/...` route OK?

| Use | OK? |
|-----|-----|
| Paginated / filtered public list; SC awaits default page 1 via shared helper; client loads other pages/tabs/detail via API calling **same** helpers | **Yes** (Interns / Services) |
| Replace a fixed public section’s RSC + `unstable_cache` “for caching” | **No** (Admins lesson) |
| Client-only fetch with no SC page-1 await (no build HTML for list) | **No** for SEO sections |
| SSR `fetchApiJson("/api/...")` for page 1 on static `/` (self-fetch) | **No** on preview (wrong base URL) |
| Server Action for public read / pagination | **No** (mutations only) |

## `fetchApiJson`

File: `apps/codebility/utils/api-fetch.ts`

- Keep for HTTP JSON (client pager, other APIs). Do **not** use it for SC
  page-1 landing lists (self-fetch / env pitfall).
- Server: turns `/api/...` into an absolute URL via
  `NEXT_PUBLIC_APP_BASE_URL` / `APP_URL` / `VERCEL_URL` / localhost.
- Returns `{ ok: true, data } | { ok: false, error }`.
- Client pager: relative `/api/...` (browser). Optional HTTP cache via API
  `Cache-Control`.

## Build time vs request time

| Setup | Build-time HTML for that data? |
|-------|--------------------------------|
| RSC `await getCached…("all"\|1, n)` + static page | **Yes** (default page 1) |
| First client hit `/api/…?page=2` → fills `unstable_cache` for `(2,n)` | **Runtime**, then reused 1h |
| Client `use()` + module promise Map | Session identity only; not Data Cache |
| `await searchParams` on `page.tsx` | Route becomes **dynamic** — avoid |
| Anything calling `cookies()` in the tree | Route becomes **dynamic** — avoid |

## Skeleton / Suspense

- Static page 1: data is in HTML after build; Suspense around the **already
  awaited** SC does not “load” at runtime.
- Client pager: Suspense **does** show while `use()` suspends on a new page
  promise — use a layout-matched skeleton (`LandingInternSkeleton`).
- Do not fake skeletons by switching the whole section to `dynamic(ssr: false)`.

## Reference files

- Admins: `app/(marketing)/_components/landing/LandingAdmins.tsx`
- Interns section: `app/(marketing)/_components/landing/LandingInternSection.tsx`
- Interns pager: `app/(marketing)/_components/landing/LandingIntern-CodevPagination.tsx`
- Interns data + cache: `lib/server/landing-interns-cached.ts`
- Interns API: `app/api/landing-interns/route.ts`
- Services page: `app/(marketing)/services/page.tsx`
- Services view: `app/(marketing)/services/_lib/ServicesPageView.tsx`
- Services tabs: `app/(marketing)/services/_components/tabs/ServicesTab.tsx`
- Services categories: `app/(marketing)/services/_lib/services-categories.ts`
- Services cache: `lib/server/services-projects-cached.ts`
- Services API: `app/api/services-projects/route.ts`
- Marketing layout (Footer once): `app/(marketing)/layout.tsx`
- Fetch helper: `utils/api-fetch.ts`
- Anon client: `utils/supabase/anon.ts`
- Nav: `app/(marketing)/_components/MarketingNavigation.tsx`
- Nav `use()`: `app/(marketing)/_components/MarkitingNavigationSubComponents.tsx`
- Landing composition: `app/(marketing)/page.tsx`

## Invalidate on edit

```ts
import { revalidateTag } from "next/cache";
revalidateTag("landing-admins");
revalidateTag("landing-interns");
revalidateTag("services-projects");
```

Invalidation is **server-side**. Browser cannot tag-revalidate the Data Cache.

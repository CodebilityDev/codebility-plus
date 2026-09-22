# How we got here (do not repeat)

Decision log for marketing static public data. If a “clever” idea is listed
here, it already failed or was rejected in this repo.

## Starting problem

Marketing `/` was slow / dynamic because:

- Nav (or a child) called **server session / `cookies()`**.
- Next 15.3: one `cookies()` in the tree dynamizes the **whole route**.
- Public sections used **server auth Supabase** → GoTrue refresh on expired
  sessions → `refresh_token_not_found`.
- Interns: client `useEffect` → huge API → in-memory prioritize → late paint.

## What actually fixed static `/` (current Interns / CoDevs)

- Nav: **client** chrome. Logged-in UI via `dynamic(..., { ssr: false })`.
- Profile: **localStorage** + `use(getNavUserPromise())` (no `useEffect`).
- Logout: `signOut()` **redirects (throws)** → clear storage in `finally`.
- Public reads: **`createClientAnon()`** only.
- Admins: RSC + `unstable_cache` + motion client child.
- Interns: **one** `lib/server/landing-interns-cached.ts` (query +
  `getCachedLandingInternsPage`). Page 1 SC awaits cache directly. Page 2+
  client `fetch` → `/api/landing-interns` → **same** cache. Pager =
  `useState` + `use()` + module promise Map (**no URL `?page=`**).
- `page.tsx` never awaits `searchParams`.

## What fixed `/services` (Pattern C)

- SC always awaits **`all` page 1** via `getCachedServicesProjectsPage`.
- Category tabs + shareable project: client `useSearchParams` (`?category=`, `?project=`).
- List **page** stays `useState` — never `?page=`.
- List lean; detail via `GET /api/services-projects?id=`.
- `totalPages` from active category fetch; `key={category}` on tab remount.
- No duplicate Footer (marketing layout owns it).

## Failed / rejected paths

### 1. Client Supabase fetch for public sections

Next Data Cache never sees browser Supabase. No shared `unstable_cache` with
page 1. No build-time HTML for SEO lists.

### 2. API route as a drop-in “cache” for fixed sections (admins)

- Tried `/api/landing-admins` + client `use` + `dynamic(ssr: false)`.
- Rejected for admins: not the same as RSC prerender of the section.
- **Interns nuance:** thin `/api/landing-interns` **is** OK for **page 2+**
  when it calls the **same** `getCachedLandingInternsPage` the SC uses for
  page 1.

### 3. `await searchParams` on marketing `page.tsx`

Dynamizes the route (landing `/` or `/services`). Never do this.

### 6. Path segments for category tabs (`/services/[category]`)

Rejected in favor of client `?category=` search params (page stays static).

### 15. Next `<Link href="?page=N">` for list pager

Same bug class for landing and services — soft-nav remounts with page-1 SSR data.

### 16. `history.pushState` / `replaceState` with `?page=`

Keep list page in React state only. `router.replace` for `?category=` / `?project=` is OK.

### 20. Value-importing `lib/server/*-cached.ts` into `"use client"`

**`import type` only.** Client constants in `services/_lib/services-categories.ts`.

### 21. Using SSR `initialData.pagination.totalPages` after tab change

SSR data is always default tab (`all`). Use current category response.

### 22. Duplicate marketing Footer in page content

Layout already renders Footer.

### 23. Splitting query and `unstable_cache` without need

Prefer one server module per feature (Interns / Services).

## Correct mental model

```
Static page     = no cookies() and no searchParams await on marketing page.tsx
Default page 1  = await getCached…(defaultKey, 1, n) at prerender
Other pages/tabs/detail = client use() → /api → same getCached…
List page index = useState only (never ?page=)
Tab / share id  = client useSearchParams (?category= / ?project=) OK
Auth UI         = client island (dynamic ssr:false + use + localStorage)
Cache bust      = revalidateTag after DB write
```

## User quotes to honor

- Isolated fetch function, then await it traditionally in the component.
- Native Next cache; no TanStack for this.
- No `useEffect` for this data.
- Anon helper must not leak memory (singleton).
- Do not “fix skeleton” by changing the data architecture.
- Invalidation is **server** (`revalidateTag`).
- Every refactor / implement of this area: **refer to this skill**.
- Do not put any comments when editing files.
- Server Actions are for mutations, not public list reads.
- Prefer one file for Interns query + `unstable_cache` when asked.

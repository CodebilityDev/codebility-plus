# Public pages: caching update checklist

Public marketing pages live under `apps/codebility/app/(marketing)/`.
They are expensive because almost every page sets:

```ts
export const dynamic = "force-dynamic";
export const revalidate = 0;
```

That turns off Next.js Full Route Cache and Data Cache. Server queries run on every request. Client `fetch` / Supabase calls have no cache headers.

**This file is a map only. Do not treat it as implemented work.**

Existing helper to reuse (do not invent a second cache layer unless you must):

- `apps/codebility/lib/server/redis-cache.ts` — `getOrSetCache(key, fetcher, ttlSeconds = 3600)`
- `apps/codebility/lib/server/redis-cache-keys.ts` — add new keys here
- `/services` already uses Redis for projects (`cacheKeys.projects.all`)

Suggested TTL: 5–60 minutes for lists that change rarely (admins, passed profiles, public projects). Keep `force-dynamic` only if the page must read cookies / auth.

---

## Where to start

Do these in order. Later pages reuse the same queries.

| Priority | Why start here | First file to open |
|---|---|---|
| **1. Landing `/`** | Highest traffic. Two live DB hits per visit (admins + intern API). | `app/(marketing)/page.tsx` then `LandingAdmins.tsx` |
| **2. Shared `getCodevs`** | Used by `/profiles`, `/codevs`, `/hire-a-codev`, `/profiles/[id]`. Cache once, many pages get cheaper. | `lib/server/codev.service.ts` |
| **3. Intern/CoDev API** | Homepage client fetch hits this on every load. | `app/api/all-active-interns-codev-prioritized/route.ts` |
| **4. Public projects** | Duplicated on `/codevs`, `/hire-a-codev`, `/careers`. `/services` already Redis-caches the same idea. | `app/(marketing)/codevs/_components/CodevsProject.tsx` (same pattern in hire-a-codev + careers) |
| **5. Remaining pages** | Careers jobs, then low-data pages. | See per-page sections below |

After you cache a shared function, tick every page that uses it.

---

## Shared chrome (every public page)

These are not routes, but they run on most marketing pages.

### Navigation (auth check)

- File: `app/(marketing)/_components/MarketingNavigation.tsx`
- What it does: client Supabase `auth.getUser()` + `codev` row
- Cache today: none (browser client, per visit)
- Start here if you want fewer auth round-trips on public pages. Optional vs data lists. Do **not** cache auth in Redis.

### Marketing layout

- File: `app/(marketing)/layout.tsx`
- No data fetch. No cache change needed.

---

## Page-by-page

### 1. `/` — Landing (START HERE)

**Page:** `app/(marketing)/page.tsx`  
**Cache today:** `force-dynamic` + `revalidate = 0`  
**Expensive pieces:**

| What | File | How it loads | Start your update |
|---|---|---|---|
| Admin + mentor cards | `_components/landing/LandingAdmins.tsx` | Server: anon Supabase `codev` where `role_id` 1 and 5 | Wrap this query (or extract it) with `getOrSetCache` + a new key e.g. `cache:marketing:admins` |
| CoDevs / interns grid | `_components/landing/LandingIntern-CodevPagination.tsx` | Client `fetch("/api/all-active-interns-codev-prioritized")` | Cache **inside the API route** first (see §3). Optionally add `cache: "force-cache"` / `next.revalidate` on the client fetch after the API is cached |
| Testimonials | `_components/testimonial/Testimonials.tsx` | Client Supabase `clients` | After landing lists. Small query |
| Hero / features / partners | various `_components/landing/*` | Static / no DB | Skip |

**Suggested first edit:** `LandingAdmins.tsx` (server, isolated, two `select("*")` queries).  
**Second edit:** the prioritized intern API (below).  
Leave `page.tsx` exports until those two are cached; then consider ISR (`revalidate = 60` or `300`) if the page no longer needs cookies.

---

### 2. Shared service — `getCodevs` (DO THIS BEFORE PROFILE PAGES)

**File:** `lib/server/codev.service.ts`  
**Used by:**

- `app/(marketing)/profiles/page.tsx`
- `app/(marketing)/profiles/_service/actions.ts`
- `app/(marketing)/profiles/[id]/page.tsx` (page + `generateMetadata` — **two queries per profile view**)
- `app/(marketing)/codevs/_components/CodevsProfiles.tsx`

**Cache today:** none. Large join (education, work_experience, schedules, projects).  
**Start your update:** add `getOrSetCache` around the list query for `application_status: "passed"`. Use a dedicated key (e.g. `cacheKeys.codevs.members` already exists in `redis-cache-keys.ts` — confirm nothing else expects different data).  
For `[id]`, either cache-by-id or read from the cached list. `generateMetadata` duplicates the same fetch — fix that in the same pass.

When this is done, `/profiles`, `/codevs` profiles section, and `/hire-a-codev` (it **imports** `profiles/page.tsx`) all get cheaper.

---

### 3. Intern / CoDev API routes

Used by the landing grid.

| Route | File | Cache today |
|---|---|---|
| `/api/all-active-interns-codev-prioritized` | `app/api/all-active-interns-codev-prioritized/route.ts` | None. Supabase + `prioritizeCodevs` every GET |
| `/api/all-active-interns-codev` | `app/api/all-active-interns-codev/route.ts` | None. Simpler query. Check callers before spending time |

**Start your update:** `all-active-interns-codev-prioritized/route.ts` — wrap the query result in `getOrSetCache` + `Cache-Control` on `NextResponse` if you want CDN/browser reuse.

Client caller: `LandingIntern-CodevPagination.tsx` (around the `fetch(...)` in `useEffect`).

---

### 4. `/profiles`

**Page:** `app/(marketing)/profiles/page.tsx`  
**Cache today:** `force-dynamic` + `revalidate = 0`  
**Data:** `getCodevs({ filters: { application_status: "passed" } })`  
**Start your update:** do **not** start here. Cache `getCodevs` first (§2), then remove or loosen `force-dynamic` / `revalidate` on this page if it no longer needs request-time cookies.

---

### 5. `/profiles/[id]`

**Page:** `app/(marketing)/profiles/[id]/page.tsx`  
**Cache today:** no `dynamic` / `revalidate` export, but `createClientServerComponent()` (cookies) keeps it dynamic  
**Data:** `getCodevs({ filters: { id } })` twice (metadata + page). Extra project queries in `[id]/_services/query.ts` if used.  
**Start your update:** after cached `getCodevs`. Deduplicate metadata vs page fetch.

---

### 6. `/codevs`

**Page:** `app/(marketing)/codevs/page.tsx`  
**Cache today:** `force-dynamic` + `revalidate = 0`  
**Also** `codevs/_components/CodevsProfiles.tsx` repeats those same two exports (they do nothing useful on a child component — only `page.tsx` / layout segments count).

| What | File | Start your update |
|---|---|---|
| Profile list | `codevs/_components/CodevsProfiles.tsx` | After §2 (`getCodevs`) |
| Featured projects | `codevs/_components/CodevsProject.tsx` | After §2. Two `projects` queries (unfiltered + “active”). Reuse `/services` Redis key or add `cache:marketing:projects` |

Hero / roadmap / mission are static. Skip.

---

### 7. `/hire-a-codev`

**Page:** `app/(marketing)/hire-a-codev/page.tsx`  
**Cache today:** `force-dynamic` + `revalidate = 0`  
**Data:**

- Renders `<Profiles />` from `../profiles/page` — **same fetch as `/profiles`**
- `hire-a-codev/_components/CodevsProject.tsx` — same dual `projects` query as `/codevs`

**Start your update:** after §2 and after you cache `CodevsProject` (or extract one shared project fetcher). Editing this page file first will not help.

---

### 8. `/services`

**Page:** `app/(marketing)/services/page.tsx`  
**Cache today:** page is still `force-dynamic` + `revalidate = 0`, but project list uses Redis:

```ts
getOrSetCache(cacheKeys.projects.all, () => getPublicProjects())
```

**Start your update:** lowest priority. Optionally drop `force-dynamic` so HTML can ISR, or reuse this pattern on the other project carousels. Do not add a second cache for the same data.

---

### 9. `/careers`

**Page:** `app/(marketing)/careers/page.tsx`  
**Cache today:** `force-dynamic` + `revalidate = 0`  
**Data:** `careers/_components/JobListings.tsx` — client Supabase `job_listings`  
**Also:** `careers/_components/CodevsProject.tsx` — same project queries as `/codevs`  
**Start your update:** after shared projects cache. Then consider moving job listings to a server fetch + `getOrSetCache` (or a small API with TTL). Hero / culture / tech stack are static.

---

### 10. `/contact`

**Page:** `app/(marketing)/contact/page.tsx`  
**Cache today:** `force-dynamic` + `revalidate = 0`  
**Data:** `contact/_components/ContactAppointment.tsx` — `fetch("/api/appointments")` on interact  
**Start your update:** last. Form POSTs should stay uncached. You can drop `force-dynamic` on the page if it is mostly static chrome.

---

### 11. `/bookacall`

**Page:** `app/(marketing)/bookacall/page.tsx`  
**Cache today:** `force-dynamic` + `revalidate = 0`  
**Data:** Calendly widget only  
**Start your update:** last. Safe to make static / ISR. No DB list.

---

### 12. `/ai-integration`

**Page:** `app/(marketing)/ai-integration/page.tsx`  
**Cache today:** `force-dynamic` + `revalidate = 0`  
**Data:** none (static sections)  
**Start your update:** last. Same as book-a-call — remove forced dynamic.

---

### 13. `/privacy-policy`

**Page:** `app/(marketing)/privacy-policy/page.tsx`  
Already static copy. No fetch. No cache work.

---

## Suggested Next.js knobs (when you edit)

Per page, pick one. Do not stack all of them blindly.

1. **Redis around the query** — use existing `getOrSetCache`. Best for Supabase lists shared by several pages.
2. **ISR** — replace `force-dynamic` + `revalidate = 0` with `export const revalidate = 300` (or similar) once the page does not read cookies.
3. **HTTP cache on API routes** — `Cache-Control: public, s-maxage=300, stale-while-revalidate=600` on intern APIs.
4. **Do not cache** auth, appointments POST, job applications, or anything user-specific.

`getOrSetCache` already no-ops if Redis is down (fetches live).

---

## Tick list

Copy as you go.

- [ ] 1. Cache admin/mentor query in `LandingAdmins.tsx`
- [ ] 2. Cache `getCodevs` (passed list + by-id) in `codev.service.ts`; add keys in `redis-cache-keys.ts`
- [ ] 3. Cache `/api/all-active-interns-codev-prioritized`
- [ ] 4. Shared public-projects fetcher (reuse `cacheKeys.projects.all` or one marketing key); swap into `CodevsProject.tsx` × 3
- [ ] 5. Loosen `force-dynamic` / `revalidate = 0` on `/`, `/profiles`, `/codevs`, `/hire-a-codev` after queries are cached
- [ ] 6. Deduplicate `getCodevs` in `/profiles/[id]` metadata vs page
- [ ] 7. Careers `JobListings` if still slow
- [ ] 8. Drop forced dynamic on `/bookacall`, `/ai-integration`, `/contact` if they stay mostly static
- [ ] 9. Invalidate Redis keys when admins update profiles / projects / job listings (home actions already `revalidatePath` in places; Redis keys need an explicit `redis.del`)

---

## Files you should not start with

- `app/home/**` — authenticated app, different caching already
- `app/auth/**` — must stay dynamic
- `middleware.ts` — not a data cache
- `packages/ui` — no page data

---
name: nextjs-static-public-data
description: >-
  The static shell plus streamed data pattern for marketing pages in apps/codebility.
  Use when a heading, filter, tab bar or skeleton vanishes during loading, when adding
  a filter or pagination to a public list page, when a public route needs a real 404,
  or when a page in this app still uses "use cache", Suspense and searchParams wrong.
---

# Marketing static shell plus streamed data (this codebase)

Read this before touching a public list page: `/services`, `/codevs`,
`/hire-a-codev`, `/careers`, `/profiles`, `/profiles/[id]`.

`apps/codebility/next.config.mjs` sets `cacheComponents: true`. Partial
Prerendering is the default, so every dynamic route prerenders a static shell and
streams the rest into Suspense fallbacks. `/services`, `/codevs` and
`/careers` all use the pattern below. Copy it instead of inventing another.

Read [pitfalls.md](pitfalls.md) before changing a boundary, a fetch or a skeleton.

## Editing rule (mandatory)

No comments in new or changed code. No `//`, no `/* */`, no JSX `{/* */}`, no
explanatory blocks. Names and structure carry the meaning, and anything this
pattern needs to explain is in this file instead.

## The one rule

Everything outside a `<Suspense>` boundary is the static shell.

A boundary wrapped around the whole page body therefore makes the fallback the
entire shell. That was the original bug on all three pages: the heading, the
filter and the closing section were inside one boundary and vanished for the
length of the fetch.

Two things force a boundary:

- `await searchParams`
- an uncached data fetch

Data behind `"use cache"` does not need one. It belongs in the shell.

## File shape

Five roles, named the same way on all three pages.

| Role | services | codevs | careers |
| --- | --- | --- | --- |
| page shell | `app/(marketing)/services/page.tsx` | `app/(marketing)/codevs/page.tsx` | `app/(marketing)/careers/page.tsx` |
| Block: section, container, boundary | `ServicesProjectsBlock.tsx` | `CodevsProfiles.tsx` | `JobListingsBlock.tsx` |
| Section: awaits params, fetches | `ServicesProjectsSection.tsx` | `CodevsProfilesData.tsx` | `JobListingsSection.tsx` |
| Fallback: static parts plus skeleton | `ServicesProjectsFallback.tsx` | `CodevsProfilesFallback.tsx` | `JobListingsFallback.tsx` |
| Body: client controls and results | `ServicesTab.tsx` | `CodevsProfilesPagination.tsx` | `JobListingsPagination.tsx` |
| Shared control | `ServicesTabBar.tsx` | `CodevsProfilesFilter.tsx` | `JobListingsFilter.tsx` |
| Cached loaders | `lib/global/services-projects-cached.ts` | `lib/global/codevs-profiles-cached.ts` | `lib/global/careers-job-listings-cached.ts` |

`app/(marketing)/profiles/[id]/page.tsx` uses the same split with
`ProfileDetailSection.tsx` and `ProfileDetailSkeleton.tsx`.

Flow:

    page.tsx (sync, no await)
    └── Block (async, awaits cached data only)
        ├── static heading and page chrome
        ├── shared control rendered directly, when it needs no data
        └── Suspense fallback={<Fallback />}
            └── Section (async: await searchParams, fetch)
                └── Body (client: control bound to its transition, results, pager)

The Section does the only awaiting that can suspend. The Block awaits cached data,
which does not.

## The shared control

One component, rendered twice: once in the Fallback, once in the Body.

Props are the option list, the selected value, and an optional `onSelect`.

- The Body passes `onSelect` wired to its own `startTransition`. That is what
  keeps the skeleton working on a soft navigation.
- The Fallback omits `onSelect`. The control then navigates itself with its own
  `useTransition`, so it still works before the data lands.

See `ServicesTabBar.tsx`, `CodevsProfilesFilter.tsx` and
`JobListingsFilter.tsx`.

## Unknown selection in the shell

The shell cannot know `?category=`, `?position=` or `?department=`. Render no
active control rather than a wrong one.

- `ServicesTabBar`: `active={null}`
- `CodevsProfilesFilter`: `selectedPosition=""`, so the Radix select shows its
  placeholder
- `JobListingsFilter`: `department`, `type` and `level` are
  `string | null`, and `null` means no button is active

Do not default to `"All"`. On `/careers?department=General` that highlights
the wrong button until the data lands.

## Cached loaders

Data the shell needs that does not depend on `searchParams` gets its own cached
loader.

    export async function getCachedCareersJobDepartments() {
      "use cache";
      cacheLife("hours");
      cacheTag(CACHE_TAGS.careersJobListings);
      return getCareersJobDepartments(createClientAnon());
    }

The cache key is the arguments, so
`getCachedCareersJobListingsPage(department, type, level, page, limit)` stores one
entry per filter combination. Confirmed with `NEXT_PRIVATE_DEBUG_CACHE=1`:

    DefaultCacheHandler: get [... ["General","Full-time","Senior",1,4]] not found
    DefaultCacheHandler: set [... ["General","Full-time","Senior",1,4]] start
    DefaultCacheHandler: get [... ["General","Full-time","Senior",1,4]] found { tags: [ 'careers-job-listings' ] }

Same function plus same arguments means one entry, no matter how many components
call it. `getCachedCareersJobDepartments()` is called from both the Block and the
Section and resolves to a single entry.

Nothing invalidates `CACHE_TAGS.careersJobListings` today. A new job posting will
not appear on `/careers` until the `hours` window rolls over. Add
`updateTag(CACHE_TAGS.careersJobListings)` to the action that writes
`job_listings`.

## MarketingProgressiveSection hides its children

`MarketingProgressiveSection` renders its content inside
`[data-landing-content]`, and `styles/global/globals.css` sets that to
`visibility: hidden` until hydration sets `data-landing-motion="ready"`.

Anything that must be visible before hydration goes outside it. A heading can stay
inside, because its skeleton is what shows instead. A filter or a results skeleton
cannot.

`JobListingsBlock.tsx` shows the split: the heading is inside, the Suspense
boundary is outside.

## Soft navigation needs isPending

App Router holds the current UI while it fetches the next route, so a Suspense
fallback does not paint on a soft navigation. The client Body owns a
`useTransition` and swaps in the skeleton itself.

    const [isPending, startTransition] = useTransition();
    ...
    {isPending ? <JobListingsSkeleton count={PAGE_SIZE} /> : <Results />}

Keep the control and the results in the same client component so they share that
state. The Fallback's copy of the control is separate and does not need it.

## Detail routes: a real 404 needs the proxy

Under Cache Components the shell is sent before the id is known, so `notFound()`
inside a boundary can only answer 200 with a `noindex` tag. The Next docs say to
check in `proxy` instead, and `apps/codebility/proxy.ts` does that for
`/profiles/<id>`:

- a UUID shape check, which rejects malformed ids with no database call
- one `codev` lookup by primary key, selecting only `id`
- a rewrite to `/not-found` with status 404
- fail open on any lookup error, so an outage cannot 404 a real profile
- a per-process TTL map, 30 minutes, capped at 5000 entries, because link
  prefetching fires a request per visible card

Keep this check cheap. Never fetch the full record there.

## Folder rules

Shared by two or more routes means `components/global/` or `lib/global/`.
`codebility/route-scope` in `apps/codebility/eslint.config.js` resolves any
`components/global/` file to route `""`, so every route may import it. A file in
`components/marketing/careers/` can only be imported by `/careers`.

That is why `CodevsProfiles*` lives in `components/global/marketing/`:
`/codevs` and `/hire-a-codev` both render it.

`app/` holds routing files only. A `page.tsx` may render components, and that is
where a short shell belongs.

## Verification

Build, never `next dev`. Dev does not prerender the same way.

    pnpm.cmd --filter codebility lint
    pnpm.cmd codebility:build
    $env:PORT='3311'; pnpm.cmd --filter codebility start

`pnpm` and `npx` fail under this execution policy. Use `pnpm.cmd` and
`npx.cmd`.

Restart `next start` after every build, because it loads its manifests at boot.
Confirm your server owns the port before trusting a result:

    Get-NetTCPConnection -LocalPort 3311 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

### Is the shell still right?

The build route table must still show `◐` for the route, not `ƒ`.

`apps/codebility/.next/server/app/<route>.html` is the prerendered shell. It must
contain the static parts and none of the data. For `/services` that is the hero,
the tab bar, the Calendly heading and the grid skeleton, with no project cards.

`apps/codebility/.next/prerender-manifest.json` must have `experimentalPPR:
true` for the route.

At runtime the headers confirm it:

    x-nextjs-prerender: 1
    x-nextjs-postponed: 1

The served bytes must start with the build artifact, and the first flush must be
identical for `/services` and `/services?category=cms`. A shell that changes
with `searchParams` is not a static shell.

### Where does the data land in the stream?

Read the response chunk by chunk and record the byte offset of each marker. This is
the most reliable check, because it cannot race the browser.

Measured on the production build:

| Route | Static markers arrive | Data arrives | Full document |
| --- | --- | --- | --- |
| `/services` | 16,380 bytes at 226ms | streamed after | 146,228 bytes at 1,176ms |
| `/codevs` | 32,766 bytes at 65ms | streamed after | 243,782 bytes at 976ms |
| `/profiles/[id]` | 16,383 bytes at 24ms | `Skills` at byte 51,913, `About` at 54,529 | 79,048 bytes at 447ms |

### Pre-hydration state

`MarketingProgressiveSection` hides its content until hydration, so an ordinary
Playwright run can look correct while the shell is empty. Load the page with
JavaScript disabled to see what the shell actually paints:

    const ctx = await browser.newContext({ javaScriptEnabled: false });

Expected on all three pages: the control is visible and the results skeleton is
visible. If either is missing, something sits inside
`MarketingProgressiveSection` that should not.

### Skeleton detection

    Array.from(document.querySelectorAll('[aria-busy="true"]'))
      .filter(e => !e.closest('[aria-hidden="true"]') && e.getBoundingClientRect().height > 0)
      .length

The visibility filter matters. `MarketingProgressiveSection` keeps its skeleton in
the DOM permanently inside an `aria-hidden` slot.

### Cache hits and misses

    $env:NEXT_PRIVATE_DEBUG_CACHE='1'; pnpm.cmd --filter codebility start

Then look for `DefaultCacheHandler: get [...] not found` followed by `set`, and
`found` with `tags: [...]` on the repeat.

### Playwright

Global install, not a project dependency:

    $env:NODE_PATH='C:\Users\Dev\AppData\Roaming\npm\node_modules'
    node "$env:TEMP\your-script.cjs"

Delete the script and any screenshots when done.

## Reference files

Converted:

- `/services`: `ServicesProjectsBlock.tsx`, `ServicesProjectsSection.tsx`,
  `ServicesProjectsFallback.tsx`, `ServicesTabBar.tsx`, `ServicesTab.tsx`,
  `lib/global/services-projects-cached.ts`
- `/codevs` and `/hire-a-codev`: `CodevsProfiles.tsx`,
  `CodevsProfilesData.tsx`, `CodevsProfilesFallback.tsx`,
  `CodevsProfilesFilter.tsx`, `CodevsProfilesPagination.tsx`,
  `lib/global/codevs-profiles-cached.ts`
- `/careers`: `JobListingsBlock.tsx`, `JobListingsSection.tsx`,
  `JobListingsFallback.tsx`, `JobListingsFilter.tsx`,
  `JobListingsPagination.tsx`, `lib/global/careers-job-listings-cached.ts`,
  `utils/marketing/careers/careers.ts`
- `/profiles/[id]`: `app/(marketing)/profiles/[id]/page.tsx`,
  `ProfileDetailSection.tsx`, `ProfileDetailSkeleton.tsx`
- proxy 404: `apps/codebility/proxy.ts`

Same bug class, not converted yet:

- `/profiles`: `ProfilesListPagination.tsx` renders `CodevListFilter` inside the
  suspended `ProfilesListBody`, so the filter vanishes on load.
  `CodevsProfilesFilter` is already shaped to be shared.
- `/`: `LandingInternSection.tsx` wraps `LandingIntern` in a Suspense whose
  fallback is a bare skeleton.

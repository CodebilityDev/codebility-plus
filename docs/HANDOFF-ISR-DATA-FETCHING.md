# Handoff: server-side data fetching, ISR caching and skeleton loading

Written at the end of a session that fixed a failing Vercel build, removed React
Query, and made every fetch in `apps/codebility` follow one pattern.

Branch `refactor/private-reset`, in sync with origin, working tree clean.
Relevant commits, newest first: `1eec7343 added skeleton loaders`,
`e1cb6e3e ISR cached`, `320a1c09 node version to latest`,
`0239996e fix build errors`. Read those diffs rather than a summary of them.

---

## 1. The one finding that matters most

**A `<Suspense fallback>` renders on a hard load but never on a soft navigation.**

App Router holds the current UI while it fetches the RSC payload for the new
route, so the fallback is skipped and the user stares at stale content. This is
what "nothing happens until the fetch finishes" was.

The fix is `useTransition` in the client component that triggers the
navigation:

```tsx
const [isPending, startTransition] = useTransition();

const navigate = (nextPosition: string, nextPage: number) => {
  startTransition(() => {
    router.push(buildHref(pathname, nextPosition, nextPage), { scroll: false });
  });
};

// ...
{isPending ? <SectionSkeleton /> : <TheGrid ... />}
```

The server still does all the fetching. `useTransition` only surfaces the
in-flight state of that server navigation. Measured before/after on
`/codevs?page=2` with 500ms simulated latency: **0 skeleton frames before, 54
frames spanning 1057ms after.**

Two places do **not** need this and are correct as they are:

- A modal that mounts fresh (`ServicesDetailModalSlot`) fires its Suspense
  fallback normally, because it is a new mount rather than a re-render.
- Fully static routes (`/proposal`) have their data baked in at build time, so
  the fallback is replaced on hydration and never paints.

---

## 2. The pattern to follow

Documented at length in [apps/codebility/docs/rsc-data-layer-migration.md](apps/codebility/docs/rsc-data-layer-migration.md).
Short version:

1. Every read happens in a React Server Component.
2. Public reads go through a loader in `lib/global/*-cached.ts` marked
   `"use cache"` + `cacheLife("hours")` + `cacheTag(CACHE_TAGS.x)`. All nine
   loaders already comply.
3. User-specific reads use React `cache()` for per-request dedupe and must
   **not** use `"use cache"`.
4. No client-side data fetching. `@tanstack/react-query` is still in
   `apps/codebility/package.json` **on purpose** — the dependency was kept for
   possible future use, but nothing imports it. `grep` should return only
   `package.json`.
5. URL-driven pagination and filters, with `useTransition` plus that section's
   skeleton while pending.
6. `experimental.staleTimes.dynamic = 30` in
   [apps/codebility/next.config.mjs](apps/codebility/next.config.mjs) makes
   revisits instant from the Next.js Router Cache with **zero** network
   requests. Verified: `req=none` on revisit.

The five components carrying `useTransition`:

- `components/global/marketing/CodevsProfilesPagination.tsx`
- `components/marketing/LandingIntern-CodevPagination.tsx`
- `components/marketing/careers/JobListingsPagination.tsx`
- `components/marketing/services/ServicesTab.tsx`
- `components/marketing/profiles/ProfilesListPagination.tsx`

Exceptions, both deliberate: `/applicant/onboarding` and
`/applicant/waiting` do an auth check then `redirect()`, so a skeleton there
would flash before the redirect. The applicants table's tabs and filters are
pure client-side `useState`/`useMemo` over a single server fetch, so there is
no fetch to cover.

---

## 3. How to verify anything here

**Test the build, not dev.** The whole session was verified this way:

```powershell
pnpm.cmd codebility:build
$env:PORT='3311'; pnpm.cmd --filter codebility start
```

Playwright is global, not a project dependency. Run scripts with:

```powershell
$env:NODE_PATH='C:\Users\Dev\AppData\Roaming\npm\node_modules'
node "$env:TEMP\your-script.cjs"
```

Detecting a skeleton reliably:

```js
Array.from(document.querySelectorAll('[aria-busy="true"]'))
  .filter(e => !e.closest('[aria-hidden="true"]') && e.getBoundingClientRect().height > 0)
  .length
```

Measure **URL change time** as the navigation latency and skeleton span as the
loading window. Do not measure "time until skeleton disappears" without the
visibility filter.

Auth-gated routes need a session. The trick that worked: launch a headed
browser with `chromium.launch({ headless: false })`, navigate to
`/auth/sign-in`, poll `ctx.cookies()` for a cookie matching
`/^sb-.*-auth-token/`, then save `ctx.storageState({ path })` and reuse it via
`browser.newContext({ storageState })`. Delete the state file when done — it is
a live session.

---

## 4. Traps that cost real time

1. **`pnpm` and `npx` fail.** Their `.ps1` shims are blocked by execution
   policy. Always `pnpm.cmd` / `npx.cmd`.
2. **A stale `next start` holding port 3311 is the nastiest one.** The new
   server dies with `EADDRINUSE`, Playwright then tests the *old* server whose
   `.next` was deleted underneath it, and every route returns phantom 500s.
   Always confirm your server owns the port before trusting a result.
3. **`LandingInternCardsSkeleton` is permanently in the DOM** inside
   `MarketingProgressiveSection`'s `aria-hidden` `data-landing-skeleton` slot.
   Naive `[aria-busy]` counting reports a skeleton that never ends. I once
   measured 32.8s for a navigation that actually completed in 530ms.
4. **Do not use `eval()` for page instrumentation.** The site's CSP blocks it
   and you get a wall of phantom page errors. I reported 163 of them once;
   re-running with a real function gave 0.
5. **`next start` does not rebuild.** It loads its manifests at boot, so
   restart it after every build.
6. **Folder rules are enforced.** `codebility/route-scope` in
   [apps/codebility/eslint.config.js](apps/codebility/eslint.config.js) resolves
   any `components/global/` file to route `""`, so a shared server action must
   live in `actions/global/` (see `actions/global/marketing-profiles.ts` for
   precedent). Read [AGENTS.md](AGENTS.md) before adding files.
7. **Auth gating.** `routePermissionMap` in
   [apps/codebility/proxy.ts](apps/codebility/proxy.ts) gates only
   `/home/applicants`; `PUBLIC_ROUTE_PREFIXES` is `["/profiles/",
   "/nda-signing/"]`. Everything else under `/home`, `/applicant`,
   `/profiles` (exact) and `/proposal` needs a session.

---

## 5. Open items

1. **The 2FA badge fix is unverified end to end.**
   [AccountSettings2FA.tsx](apps/codebility/components/global/account-settings/AccountSettings2FA.tsx)
   used to capture `mfaFactors` into `useState` once at mount, so the
   Enabled/Disabled badge survived `router.refresh()` until a full reload. It
   now reads the prop directly. Confirming it means enrolling or unenrolling
   2FA, which changes account state, so it was left to the owner. Verified by
   `tsc`/`lint`/build and inspection only.
2. **About eight skeletons still lack `aria-busy`**: `LandingPartnersSkeleton`,
   `LandingWhyChooseSkeleton`, `LandingWorkWithUsSkeleton`,
   `ProfileMainSkeleton`, `ProfileDetailSkeleton`, `ProfileCompletionGuideSkeleton`,
   `AdminCardSkeleton`, `ServicesServiceCardSkeleton`. They are CSS placeholders
   inside `aria-hidden` wrappers, where `aria-busy` would be inert, so this is
   deliberate. Changing it means changing `MarketingProgressiveSection` itself,
   which would also expose the placeholder copy to screen readers.
3. **`DefaultPagination` renders `<a>` with an `onClick` and no `href`**
   ([DefaultPagination.tsx](apps/codebility/components/global/ui/DefaultPagination.tsx)),
   so crawlers cannot follow pagination links. Pre-existing, not a regression.
4. **Vercel dashboard still needs Node.js Version set to 22.x.** The repo now
   pins `engines.node >= 22` in both the root and app `package.json`, but the
   dashboard setting is the one that definitely applies. The original failure
   was Vercel building on Node 20.x, which it has discontinued.
5. **Possible bad env value.** `NEXT_PUBLIC_RESEND_API_KEY` in
   `apps/codebility/.env` is set to a Supabase hostname rather than a Resend
   key. Values are intentionally not reproduced here; check whether outbound
   email actually works.
6. **`.env` is gitignored and holds live credentials.** Never commit it or
   paste its contents anywhere.

---

## 6. Known-good verification results

Recorded against a production build served by `next start`, 400-500ms
simulated latency. Useful as a baseline to compare against.

| Check | Result |
|---|---|
| Public routes, 10 of them | all 200, 0 bad responses, 0 page errors |
| Gated routes, 6 of them | all redirect to `/auth/sign-in?from=…`, 0 5xx |
| `/codevs` pagination | skeleton 325ms, URL changed 436ms |
| Landing interns/Codevs pagination | skeleton 1216ms, URL changed 1403ms |
| `/careers` pagination | skeleton 1472ms, URL changed 2652ms |
| `/services` pagination | skeleton 1664ms, URL changed 3222ms |
| `/services` category filter | skeleton 140ms, URL changed 404ms |
| `/services` detail modal | skeleton ~1900ms, URL changed 191ms |
| `/profiles` pagination (authenticated) | skeleton 2212ms, URL changed 2317ms |
| `/home/applicants` (authenticated) | skeleton 1075ms |
| Revisits within 30s | `req=none`, 0-18ms skeleton |
| `tsc`, `lint`, `build` | 0, 0, `Tasks: 2 successful` |

One pre-existing console error remains: **React #418, a hydration mismatch on
`/auth/onboarding`.** Confirmed present on the deployed site running the older
code, so it is not a regression from this work.

---

## 7. Suggested skills

Call the `skill` tool for these before starting:

- **`ponytail`** — always on for any coding work here. Bias to the smallest
  change that works; this codebase rewards it.
- **`unslop`** — always on for prose. Zero em-dashes.
- **`impeccable`** — load if you continue UI/UX work, particularly the skeleton
  shapes and the loading-state design.
- **`diagnose-windows-sandbox-acl`** — load only if you hit unexpected Windows
  sandbox access denials.

Not a skill, but required reading before touching file layout:
[AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md).

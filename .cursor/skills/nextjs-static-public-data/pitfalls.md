# Traps and rejected paths

Every item here cost real time or was tried and rejected. Check the list before
proposing a fix.

## 1. A Suspense boundary around the whole page body

The fallback becomes the entire static shell, so everything else streams in after
the fetch. This was the original state of `/services`, `/codevs`,
`/hire-a-codev` and `/careers`.

`/hire-a-codev` had it twice: its own `<Suspense>` around `CodevsProfiles`,
which already had one. The outer fallback was a bare skeleton, so the section
heading disappeared as well.

## 2. The fallback inside MarketingProgressiveSection

`[data-landing-content]` is `visibility: hidden` until hydration. A fallback
placed inside it is invisible in the static shell, which is worse than before the
change. Caught by loading the page with JavaScript disabled.

## 3. export const instant = false

`/profiles/[id]` had it. The route blocked until the full server render finished,
so a card click waited about a second with a blank page and no skeleton. The
prerendered shell for that route was 0 bytes.

It does not disable prerendering. It disables instant-navigation validation and
makes the navigation block.

## 4. notFound() after streaming

Once the shell is flushed the status is already 200. Next adds
`<meta name="robots" content="noindex">`, which keeps the page out of search
results, but the status is gone. For a real 404, check in `proxy` before the
response starts.

## 5. useSearchParams() outside Suspense

An instant-navigation validation error under Cache Components. Push the read down
into a leaf inside its own boundary.

## 6. A data-dependent early return above the controls

`JobListingsBody` returned the empty message before reaching
`JobListingsPagination`, so a filter with no matches dropped the filter and left
no way to change it. Keep controls outside the branch.

## 7. Judging the data fetch by TTFB

With Partial Prerendering the shell is sent first, so TTFB measures the shell. The
listings stream later in the same response. Read the full body, or watch the byte
offsets.

The shell only waits on the cached loaders. On `/careers` that is
`getCachedCareersJobDepartments()`, which is why the first request after a
restart is slow and the rest are not.

## 8. Testing in next dev

Dev does not prerender the same way, and a blocking route behaves differently.
Build and run `next start`.

## 9. A stale next start holding the port

The new server dies with `EADDRINUSE`, the browser then talks to the old one
whose `.next` was deleted underneath it, and every route returns phantom 500s.
Confirm the port owner first.

## 10. pnpm and npx

Their `.ps1` shims are blocked by execution policy. Use `pnpm.cmd` and
`npx.cmd`.

## 11. Counting skeletons naively

`MarketingProgressiveSection` keeps its skeleton in the DOM permanently, inside
an `aria-hidden` slot. Filter by visibility and height, or you will measure a
skeleton that never ends. A naive count once reported 32.8s for a navigation that
took 530ms.

## 12. eval() for page instrumentation

The site's CSP blocks it, which produces a wall of phantom page errors. Pass a real
function to `page.evaluate`.

## Rejected along the way

- **`generateStaticParams` plus `dynamicParams = false`** for a real 404. The
  `codev` table has 1,398 rows, and the list would go stale for every new
  profile. The proxy check replaced it.
- **Defaulting the shell's control to `"All"`.** Shows a wrong selection on a
  filtered URL.
- **A long TTL for negative results in the proxy.** Kept at 30 minutes with a size
  cap, so a deleted profile still ends in the streamed not-found page.
- **The previous version of this skill.** It documented `unstable_cache`,
  `/api/landing-interns`, `/api/services-projects` and `fetchApiJson`, and
  told you never to await `searchParams` on a marketing `page.tsx`. None of
  those routes exist now, and the current pattern awaits `searchParams` inside a
  boundary. Deleted rather than kept alongside this file.

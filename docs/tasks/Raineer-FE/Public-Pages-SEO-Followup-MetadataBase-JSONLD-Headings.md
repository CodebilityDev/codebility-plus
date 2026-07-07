# Public Pages SEO — Follow-Up: metadataBase, Structured Data & Heading/Alt Hygiene

## Summary

The first SEO pass landed the sitemap, robots file, and per-page metadata (titles, descriptions, canonical URLs, Twitter cards) — that part is done and looks good. Three objectives from the original task were not completed, and one of them silently cancels out a lot of the work that was done. This follow-up closes those three gaps: set `metadataBase`, add JSON-LD structured data, and fix the heading/alt-text hygiene on the marketing pages.

## Background

Current state on `dev`:

- `app/layout.tsx` still has **no `metadataBase`**. Every Open Graph and Twitter image across the site uses a relative path (`/og-image.jpg`, relative profile images). Without `metadataBase`, Next.js can't turn those into absolute production URLs, so social previews still render without an image — and Next logs a build warning on every page. This is the single most important gap because it undermines all the per-page OG/Twitter work already shipped.
- There is **no JSON-LD anywhere** in the app (no `application/ld+json`). None of the structured-data objectives were done: no Organization/WebSite sitewide, no JobPosting on careers, no Person on `profiles/[id]`, no Service on services.
- The **heading and alt hygiene** was not touched. `LandingWhyChoose.tsx` still renders 7 `<h1>` elements and `CodevsProject.tsx` renders 4, so the home page and the careers/codevs/hire-a-codev pages each end up with multiple H1s. Weak and empty `alt` text remains on several content images.

## Objectives

- Set `metadataBase` on the root layout so all relative OG/Twitter image URLs resolve to absolute production URLs, and add sitewide OG/Twitter defaults.
- Add JSON-LD structured data: Organization + WebSite sitewide; JobPosting on careers; Person on `profiles/[id]`; Service on the services page.
- Ensure exactly one `<h1>` per rendered page (demote the extra H1s to `<h2>`/`<h3>`), and make image `alt` text descriptive for content images while using empty `alt=""` only for purely decorative ones.

## Expected Behavior

- Sharing any public page on Facebook/LinkedIn/X shows the correct image via an absolute URL; no Next.js `metadataBase` build warning remains.
- Google Rich Results Test validates the structured data on the home page, careers, and a profile page with no errors.
- Each public page has a single H1 and a logical heading order; content images have meaningful alt text.

## Acceptance Criteria

- [ ] `metadataBase` is set on the root layout; the OG image resolves to an absolute URL on every page (verify in view-source and the Facebook Sharing Debugger).
- [ ] No `metadataBase` warning appears in the production build output.
- [ ] JSON-LD validates on Google Rich Results Test for: Organization + WebSite (sitewide), JobPosting (careers), and Person (`profiles/[id]`).
- [ ] Each public page renders exactly one `<h1>`; `LandingWhyChoose.tsx` and the three `CodevsProject.tsx` variants no longer emit multiple H1s.
- [ ] Content images have descriptive `alt`; decorative images use `alt=""`.
- [ ] Before/after Lighthouse SEO scores included in the PR (aim 95+).

## Solution Hint

Treat these as advisory, not prescriptive.

**1. metadataBase + sitewide defaults** — in `app/layout.tsx` `generateMetadata()`, add:
```ts
metadataBase: new URL("https://www.codebility.tech"),
```
Once set, the existing relative image paths (`/og-image.jpg`) resolve automatically — no need to hardcode absolute URLs per page. Also add a sitewide `twitter` default block here (mirroring the `openGraph` block) so pages that don't override it still get a card.

**2. JSON-LD** — render a `<script type="application/ld+json">` with `dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}`. Put Organization + WebSite in the root layout (or the marketing layout) so it's sitewide; put Person in `profiles/[id]/page.tsx` using the codev data already fetched there; put JobPosting on careers using the existing job-listings source; put Service on the services page. A tiny shared `<JsonLd data={...} />` component keeps it clean. Escape `<` as `\\u003c` in the stringified output as a defense against breaking out of the script tag.

**3. Headings/alt** — keep the first, most important heading on each page as `<h1>` and demote the rest to `<h2>`/`<h3>`. The offenders are `_components/landing/LandingWhyChoose.tsx` (7 H1s) and the three `CodevsProject.tsx` files under `careers/`, `codevs/`, and `hire-a-codev/` (4 H1s each). For images, replace weak alt text (`alt="woman"`, `alt="tailored"`, `alt="diamond-icon"`) with descriptive text; set `alt=""` only where the image is purely decorative.

## Reminders

- Presentation/metadata layer only — no data-model or server-action changes. Pull dynamic values (job listings, profile data) from the existing sources.
- Use the real production base URL everywhere.
- Validate with the Facebook Sharing Debugger, X Card Validator, Google Rich Results Test, and Lighthouse SEO before opening the PR.

## Instructions

- Branch naming: `public-pages-seo-followup/<name>`. Commit all changes before opening the PR.
- PR description: routes touched, before/after Lighthouse SEO scores, a Rich Results Test screenshot, and a working social-preview screenshot.

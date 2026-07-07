# Public Pages — SEO & On-Page Optimization

## Summary

Our public marketing pages are running on a single global metadata block. The root layout (`app/layout.tsx`) sets one title ("Codebility") and one description ("Everyone has the ability to code"), and **every public page inherits them unchanged** — none of the marketing pages set their own. So search engines see the same title and description across the whole site, which is the biggest on-page SEO problem we have right now. On top of that we have no sitemap, no robots file, no canonical URLs, no structured data, and the Open Graph image is effectively broken because `metadataBase` isn't set.

This task brings the public pages up to a proper on-page SEO standard: unique per-page metadata, working social cards, a sitemap and robots file, canonical URLs, structured data, and cleaner heading/alt-text hygiene. It's contained to the marketing routes (`app/(marketing)/**`) and the root layout — no backend work.

## Technical Context

Current state (confirmed by inspecting the code):
- `app/layout.tsx` `generateMetadata()` sets title, description, favicons, web manifest, and a basic `openGraph` block — but **no `metadataBase`**, so the relative OG image (`/og-image.jpg`) doesn't resolve to an absolute URL and social previews can render blank.
- **Zero** marketing pages export `metadata` or `generateMetadata` — every page shares the root title/description.
- No `app/sitemap.ts`, no `app/robots.ts`, no JSON-LD (`application/ld+json`) anywhere.
- No `twitter:` card block, no `alternates.canonical`.
- `profiles/[id]` (dynamic) has no `generateMetadata`, so profile pages can't get person-specific metadata.
- Content layer: several components each render an `<h1>` (e.g. `LandingWhyChoose.tsx` ~7, `CodevsProject.tsx` ~4), so composed pages end up with multiple H1s. Image `alt` text is often decorative/weak (`alt="diamond-icon"`, `alt="tailored"`, `alt="woman"`, some empty `alt=""`).

Marketing pages in scope: `/` (home), `services`, `careers`, `hire-a-codev`, `codevs`, `ai-integration`, `contact`, `bookacall`, `privacy-policy`, `profiles`, `profiles/[id]`.

## Objectives

- Set `metadataBase` on the root layout (e.g. `new URL("https://www.codebility.tech")`) so all relative OG/Twitter image URLs resolve correctly.
- Give **every** marketing page a unique, keyword-relevant `<title>` and a ~150–160 character meta `description` via `export const metadata` (or `generateMetadata` for dynamic routes).
- Add `generateMetadata` to `profiles/[id]` so each profile page gets a person-specific title/description (and OG image where available).
- Add a `twitter` card block (`card: "summary_large_image"`, title, description, image) — sitewide default plus per-page where it differs.
- Add canonical URLs via `alternates.canonical` to avoid duplicate-content issues (trailing slash, query params, dynamic pages).
- Add `app/sitemap.ts` enumerating the public routes (static + dynamic profiles) and `app/robots.ts` with crawl directives and a sitemap reference.
- Add JSON-LD structured data: `Organization` + `WebSite` sitewide; `JobPosting` on careers/job listings (for Google Jobs eligibility); `Person` on `profiles/[id]`; `Service` on services where it fits.
- Clean up the content layer: exactly one `<h1>` per page (demote the rest to `<h2>`/`<h3>`), and make image `alt` text descriptive for content images while using empty `alt=""` only for purely decorative ones.

## Expected Behavior

- Each public page renders its own `<title>` and meta description in the HTML head — no two public pages share the same title/description.
- Social shares (Facebook/LinkedIn/X) show the correct title, description, and image, with a working absolute image URL.
- `/<base>/sitemap.xml` and `/<base>/robots.txt` are served and valid; robots references the sitemap.
- Each page declares a canonical URL.
- Structured data validates (Google Rich Results Test / schema.org validator) with no errors for the implemented types.
- Each page has a single H1, a logical heading order, and meaningful alt text on content images.

## Acceptance Criteria

- `metadataBase` is set on the root layout; the OG image resolves to an absolute URL.
- Every marketing page (and `profiles/[id]`) exports unique, relevant title + description metadata — verified by viewing source / `<head>` on each route.
- A valid `sitemap.xml` (covering static routes + dynamic profiles) and `robots.txt` (with sitemap reference) are served.
- Twitter Card and canonical (`alternates.canonical`) are present on the public pages.
- JSON-LD is present and validates for at least `Organization`/`WebSite` sitewide, `JobPosting` on careers, and `Person` on `profiles/[id]`.
- Each public page has exactly one `<h1>`; remaining headings use the correct level.
- Content images have descriptive `alt`; decorative images use `alt=""`.
- Validated with Lighthouse SEO (aim 95+) and Google Rich Results Test on representative pages; before/after Lighthouse SEO scores included in the PR.

## Reminders

- Presentation/metadata layer only — no changes to data models or server actions. Pull dynamic values (job listings, profile data) from the existing data sources for `generateMetadata`/JSON-LD.
- Use the real production base URL for `metadataBase`, canonicals, sitemap, and absolute image URLs.
- Test social previews (e.g. Facebook Sharing Debugger, X Card Validator) and run Lighthouse SEO before opening the PR.

## Instructions

- Branch naming: `task-name/your-name` (e.g. `public-pages-seo/<name>`). Commit all changes to this branch before opening the PR.
- Include a comprehensive PR description with the routes touched, before/after Lighthouse SEO scores, and screenshots of working social previews.
- Request review from your team lead. Maintain Kanban card status as work progresses.

## Got any questions?

Reach out to your assigned team lead via the team group chat.
</content>

# Link Previews Are Blank — `og-image.jpg` Does Not Exist

## Summary

Every public page tells Facebook, LinkedIn, X, Slack and Discord to use `/og-image.jpg` as the preview image when someone shares a link. That file has never existed. Anyone sharing a codebility.tech link gets a blank card with just the title and description, no image.

Twelve files reference it, including the root layout, so this affects every public URL on the site. Nothing errors and nothing looks broken while browsing, which is why it has gone unnoticed.

The metadata is already correct. This is one image file dropped into `public/`.

## Background

The pages declaring the image:

```
app/layout.tsx
app/(marketing)/page.tsx
app/(marketing)/services/page.tsx
app/(marketing)/careers/page.tsx
app/(marketing)/codevs/page.tsx
app/(marketing)/profiles/page.tsx
app/(marketing)/profiles/[id]/page.tsx
app/(marketing)/hire-a-codev/page.tsx
app/(marketing)/contact/page.tsx
app/(marketing)/bookacall/page.tsx
app/(marketing)/ai-integration/page.tsx
app/(marketing)/privacy-policy/page.tsx
```

Each declares it the same way:

```ts
images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "..." }]
```

`profiles/[id]` is slightly different — it uses the developer's own photo when there is one and falls back to `/og-image.jpg` when there isn't, so developer profiles without a photo currently share as blank cards too.

`public/` holds only `assets/` and `site.webmanifest`. There is no `og-image.jpg` and no Next.js `opengraph-image` convention file anywhere in `app/`.

Worth knowing: the `metadataBase` fix earlier in the SEO work is what made these URLs resolve to full absolute addresses. Before that they were malformed relative paths. So the situation went from broken in a confusing way to cleanly pointing at a 404 — which is why this is now a simple drop-in rather than a metadata problem.

## Objectives

- Give every public page a working preview image when its link is shared.
- Keep the existing metadata as-is; no code changes should be needed.

## Expected Behavior

- Sharing any codebility.tech URL on Facebook, LinkedIn, X, Slack or Discord shows a card with the Codebility image, not an empty space.
- A developer profile with no uploaded photo falls back to the same image rather than a blank card.

## Acceptance Criteria

- [ ] `apps/codebility/public/og-image.jpg` exists at 1200x630.
- [ ] Loading `https://www.codebility.tech/og-image.jpg` returns the image, not a 404.
- [ ] The homepage passes a link preview check with the image showing.
- [ ] At least one inner page (services or careers) also previews correctly.
- [ ] A profile with no photo previews with the fallback image.
- [ ] No changes to the metadata blocks in any of the twelve files.

## Solution Hint

Treat these as advisory, not prescriptive.

The image needs designing rather than coding — 1200x630 is the standard OpenGraph size and renders well across all the platforms above. Logo plus a short tagline on the brand background is the usual pattern. Keep important content away from the outer edges, since some platforms crop slightly.

Save as JPG at the exact path `apps/codebility/public/og-image.jpg`, since that is the filename the metadata already points at. Keep it under about 300KB so previews fetch quickly.

Once it is deployed, run the homepage through the Facebook Sharing Debugger and use its scrape-again option. Platforms cache preview data aggressively, so an old blank result can persist for a while after the file goes live — forcing a re-scrape is usually necessary to see the change.

If you would rather use the Next.js convention instead, an `opengraph-image.jpg` in `app/` works too, but then the explicit `/og-image.jpg` references should be removed so there is one source of truth. The simple drop-in is fine.

## Reminders

- The metadata is already right across all twelve files. Resist the urge to change any of it.
- Check the profile fallback specifically. It is easy to test only the homepage and miss that `profiles/[id]` uses the same image.
- Three other icons declared in `app/layout.tsx` are also absent, but they do not matter and are not part of this task. The browser tab icon works, since `app/favicon.ico` exists and Next serves it automatically.

## Instructions

- Branch naming: `fix/og-image/Raineer`.
- PR should include a screenshot of the preview rendering from a link preview checker.

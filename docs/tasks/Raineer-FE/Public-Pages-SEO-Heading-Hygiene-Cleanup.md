# Public Pages Still Render Multiple H1s

## Summary

The public marketing pages still have more than one `<h1>` each, which is the last piece of the on-page SEO markup. A page should have exactly one `<h1>` describing what that page is, with everything below it stepping down through `<h2>` and `<h3>`. Right now the homepage has two and the services page can show three at once. There is also a group of unused files carrying `<h1>`s that keep turning up whenever anyone looks into this.

Separate from the markup, the OpenGraph image every public page references does not exist yet, so link previews come up blank. That now has its own task, Add Missing OG Image For Link Previews, and is not part of this one. The background at the bottom under Assets Still Missing is kept for context.

## Background

The earlier heading work fixed `LandingWhyChoose.tsx` and the three `CodevsProject.tsx` files. Two of those were the right targets, but `LandingWhyChoose.tsx` turned out not to be imported anywhere, so that part had no effect on the live site. These are the components that actually render.

**Homepage** renders two `<h1>`s:

- `_components/landing/AnimatedAdminsSection.tsx` line 20, reached through `LandingAdmins`
- `_components/landing/LandingInternSection.tsx` line 12, imported straight into `page.tsx`

**Services page** can show three, depending on what the visitor has open:

- `services/_components/layout/ServicesHero.tsx` line 11
- `services/_components/layout/ServiceDetailView.tsx` line 109, shown when a service is selected
- `services/_components/layout/ServiceDetailModal.tsx` line 138

**The three marketing modals** each open with an `<h1>`, which lands a second one on whatever page the visitor happens to be on:

- `_components/marketing_modals/MarketingFaqsModal.tsx` line 20
- `_components/marketing_modals/MarketingPrivacyPolicyModal.tsx` line 299
- `_components/marketing_modals/MarketingTermsAndConditionModal.tsx` line 285

**Five files are not imported anywhere and all contain `<h1>`s.** They are why heading audits keep reporting problems that do not exist on the live site:

- `_components/landing/LandingWhyChoose.tsx`
- `_components/landing/LandingMarketing.tsx` and `_components/landing/LandingMarketingCard.tsx`
- `_components/landing/LandingServices.tsx` and `_components/landing/LandingServicesCard.tsx`

`LandingMarketingCard` and `LandingServicesCard` are only used by their two parents, so all five go together.

## Objectives

- Get every public page down to exactly one `<h1>`.
- Keep the visual design unchanged. This is about which tag is used, not how anything looks.
- Remove the unused files so future heading checks only report real problems.

## Expected Behavior

- The homepage has one `<h1>`. The other heading becomes an `<h2>`.
- The services page has one `<h1>` in the hero. The detail view and the modal use `<h2>`.
- Opening a marketing modal does not add a second `<h1>` to the page behind it.
- Headings step down in order, so no `<h3>` appears before an `<h2>` in the same section.
- Nothing changes visually on any of these pages.

## Acceptance Criteria

- [ ] Homepage renders exactly one `<h1>`.
- [ ] Services page renders exactly one `<h1>`, including when a service detail or the modal is open.
- [ ] The three marketing modals no longer use `<h1>`.
- [ ] The five unused files listed above are deleted, and the build still passes.
- [ ] Every other public page still has exactly one `<h1>`, confirmed by checking rather than assumed.
- [ ] No visual change on any page in light or dark mode.

## Solution Hint

Treat these as advisory, not prescriptive.

- Most of these only need the tag swapped from `h1` to `h2` with the same className, since the styling is all in Tailwind classes rather than the tag.
- On the homepage, the intern section reads more like the page's main heading than the admins section does, but you have been in these files more recently so use your judgement on which one keeps the `<h1>`.
- On the services page the hero is clearly the page heading, so that one keeps the `<h1>` and the other two step down.
- For the modals, `<h2>` is usually right. If the modal heading sits inside a section that already has its own heading, `<h3>` fits better.
- Before deleting the five unused files, grep for each filename across the app to confirm nothing imports them. `ServicesGrid.tsx` uses a `require` rather than an import for one of its children, so a plain import search can miss that pattern elsewhere.
- A quick way to check a page is to load it and run `document.querySelectorAll("h1")` in the browser console. It should return one element.

## Reminders

- Check the pages with something open, not just on load. The services detail view and the modals only render after a click, and that is exactly when the extra `<h1>` appears.
- Deleting the five files is the part most likely to break the build, so run a build before opening the PR.
- This is markup only. No metadata, no sitemap, no JSON-LD changes needed here.

## Instructions

- Branch naming: `seo-heading-hygiene/<name>`.
- The PR should list which files changed from `h1` to `h2` or `h3`, which files were deleted, and include the `document.querySelectorAll("h1")` count for the homepage and the services page.

## Assets Still Missing

This part is not frontend work and is not needed to finish the heading task. It is here so it does not get lost, because it is the last thing standing between us and the SEO work being genuinely done.

Every public page declares an OpenGraph and Twitter image:

```
images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "..." }]
```

That covers the homepage, services, careers, codevs, hire-a-codev, contact, profiles, bookacall, ai-integration and privacy-policy, plus `profiles/[id]` which falls back to it when a developer has no photo. There is no `og-image.jpg` anywhere. The `public/` folder holds only `assets/` and `site.webmanifest`.

This is easy to miss because the metadata is correct. The recent `metadataBase` fix is what made these URLs resolve to a full address instead of a broken relative path, so they now point at a real location that returns a 404. Link previews on Facebook, LinkedIn, X, Slack and Discord stay blank until the file exists.

The icon block in `app/layout.tsx` lines 21 to 32 declares a few more files that are also absent, but they matter much less:

- `/apple-touch-icon.png` — only affects the icon when someone adds the site to an iOS home screen
- `/favicon-16x16.png` and `/favicon-32x32.png` — browsers fall back to `favicon.ico`, so nothing visibly breaks
- `/safari-pinned-tab.svg` — only affects pinned tabs in Safari

The browser tab icon itself is fine. `app/favicon.ico` exists and Next serves it at `/favicon.ico` through the App Router convention. `site.webmanifest` is fine too, it points at an SVG under `assets/svgs` that does exist.

So the one that actually needs doing is the OG image. The rest are optional polish, and the three lines could just as reasonably be deleted from `layout.tsx`.

No code changes are needed for any of this. Every page already references the right paths. Dropping the file into `public/` makes it work immediately. The OG image has to be designed at 1200x630, so this needs whoever handles design rather than a developer.

Once the OG image is in place, run the homepage through the Facebook sharing debugger or any link preview checker to confirm it picks up.

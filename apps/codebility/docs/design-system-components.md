# Codebility design system components

These components live in `apps/codebility/components/global/design-system/`. They are the reusable layer for every public page. The visual source of truth is the component library reference image and `components/design-system/DesignSystemPage.tsx`.

## Importing

Import the file that defines the component. There are no barrel files.

```tsx
import { Button } from "@/components/global/design-system/Button";
import { TextField } from "@/components/global/design-system/TextField";
```

Every component is a named export. File names are PascalCase.

## Rules

1. Server-first. Add `"use client"` only when the file uses a hook, Radix, or browser state.
2. No `useEffect`. Derive state, read it during render, and update it in event handlers. Radix owns the interaction state for tabs, accordion, switch and checkbox.
3. Controlled and uncontrolled. Interactive primitives accept `value` / `defaultValue` / `onValueChange` or `checked` / `defaultChecked` / `onCheckedChange`. Do not invent a global store for a primitive.
4. No comments. Names and types carry the meaning.
5. No default exports, no `index.ts`, no files outside the assigned list.
6. Use `cn` from `@codevs/ui` for class composition. Use `cva` from `class-variance-authority` only when a component has real variants.
7. Use `React.forwardRef` for button, input, anchor and Radix trigger elements. The first argument is the native element or Radix element.
8. Use `next/image` for every image. Never use a raw `<img>`.
9. Use `asChild` with Radix `Slot` when a button or link needs to wrap a Next `Link`.
10. Keep the 2px `#6A78F2` focus ring with a 2px offset on every interactive element. Disabled controls keep `disabled:pointer-events-none disabled:opacity-50`.
11. Keep touch targets at least 44px where the control can be tapped. A 24px badge is not a touch control.

## Tokens

| Role | Value |
| --- | --- |
| Page background | `#030303` |
| Solid surface | `#0A0A0A` |
| Elevated surface | `#121214` |
| Primary | `#9747FF` |
| Primary hover | `#8435EA` |
| Primary subtle | `#9747FF` at 18% |
| Focus ring | `#6A78F2` |
| Accent | `#02FFE2` |
| Text | `#F4F4F4` |
| Muted text | `#F4F4F4` at 60% |
| Border | `#F4F4F4` at 10% |
| Success | `#4BCE97` |
| Danger | `#D45454` |
| Warning | `#FBBF24` |

The page font is Outfit. Body copy is 400. UI labels and nav items are 500. Small headings and titles are 600. Display headings are 700.

## Components

| File | Export | Variants and key props |
| --- | --- | --- |
| `Button.tsx` | `Button` | `primary`, `outline`, `ghost`; `sm` 40px, `md` 48px; `asChild` |
| `IconButton.tsx` | `IconButton` | `outline`, `ghost`, `primary`; required `label`; 40px |
| `TextLink.tsx` | `TextLink` | accent text link, `disabled`, `asChild` |
| `TextField.tsx` | `TextField` | label, help, error, native input props; default, focus, error, disabled |
| `Textarea.tsx` | `Textarea` | same field API; 96px |
| `Chip.tsx` | `Chip` | `selected`, `sm` / `md` |
| `Search.tsx` | `Search` | controlled or uncontrolled value, `onSearch`, Find button |
| `CheckboxCard.tsx` | `CheckboxCard` | Radix checkbox, controlled or uncontrolled, disabled |
| `Switch.tsx` | `Switch` | Radix switch, `sm` / `md`, label, description, controlled or uncontrolled |
| `Eyebrow.tsx` | `Eyebrow` | `solid` / `outline` pill |
| `RoleBadge.tsx` | `RoleBadge` | `admin`, `mentor`, `codev` |
| `StatusBadge.tsx` | `StatusBadge` | `available`, `busy` |
| `TechTag.tsx` | `TechTag` | blue technology tag |
| `CountBadge.tsx` | `CountBadge` | count, optional max |
| `VerifiedBadge.tsx` | `VerifiedBadge` | verified icon and label |
| `Avatar.tsx` | `Avatar` | 32, 40, 56, 72; violet, teal, cyan; photo or initials; online dot |
| `AvatarStack.tsx` | `AvatarStack` | items, max visible, total, overlap |
| `Rating.tsx` | `Rating` | value, max, display only |
| `IconTile.tsx` | `IconTile` | `primary` / `glass`, `square` / `circle` |
| `NavItem.tsx` | `NavItem` | link, `active`, `asChild` |
| `Tabs.tsx` | `Tabs`, `TabsList`, `Tab`, `TabsContent` | Radix tabs, segmented pill bar, counts |
| `CategoryItem.tsx` | `CategoryItem` | icon, label, count, `active` |
| `Accordion.tsx` | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | Radix accordion, single open item, plus and minus icons |
| `Step.tsx` | `Step` | `done`, `active`, `upcoming`; optional `meta` label |
| `CarouselPager.tsx` | `CarouselPager` | page, pageCount, previous and next |
| `NavigationDesktop.tsx` | `NavigationDesktop` | links, active href, search trigger, sign in, CTA |
| `NavigationMobile.tsx` | `NavigationMobile` | wordmark, menu button |
| `MenuGlyph.tsx` | `MenuGlyph` | three-bar menu icon |
| `ServiceCard.tsx` | `ServiceCard` | eyebrow, title, description, icon, media image, optional CTA |
| `StatCard.tsx` | `StatCard` | value, label, description, icon |
| `MemberCard.tsx` | `MemberCard` | initials, name, role, badge slot, gradient, footer |
| `DeveloperCard.tsx` | `DeveloperCard` | avatar, name, role, skills, availability, profile link |
| `QuoteCard.tsx` | `QuoteCard` | quote, person, rating, pager |
| `CTACard.tsx` | `CTACard` | eyebrow, title, description, action link |
| `LogoCell.tsx` | `LogoCell` | `default` / `accent` cell wrapper |
| `ClientLogo.tsx` | `ClientLogo` | all 12 partner marks from `public/assets/images/partners` |
| `SectionHeader.tsx` | `SectionHeader` | eyebrow, `eyebrowVariant`, title, gradient accent, description, actions, alignment |
| `Wordmark.tsx` | `Wordmark` | Codebility wordmark |
| `ProjectCard.tsx` | `ProjectCard` | project image, title, description, tag, live status, view project; `default` / `minimal` |
| `MemberChip.tsx` | `MemberChip` | photo or initials, name, role, selected state |
| `FeatureCard.tsx` | `FeatureCard` | icon, title, description; compact feature panel |
| `SkillCategoryCard.tsx` | `SkillCategoryCard` | icon, category title, technology tags |
| `JobListingRow.tsx` | `JobListingRow` | job title, description, tags, posted date, active row |
| `ProfileCard.tsx` | `ProfileCard` | compact or tall profile card; photo or initials, role, skills, badge, profile and social links |
| `MetricCard.tsx` | `MetricCard` | compact metric with icon, gradient value, label and description |

## Verification

From `apps/codebility`:

```bash
pnpm.cmd exec eslint components/global/design-system
pnpm.cmd --filter codebility typecheck
```

The dev server is for visual review. Run lint and typecheck after every component change.

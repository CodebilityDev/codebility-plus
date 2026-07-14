# Portal UI/UX Consistency & Accessibility Pass

## Summary

The Codebility portal (`apps/codebility/app/home/**`) has grown quickly and accumulated UI/UX inconsistencies that hurt polish and accessibility: many data-driven views lack loading and empty states, several components hardcode dark colors instead of using the theme/design-system tokens (so they look broken in light mode), and a number of icon-only buttons have no accessible label. This task is a focused, presentation-layer consistency pass across the portal to bring these up to a consistent standard using the existing `@codevs/ui` design system and `next-themes`.

This is **presentation-layer only** — no data model, server action, or query-logic changes.

> Note: this is the larger sprint task for Raineer and runs alongside his two smaller standalone fixes (the Kanban ticket-modal responsive fix and the home-page loader enhancement). Those can be folded into this pass or shipped separately.

## Technical Context & Confirmed Anchors

- **Theme inconsistency (confirmed pattern):** several pages hardcode dark palette classes (e.g. `bg-neutral-900`, `text-neutral-400`) instead of design-system/theme tokens, so they don't respond to light mode. A clear example is the appointments admin page (`app/home/admin-controls/appointments/`), reviewed and found to hardcode dark colors with no `next-themes` support. Use the design system's themable tokens (the way the main Add-Members list and other `@codevs/ui` components do).
- **Loading / empty states:** many `"use client"` views fetch data without a skeleton/spinner or a graceful empty state. Catalogue these during the audit (kanban task views, my-team grids, feeds, member selection modals are reported starting points — confirm each).
- **Accessibility:** icon-only buttons (using `lucide-react` icons with no text) frequently lack `aria-label`. Add labels so screen readers and tests can identify them.
- **Design system:** prefer existing primitives from `@codevs/ui` and the shared Tailwind config; do not introduce new one-off styles where a tokenized component exists.

> Because specific instance lists drift, **start with an audit** (Sprint 1) that produces the concrete worklist, rather than treating any single reported file as gospel.

## Objectives

- Add consistent **loading states** (skeletons/spinners) to data-driven portal views that currently render nothing or jump on load.
- Add graceful **empty states** (icon + message) to lists/grids/tables that can be empty.
- Replace **hardcoded dark-only colors** with theme/design-system tokens so every audited view renders correctly in **both light and dark** themes.
- Add **`aria-label`** (or visually-hidden text) to icon-only buttons and controls that lack an accessible name.
- Keep everything within the existing `@codevs/ui` design system and Tailwind conventions — consistency, not new visual language.

## Sprint Plan (1 fortnightly sprint)

- **Week 1:** Audit the `app/home/**` surface and produce a concrete worklist (a checklist of views needing loading states, empty states, theme fixes, and a11y labels). Then fix the highest-traffic areas: dashboard, kanban, my-team. Establish/confirm reusable skeleton + empty-state components so fixes are consistent.
- **Week 2:** Work through the remaining views (settings, applicants, feeds, overflow, admin-controls incl. the appointments theme fix), add the a11y labels, and do a light/dark + responsive verification pass across everything touched.

## Expected Behavior

- Data-driven views show a loading indicator while fetching and a clear empty state when there's no data — no blank flashes or layout jumps.
- Every audited view renders correctly in light and dark mode; no hardcoded dark-only colors remain in the touched files.
- Icon-only buttons have accessible names.
- No change to what data is shown or how features behave — visual/accessibility polish only.

## Acceptance Criteria

- An audit worklist is produced and tracked (so coverage is explicit, not implied).
- The audited views have appropriate loading and empty states using shared/reusable components.
- Touched views render correctly in both light and dark themes (verified by toggling), with no remaining hardcoded dark-only palette classes in those files.
- Icon-only buttons/controls in the touched views have `aria-label`s (or equivalent accessible names).
- Responsive check on touched views (mobile/tablet/desktop) shows no overflow or layout breakage.
- No functional/data regressions; this is presentation-layer only.
- Before/after screenshots (light + dark) attached to the PR for representative views.

## Reminders

- Presentation layer only — do not modify data fetching, server actions, or query logic.
- Reuse `@codevs/ui` primitives and shared Tailwind tokens; avoid one-off styles.
- Perform comprehensive testing (light/dark + responsive) before PR.

## Instructions

- Branch: `portal-ui-consistency-pass/raineer`. One PR per phase is recommended; keep PRs reviewable.
- Comprehensive PR description with the audit worklist and before/after screenshots. Request team-lead review. Maintain Kanban status.

## Got any questions?

Reach out to your assigned team lead via the team group chat.
</content>

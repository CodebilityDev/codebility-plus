# Kanban Ticket Modal — Responsive Layout Fix

**Assigned to:** Raineer Dela Rita (`delaritaraineer81`) · **Branch:** `kanban-ticket-modal-responsive-fix/raineer`

## Summary

The **task/ticket modal** in the Kanban board (opened via a task card, URL `…/home/kanban/[projectId]/[id]?taskId=…`) does not fit within shorter viewports. On a typical laptop display (e.g. **1366×768**, where usable browser height is only ~625–700px after the address bar and OS chrome), the modal grows taller than the screen and — because the dialog is vertically centered — its content **spills off both the top and the bottom of the viewport**. The result is that the **close (✕) button at the top is hidden** and the **action buttons at the bottom of the modal are hidden**, leaving the user unable to close the modal or submit/save without an external workaround (resizing the window, browser zoom-out, etc.).

This task makes the ticket modal fully responsive so that the close button and all footer action buttons remain visible and reachable on **all viewport sizes**, with the modal body scrolling internally rather than the whole modal overflowing the screen.

## Technical Context

All three modals live in `apps/codebility/app/home/kanban/[projectId]/[id]/_components/tasks/`. The project's custom breakpoints (`phone`/`tablet`/`laptop`/`desktop`, defined in `apps/codebility/tailwind.config.ts`) are **max-width** ranges (≤425 / ≤767 / ≤1024 / ≤1280), so at the reported **1366px** width none of them apply — only the **base** (and default `sm:`, which is preserved via `extend`) classes are in effect. That is what exposes the bug.

**Affected — fix required:**

- **`TaskViewModal.tsx`** (`DialogContent`, ~line 688): className is `h-auto max-h-[90vh] … sm:max-h-[900px]`. The `sm:max-h-[900px]` (applies ≥640px) **overrides** the `max-h-[90vh]` cap, so on any screen wider than 640px but shorter than 900px (all standard laptops) the content-sized (`h-auto`) modal exceeds the viewport. Centered → ✕ (top) and footer buttons (bottom) are clipped. **This is the reported defect.**
- **`TaskAddModal.tsx`** (`DialogContent`, ~line 721): className is `phone:h-full tablet:h-full … h-auto max-h-[900px]`. The full-screen `phone:`/`tablet:` rules only cover ≤767px; at 1366px the base `h-auto max-h-[900px]` applies with **no `vh` cap at all**, producing the same clipping. Same fix applies.

**Not affected — verify only:**

- **`TaskEditModal.tsx`** (`DialogContent`, ~line 461): className is `… laptop:h-[90vh] laptop:max-h-[800px] h-[95vh] max-h-[900px]`. The base `h-[95vh]` ties height to the viewport (≈730px on a 768px screen, under the 900px cap), so it stays on-screen at all widths. This is the pattern the other two should adopt. Optional polish: it still scrolls the whole `DialogContent` rather than pinning the footer — folding it into the fixed-header/scrollable-body/fixed-footer restructure would make all three consistent.

## Objectives

- Ensure the ticket modal's **height is always capped to the viewport** (e.g. `max-h-[90vh]` / `max-h-[90dvh]`) at **every** breakpoint — remove or correct the fixed `sm:max-h-[900px]` override that lets it exceed short screens.
- Restructure the modal into a **fixed header / scrollable body / fixed footer** layout (flex column) so that:
  - the **close (✕) button** stays pinned and visible at the top, and
  - the **action buttons** stay pinned and visible at the bottom,
  - regardless of how much content the body holds.
- Make the **modal body the only scrollable region** (internal scroll), instead of the entire modal overflowing the page.
- Verify and align the same behavior across the **Add / View / Edit** task modals if they share the layout.
- Preserve existing functionality — all fields, dropdowns (Priority, Difficulty, Skill Category, Deadline), PR Link, Primary Assignee, Description, and the save/cancel/close actions must continue to work unchanged. This is a **layout/presentation fix only**.

## Expected Behavior

- Opening a ticket on a **1366×768** laptop shows the modal fully within the viewport: the ✕ button is visible at the top and the action buttons are visible at the bottom **without scrolling the page**.
- When the ticket content is taller than the available space, **only the modal body scrolls**; the header (with ✕) and footer (action buttons) remain fixed and visible.
- The close button is always clickable, and all footer buttons are always reachable, on small (mobile), medium (tablet), and large (desktop) viewports, and on short laptop heights.
- No horizontal overflow or layout shift is introduced at any breakpoint.
- The modal continues to render correctly in both **light and dark themes**.

## Acceptance Criteria

- On a 1366×768 viewport (and other short-height laptop resolutions), the ticket modal's close (✕) button and bottom action buttons are both fully visible and operable without resizing the window or zooming out.
- The modal's overall height never exceeds the viewport; when content overflows, the **body scrolls internally** while the header and footer stay pinned.
- The fix is verified across representative widths — mobile (~375px), tablet (~768px), laptop (1366px), and desktop (≥1920px) — with no clipped controls, no page-level overflow, and no horizontal scrollbar.
- Behavior is consistent across the **Add**, **View**, and **Edit** task modals (whichever share this layout).
- The modal renders correctly in both light and dark themes.
- All existing fields, inputs, dropdowns, and the save/cancel/close actions function exactly as before — no regressions to data entry or persistence.

## Reminders

- Perform comprehensive testing on implemented changes before you proceed to pull request (PR) submission. **Test specifically at 1366×768** (the reported failing case), and confirm the fix at small/medium/large widths.
- This is a **presentation-layer change**. Do **not** modify the task data model, the server actions that persist tasks, or the data passed into the modal.
- Attach before/after screenshots at 1366×768 demonstrating that the close button and footer buttons are now visible.

## Instructions

- Adhere to branch naming convention: `task-name/your-name`. Commit all relevant code changes to this branch before creating pull request.
- Include comprehensive description in pull request that clearly documents all code changes and their purpose. Attach before/after screenshots at the failing resolution (1366×768) plus at least one mobile-width screenshot.
- Request review from assigned team lead when submitting pull request.
- Maintain task status by moving cards to appropriate Kanban columns as work progresses.

## Got any questions?

For any questions, don't hesitate to ask your assigned team lead. You may reach out via messenger team group chat.
</content>

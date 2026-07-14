# Home Page Loader — Status Bar Repositioning

**Assigned to:** Raineer Dela Rita (`delaritaraineer81`) · **Branch:** `home-page-loader-enhancement/raineer`

## Summary

The home page loading animation (`PageLoadingAnimation`) displays a hexagonal "polygon" with the Codebility logo spinning at its center, accompanied by a **loading status group** — a typewriter status line ("Initializing quantum framework…"), a holographic **progress bar**, and the CPU/GPU/RAM status indicators.

Currently, this status group does not sit cleanly **below** the polygon. Instead it visually drifts to the **lower-right** of the hexagon (see reference screenshot `c:\dev\sc2.png`), so the progress bar and text appear off-center and detached from the logo rather than centered directly beneath it.

This task repositions the loading status group so it is **centered directly below the polygon**, giving the loader a balanced, vertically-stacked appearance (polygon on top, status text + progress bar + indicators centered underneath).

## Technical Context

- **Component:** `apps/codebility/app/home/_components/PageLoadingAnimation.tsx`
- **Likely root cause:** the status group (the `motion.div` around **line 248**) is positioned `absolute -bottom-20 left-1/2 -translate-x-1/2` **relative to the hexagon container**, which is only ~128px wide (`w-32`, line 117). Its contents are much wider than that anchor:
  - the typewriter line uses `whitespace-nowrap` ("Initializing quantum framework…", line ~263),
  - the progress bar is `w-48 sm:w-56 md:w-64` (192–256px, line ~268).
  Because these overflow the narrow 128px anchor, they spill **rightward** instead of centering — which is why the group reads as "lower-right of the polygon."
- **Suggested direction:** stop anchoring the status group to the narrow hexagon box. Either (a) restructure the loader's main container into a vertical `flex flex-col items-center` stack so the polygon and the status group are siblings that naturally center, with normal vertical spacing between them; or (b) keep absolute positioning but anchor it to the **full-size outer container** (`absolute inset-0 …`, line 32) with a properly centered, fixed-width wrapper. Approach (a) is cleaner and avoids the overflow math.

## Objectives

- Position the loading status group (typewriter text, progress bar, status indicators) so it is **horizontally centered directly below the polygon**.
- Ensure the polygon and the status group form a clean **vertical stack** with consistent spacing, rather than the status group overlapping or drifting beside the polygon.
- Preserve all existing visual elements and animations — the hexagon ring, triple-ring spinner, glitch/rotating logo, particles, scan line, matrix rain, corner accents, the typewriter effect, the animated progress bar, and the CPU/GPU/RAM indicators should all remain.
- Keep the layout responsive: the centered-below arrangement must hold on mobile, tablet, and desktop without overflow, horizontal scroll, or the status group colliding with the polygon.

## Expected Behavior

- On any screen size, the loader shows the polygon (logo inside) centered, with the status text, progress bar, and indicators centered **immediately below it**.
- The progress bar and typewriter text are visually centered under the polygon — not offset to one side.
- No content overflows the viewport horizontally; the loader remains centered as a whole within the content area.
- All existing animations continue to play as before.

## Acceptance Criteria

- The loading status group (text + progress bar + indicators) renders centered directly beneath the polygon, matching a clean vertical-stack layout (verified against the intent of `c:\dev\sc2.png`, where it currently sits lower-right).
- No horizontal offset/drift of the status group relative to the polygon at any breakpoint.
- The arrangement is verified on mobile (~375px), tablet (~768px), and desktop (≥1366px) — centered, no overflow, no horizontal scrollbar.
- All pre-existing loader animations and elements are preserved and still animate correctly.
- The loader renders correctly in both light and dark themes (it is dark-gradient based; confirm no regression).

## Reminders

- Perform comprehensive testing on implemented changes before you proceed to pull request (PR) submission. Compare against `c:\dev\sc2.png` and attach a before/after screenshot.
- This is a **presentation-layer / layout change** to the loader only. Do not change where or when the loader is mounted, or any data/loading logic.

## Instructions

- Adhere to branch naming convention: `task-name/your-name`. Commit all relevant code changes to this branch before creating pull request.
- Include comprehensive description in pull request that clearly documents all code changes and their purpose. Attach before/after screenshots showing the status group centered below the polygon.
- Request review from assigned team lead when submitting pull request.
- Maintain task status by moving cards to appropriate Kanban columns as work progresses.

## Got any questions?

For any questions, don't hesitate to ask your assigned team lead. You may reach out via messenger team group chat.
</content>

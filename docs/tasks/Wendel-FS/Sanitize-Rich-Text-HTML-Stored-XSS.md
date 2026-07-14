# Sanitize Rich-Text HTML to Close Stored XSS in Kanban Tasks

## Summary

Kanban task descriptions are written by project members in a rich-text editor, saved to the database, and later rendered as raw HTML with no sanitization. That means a member can put active markup into a task description — for example an image tag with an `onerror` handler — and it will run as script in the browser of every other member (including admins) who opens that task. This is a stored cross-site scripting (XSS) hole. The page that shows announcements has the same raw-HTML rendering for its content.

There is currently no HTML sanitizer anywhere in the app — neither `dompurify`/`isomorphic-dompurify` nor `sanitize-html` is a dependency — so every place that renders stored HTML is unprotected.

## Background

Task descriptions are authored through the TipTap editor (`KanbanRichTextEditor.tsx`) and stored as HTML on the task record. They are then rendered straight into the DOM via `dangerouslySetInnerHTML` in these spots:

- `app/home/kanban/[projectId]/[id]/_components/kanban_modals/KanbanRichTextDisplay.tsx` — renders `content` (the task description), used by `TaskViewModal.tsx`.
- `app/home/kanban/[projectId]/[id]/_components/kanban_modals/KanbanAddModalMembers.tsx` — renders `task?.description` directly.
- `app/home/announcements/AnnouncementContent.tsx` — renders `page.content` (announcement body, authored by admins, lower severity but same class of bug).

None of these run the HTML through a sanitizer first, so any `<script>`, `<img onerror=...>`, `<iframe>`, `<a href="javascript:...">`, or inline event handler in the stored value executes when the content is viewed.

Note: the `dangerouslySetInnerHTML` usages inside `TicketPreviewSidebar.tsx` and `InHousePreviewSidebar.tsx` are hardcoded CSS keyframes (`<style>` blocks), not user input — leave those alone, they are not a risk.

## Objectives

- Add a single HTML sanitization utility and run all stored/user-authored HTML through it before it is rendered.
- Close the stored XSS on Kanban task descriptions (the highest-risk path, since any project member can author it).
- Apply the same sanitization to the announcements content render.
- Keep legitimate rich-text formatting working (bold, italics, lists, links, headings) — sanitize, don't strip everything.

## Expected Behavior

- A task description containing markup like `<img src=x onerror=alert(1)>` or `<script>...</script>` renders as inert/escaped content — no script executes when another member opens the task.
- Normal formatting produced by the editor (bold, italic, lists, links, headings, line breaks) still displays correctly.
- Announcement content renders with the same protection.
- Links in sanitized content can't use dangerous schemes (no `javascript:` URLs).

## Acceptance Criteria

- [ ] A sanitizer dependency is added and a shared helper exists (e.g. one `sanitizeHtml` utility) that both Kanban and announcements use — no copy-pasted config.
- [ ] `KanbanRichTextDisplay` sanitizes its `content` before rendering.
- [ ] `KanbanAddModalMembers` sanitizes `task?.description` before rendering (or reuses the display component).
- [ ] `AnnouncementContent` sanitizes `page.content` before rendering.
- [ ] A task description with a known XSS payload (`<img src=x onerror=...>`, `<script>`, `javascript:` link) does not execute and is neutralized when viewed.
- [ ] Existing well-formed rich text from the editor still renders with formatting intact.
- [ ] The hardcoded `<style>` keyframe blocks in `TicketPreviewSidebar` / `InHousePreviewSidebar` are left unchanged.

## Solution Hint

Treat these as advisory, not prescriptive.

- Add `isomorphic-dompurify` (works in both server and client components) or `dompurify` for client-only use, and create a small `sanitizeHtml(html: string)` helper with an allowlist that matches what the TipTap editor can produce (formatting tags, lists, links, headings) and drops scripts, event handlers, and dangerous URL schemes.
- The cleanest path is to sanitize inside `KanbanRichTextDisplay` (one chokepoint) and have `KanbanAddModalMembers` reuse that component instead of its own `dangerouslySetInnerHTML`.
- Decide whether to also sanitize on write (when the description is saved) in addition to on render. Sanitizing on render is the must-have; sanitizing on save as well is good defense in depth.

## Reminders

- Test with real payloads: create/edit a task whose description contains `<img src=x onerror=alert(1)>`, a `<script>` tag, and an `<a href="javascript:alert(1)">` link, then open it in the task view modal and confirm nothing executes.
- Confirm an ordinary formatted description (bold, bullet list, link, heading) still looks right after the change.
- Check both the task view modal and the add-members modal paths, since both render the description.

## Instructions

- Branch off `dev`, e.g. `fix/sanitize-richtext-xss`.
- Open the PR against `dev` with a short, factual description of the vulnerability and the fix.

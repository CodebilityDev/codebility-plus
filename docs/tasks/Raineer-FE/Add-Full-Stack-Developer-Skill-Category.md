# Add "Full Stack Developer" to the Skill Category Dropdown

## Summary

The Skill Category dropdown in the Kanban "Add New Task" modal lists Backend Developer, Frontend Developer, Mobile Developer, Project Manager, QA Engineer, and UI/UX Designer — but is missing **Full Stack Developer**. Several team members are Full Stack developers, so tasks can't currently be categorized to them. This task adds "Full Stack Developer" as a selectable skill category.

## Background

The dropdown is data-driven, not hardcoded. Kanban tasks store a `skill_category_id` foreign key and read `skill_category:skill_category_id (id, name)` from the `skill_categories` table (see `app/home/kanban/[projectId]/[id]/actions.ts`). So the dropdown is populated from the `skill_categories` table — adding a row there makes the option appear automatically wherever the dropdown is rendered (task add and edit modals).

## Objectives

- Add a "Full Stack Developer" entry to the `skill_categories` table so it shows in the Skill Category dropdown.
- Make sure the new category behaves like the existing ones everywhere the skill category is used (task create/edit, and the points/gamification lookups keyed on `skill_category_id`).

## Expected Behavior

- "Full Stack Developer" appears as an option in the Skill Category dropdown in both the Add New Task and Edit Task modals.
- A task can be created and edited with "Full Stack Developer" selected, and it persists and displays correctly.
- Points/leaderboard logic that reads `skill_category_id` handles the new category without errors.

## Acceptance Criteria

- [ ] "Full Stack Developer" is selectable in the Skill Category dropdown (add + edit task).
- [ ] Creating a task with it saves the correct `skill_category_id` and renders the category name back.
- [ ] Editing an existing task to "Full Stack Developer" works and persists.
- [ ] No errors in the points/`codev_points` lookups that use `skill_category_id`.
- [ ] Option ordering looks intentional (e.g., grouped/alphabetical with the other developer categories).

## Solution Hint

Treat these as advisory, not prescriptive.

- Primary change is data: insert a row into `skill_categories` with `name = "Full Stack Developer"` (match the shape of the existing rows — populate any columns the others have, e.g. a `description` or default points config if present). Do it via a proper migration under `supabase/migrations/` (preferred, so it's reproducible), or directly in Supabase if the team applies data changes that way.
- Before inserting, check the existing rows: `SELECT * FROM skill_categories ORDER BY id;` — copy whatever non-null fields the other developer categories set so the new one is consistent.
- Confirm the dropdown truly reads from the table (fetch of `skill_categories`) and isn't also filtered/hardcoded anywhere; if there's a hardcoded list or an allow-list, add it there too.
- If the gamification system expects per-category point weights, add the same config for the new category so task points calculate correctly.

## Reminders

- This is mostly a data addition; keep the new row consistent with the existing skill categories.
- Test in both the Add and Edit task modals.

## Instructions

- Branch naming: `add-fullstack-skill-category/<name>`.
- If done as a migration, name it `YYYYMMDD_add_fullstack_skill_category.sql` and note in the PR whether it also needs to be applied to the production `skill_categories` table.

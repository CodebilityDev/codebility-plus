# In-House Filter Dropdowns Are Not in Alphabetical Order

## Summary

On the In-House Codebility page, the Project filter dropdown lists projects in no particular order. With the number of projects we have now, finding a specific one means reading through the whole list. QA raised this and asked for it to be alphabetical. The Position and Role dropdowns in the same filter panel have the same problem.

## Background

The filter panel fetches its dropdown options straight from Supabase in `app/home/in-house/_components/table/table-filters.tsx`:

- Projects are fetched with no ordering, so they come back in whatever order the database happens to return them. That is why the dropdown currently reads Sariverse, TapUp, Rafiki, MN + LA, Bucktrack, Eribe and so on instead of an alphabetical list.
- Display positions are collected into a distinct set and rendered as they come out of that set, also unordered.
- Roles are fetched without ordering.

The same feature already gets this right in one place. `app/home/in-house/_components/shared/ProjectSelect.tsx` fetches projects with `.order("name")`, so its list comes out alphabetical. The filter panel just never got the same treatment.

One thing to watch: the filter panel is rendered twice in that file, once for mobile and once for desktop, and there is a Project dropdown in each. Both read from the same `projects` state, so sorting the data once covers both.

## Objectives

- Show the Project filter options in alphabetical order.
- Apply the same ordering to the Position and Role dropdowns so the whole panel behaves consistently.
- Keep the "All ..." entry at the top of each dropdown as the default option.

## Expected Behavior

- Opening the Project dropdown shows projects sorted A to Z.
- Position and Role dropdowns are sorted the same way.
- "All Projects", "All Display Positions" and "All Roles" stay as the first item, above the sorted list.
- Sorting is case-insensitive, so a project entered in lowercase is not pushed to the bottom of the list.
- Choosing a filter still filters exactly as it does today.

## Acceptance Criteria

- [ ] Project dropdown is alphabetical in both the mobile and desktop layouts.
- [ ] Position and Role dropdowns are alphabetical.
- [ ] The "All ..." option is still the first item in each dropdown.
- [ ] Ordering is case-insensitive.
- [ ] Filter results are unchanged, only the order of the options is different.
- [ ] No change to the member cards or table below the filter panel.

## Solution Hint

Treat these as advisory, not prescriptive.

- The smallest fix is to order at the query, since that is what is missing:

  ```
  .from("projects").select("id, name, start_date").order("name")
  ```

- Roles can be handled the same way.

- Display positions are built from a `Set` in the same file, so they need sorting after the set is built. `localeCompare` handles casing and accented characters better than a plain comparison:

  ```
  distinctPositions.sort((a, b) => a.localeCompare(b))
  ```

- Postgres sorts case-sensitively by default, so uppercase names can end up ahead of lowercase ones. If the project names have mixed casing and the query-level sort still looks wrong, sort in the component with `localeCompare` after the fetch instead.

## Reminders

- Check both layouts. The filter panel is rendered twice in the file and it is easy to fix only the one you can see on your screen.
- Test on the Active and the Inactive tab, both use this panel.
- This is a display-order change only. No database work, no server action changes, no new queries.

## Instructions

- Branch naming: `in-house-filter-sort/<name>`.
- The PR should say which dropdowns were sorted and include a before and after screenshot of the Project filter.

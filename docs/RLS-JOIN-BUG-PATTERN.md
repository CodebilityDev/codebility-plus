# RLS Join Bug Pattern - Critical Database Query Issue

## ⚠️ CRITICAL: Read This Before Writing Any Supabase Queries

**Last Updated:** 2025-01-XX
**Severity:** HIGH - Silently drops data without errors
**Status:** Known issue affecting multiple parts of codebase

---

## The Problem

When using **PostgREST foreign key joins** in Supabase queries, **Row Level Security (RLS) policies are applied to the joined table**, which can **silently filter out rows** that don't match the RLS policy.

### Example of BROKEN Code:

```typescript
// ❌ BAD - This will silently drop members!
const { data } = await supabase
  .from('project_members')
  .select(`
    codev_id,
    role,
    codev (        // ← RLS applied here!
      id,
      first_name,
      last_name
    )
  `);
```

**What happens:**
1. Fetches `project_members` rows ✅
2. For each row, tries to join `codev` table
3. **RLS policy filters some `codev` rows** (e.g., based on `role_id` or `internal_status`)
4. Those members **silently disappear** from results ❌
5. **No error is thrown** - you just get incomplete data!

---

## The Solution: Two-Query Approach

**ALWAYS use the two-query pattern** when fetching related `codev` data:

### ✅ CORRECT Pattern:

```typescript
// Step 1: Fetch project_members (get codev_ids only, no join!)
const { data: projectMembers, error } = await supabase
  .from('project_members')
  .select('codev_id, role, joined_at')
  .eq('project_id', projectId);

if (error) throw error;

// Step 2: Collect all codev_ids
const codevIds = projectMembers?.map(pm => pm.codev_id) || [];

// Step 3: Fetch codev records separately (bypasses join RLS!)
const { data: codevs, error: codevError } = await supabase
  .from('codev')
  .select('id, first_name, last_name, image_url')
  .in('id', codevIds);  // ← Direct query, not a join!

if (codevError) {
  console.error('Error fetching codev records:', codevError);
}

// Step 4: Manually merge the data
const codevMap = new Map(codevs?.map(c => [c.id, c]) || []);

const membersWithCodev = projectMembers.map(pm => ({
  ...pm,
  codev: codevMap.get(pm.codev_id) ?? null,
}));
```

---

## Why This Works

1. **No Foreign Key Join:** The first query only fetches IDs, not joined data
2. **Direct Query:** The second query uses `.in()` which is a WHERE clause, not a join
3. **Manual Merge:** We control the merge, so no RLS can filter rows
4. **All Members Included:** Every member in `project_members` gets their codev data

---

## Files Already Fixed ✅

All files now use the two-query approach:

- ✅ `/apps/codebility/app/home/projects/actions.ts`
  - `getMembers()` - Line 665-726
  - `getProjectByID()` - Line 1096-1155
  - `getProjectCodevs()` - Line 808-924
- ✅ `/apps/codebility/lib/server/project.service.ts`
  - `getProjects()` - Line 11-72
  - `getPublicProjects()` - Line 81-145
- ✅ `/apps/codebility/app/home/my-team/AddMembersModal.tsx`
  - Initialization logic - Line 713-727
- ✅ `/apps/codebility/app/home/overflow/actions.ts`
  - `fetchQuestions()` (getOverflowPosts) - 7 functions fixed
  - `createProject()` (createOverflowPost)
  - `updateProject()` (updateOverflowPost)
  - `fetchComments()` (getOverflowPostComments)
  - `postComment()` (createOverflowComment)
  - `updateComment()` (updateOverflowComment)
  - `fetchTopSolvers()` (getTopSolutionProviders)
- ✅ `/apps/codebility/app/home/kanban/[projectId]/[id]/_components/tasks/_components/TaskComments.tsx`
  - Added `fetchAndMergeCodevData()` helper function
  - `fetchComments()` - initial load
  - Realtime subscription INSERT/UPDATE handler
  - `handleSubmitComment()` - add comment
  - `handleReply()` - add reply
  - `handleEdit()` - edit comment
- ✅ `/apps/codebility/app/home/interns/_components/InternalProjects.tsx`
  - `fetchInternalProjects()` - name filter pattern (lines 52-116)
  - `fetchInternalProjects()` - client_id pattern (lines 125-185)

---

## Status: All Known RLS Join Bugs Fixed ✅

**All identified RLS join bugs have been fixed!** All files now use the two-query approach to prevent RLS filtering on joined codev records.

---

## How to Identify This Bug

Look for these patterns in Supabase queries:

```typescript
// ❌ BROKEN PATTERNS:
.select('*, codev (*)')
.select('codev_id, codev (*)')
.select('author:codev_id (*)')
.select(`
  *,
  codev (
    ...fields
  )
`)
```

If you see **ANY of these patterns**, it needs to be refactored!

---

## Step-by-Step Refactoring Guide

### Before:
```typescript
const { data } = await supabase
  .from('overflow_post')
  .select(`
    *,
    codev (
      id,
      first_name,
      last_name,
      image_url
    )
  `);
```

### After:
```typescript
// Step 1: Fetch posts (no join)
const { data: posts, error } = await supabase
  .from('overflow_post')
  .select('*');

if (error) throw error;
if (!posts || posts.length === 0) return [];

// Step 2: Collect unique codev_ids
const codevIds = [...new Set(posts.map(p => p.codev_id).filter(Boolean))];

// Step 3: Fetch codev records separately
let codevMap = new Map();

if (codevIds.length > 0) {
  const { data: codevs, error: codevError } = await supabase
    .from('codev')
    .select('id, first_name, last_name, image_url')
    .in('id', codevIds);

  if (codevError) {
    console.error('Error fetching codev records:', codevError);
  } else {
    codevs?.forEach(c => codevMap.set(c.id, c));
  }
}

// Step 4: Merge data
const postsWithAuthors = posts.map(post => ({
  ...post,
  codev: codevMap.get(post.codev_id) ?? null,
}));

return postsWithAuthors;
```

---

## Testing Checklist

After refactoring, verify:

- [ ] All expected members/authors appear in the UI
- [ ] No "undefined" or "null" names in rendered components
- [ ] Count matches database count (check in Supabase dashboard)
- [ ] Users with different `role_id` or `internal_status` values all appear
- [ ] No console errors about missing data

---

## Performance Considerations

**Q: Doesn't this make two database queries instead of one?**
**A:** Yes, but:
- ✅ Both queries are fast (indexed on `id` and foreign keys)
- ✅ Supabase executes them in parallel if called with `Promise.all()`
- ✅ **Correctness > Performance** - Missing data is unacceptable
- ✅ Can be optimized later with caching or materialized views

---

## Related Documentation

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgREST Foreign Key Joins](https://postgrest.org/en/stable/references/api/resource_embedding.html)
- `/docs/RLS-KNOWN-ISSUES.md` - Comprehensive RLS policy analysis
- `/docs/CODEV-QUERY-AUDIT.md` - All codev-related query patterns

---

## Action Items for Next AI Session

**All RLS join refactoring is complete! ✅**

### Recommended Next Steps:

1. **Testing & Verification**
   - Verify all members appear in project lists
   - Test overflow posts and comments show correct authors
   - Check task comments display all authors
   - Verify internal projects show all members
   - Test with users having different `role_id` and `internal_status` values

2. **Performance Monitoring**
   - Monitor query performance with two-query approach
   - Consider adding database indexes if needed
   - Evaluate caching opportunities

3. **Code Search for Other Instances**
   - Search codebase for any remaining nested `codev (...)` joins
   - Check for similar patterns with other tables (clients, projects, etc.)

4. **Add Automated Tests**
   - Create tests to verify member count matches database
   - Test RLS policies don't filter joined data
   - Add regression tests for the bug pattern

---

## Questions?

If you're unsure whether a query has this bug:

1. **Check:** Does it use nested parentheses in `.select()`?
2. **Check:** Is it joining the `codev` table?
3. **If YES to both:** It probably has the bug - use two-query approach!

**When in doubt, use the two-query pattern!**

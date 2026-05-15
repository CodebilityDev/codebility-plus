# Supabase RLS Known Issues

## 🔴 Critical: role_id Field Corruption

### The Problem

When querying the `codev` table **without** explicitly filtering by `role_id`, Supabase Row Level Security (RLS) policies corrupt the `role_id` field, returning incorrect values for most users.

### Example

```typescript
// ❌ WRONG - Returns incorrect role_id values
const { data } = await supabase
  .from("codev")
  .select("*");

// Result: 1000 users returned, but only 5 have correct role_id values
// The other 995 users have corrupted/wrong role_id values

// ✅ CORRECT - Returns accurate role_id values
const { data } = await supabase
  .from("codev")
  .select("*")
  .eq("role_id", 5);

// Result: All 11 mentors with correct role_id = 5
```

### Root Cause

The RLS policies on the `codev` table appear to have a join-based filtering mechanism that silently corrupts the `role_id` field when:
1. Fetching all users without role filtering
2. Using certain joins with other tables (like `project_members`)

This was discovered when mentor counts didn't match:
- Database: 11 users with `role_id = 5` (Mentors)
- Query without filter: Only 5 users had `role_id = 5`
- Query with `.eq("role_id", 5)`: All 11 users correctly returned

### Solutions

#### 1. Use the Utility Functions (Recommended)

Import and use the utility functions from `/lib/server/codev-queries.ts`:

```typescript
import {
  fetchAllCodevsWithCorrectRoles,
  fetchMentors,
  fetchAdmins,
  ROLE_IDS
} from "@/lib/server/codev-queries";

// Fetch all users with correct role_id values
const allUsers = await fetchAllCodevsWithCorrectRoles();

// Fetch only mentors
const mentors = await fetchMentors();

// Fetch only admins
const admins = await fetchAdmins();

// Fetch a specific role
import { fetchCodevsByRole } from "@/lib/server/codev-queries";
const applicants = await fetchCodevsByRole(ROLE_IDS.APPLICANT);
```

#### 2. Manual Query Pattern

If you need to query manually, use separate queries per role:

```typescript
const roleIds = [1, 5, 7, 10]; // Admin, Mentor, Applicant, Codev

const queries = roleIds.map(roleId =>
  supabase.from("codev").select("*").eq("role_id", roleId)
);

const results = await Promise.all(queries);

// Combine results
let allUsers = [];
results.forEach(({ data }) => {
  if (data) allUsers = allUsers.concat(data);
});
```

#### 3. Use Anon Client

When possible, use the anonymous client instead of authenticated client:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

The anon client bypasses user-specific RLS policies that might cause corruption.

### Files Using the Correct Pattern

- ✅ `apps/codebility/app/(marketing)/_components/landing/LandingAdmins.tsx`
- ✅ `apps/codebility/app/home/projects/actions.ts` (`getProjectCodevs`)
- ✅ `apps/codebility/components/ui/SelectMemberModal.tsx`
- ✅ `apps/codebility/app/home/my-team/AddMembersModal.tsx`

### Testing for This Issue

If you suspect role_id corruption, add debug logging:

```typescript
const { data } = await supabase.from("codev").select("*");

console.log('Total users:', data.length);
console.log('Mentors (role_id=5):', data.filter(u => u.role_id === 5).length);
console.log('Admins (role_id=1):', data.filter(u => u.role_id === 1).length);

// Compare with direct database query to see if counts match
```

### Related Issues

- **Issue**: Only 5 of 11 mentors showing in project edit modal
- **Fixed**: April 27, 2026 (commit c65c4396)
- **Pattern**: Use separate role-based queries instead of fetching all users at once

### Future Prevention

1. **Code Review**: Check any new `codev` queries for role_id usage
2. **Utility First**: Always use utility functions from `codev-queries.ts`
3. **Testing**: Verify user counts match database when implementing features
4. **Documentation**: Update this file when new RLS issues are discovered

---

**Last Updated**: April 27, 2026
**Discovered By**: Zeff (investigating mentor count discrepancy)

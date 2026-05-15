# Codev Query Audit - RLS Issues

**Date**: April 27, 2026
**Issue**: Queries without explicit `role_id` filtering get corrupted role_id values due to RLS policies

---

## ✅ Safe Queries (No RLS Issues)

### 1. `lib/server/codev-queries.ts`
**Status**: ✅ SAFE - Purpose-built to avoid RLS issues

```typescript
// Queries each role separately, then combines results
export async function fetchAllCodevsWithCorrectRoles()
export async function fetchMentors()
export async function fetchAdmins()
```

**Recommendation**: Use these utilities for all future queries

---

### 2. `app/home/projects/actions.ts` - `getProjectCodevs()`
**Status**: ✅ FIXED - Commit c65c4396

```typescript
// Fetches users by role in separate queries to avoid RLS corruption
const roleIds = [1, 5, 7, 10];
const queries = roleIds.map(roleId =>
  supabase.from("codev").select(selectFields).eq("role_id", roleId)
);
```

**Pattern**: ✅ Queries by role_id separately, then combines

---

### 3. `app/(marketing)/_components/landing/LandingAdmins.tsx`
**Status**: ✅ SAFE - Already uses correct pattern

```typescript
const [
  { data: admins, error: adminError },
  { data: mentors, error: mentorError },
] = await Promise.all([
  supabase.from("codev").select("*").eq("role_id", 1),
  supabase.from("codev").select("*").eq("role_id", 5),
]);
```

**Pattern**: ✅ Separate queries with explicit role_id filters

---

### 4. `app/home/my-team/AddMembersModal.tsx` - `fetchCodevsByFilter()`
**Status**: ✅ FIXED - Uses role_id filtering

```typescript
case 'mentor':
  query = query.eq('role_id', 5);
  break;
case 'admin':
  query = query.eq('role_id', 1);
  break;
```

**Pattern**: ✅ Explicitly filters by role_id

---

## ⚠️ Potentially Unsafe Queries

### 5. `lib/server/codev.service.ts` - `getCodevs()`
**Status**: ⚠️ VULNERABLE - Can be called without role_id filter

```typescript
export const getCodevs = async ({
  filters = {},
}: {
  filters?: {
    id?: string;
    role_id?: number | string;
    application_status?: string;
  };
} = {}): Promise<{ error: any; data: Codev[] | null }> => {
  const supabase = await createClientServerComponent();
  let query = supabase.from("codev").select(`...`);

  // ⚠️ Problem: If filters doesn't include role_id, gets corrupted data
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      query = query.eq(key, value);
    }
  });
```

**Issue**: When called without `role_id` filter:
```typescript
// ❌ WRONG - Gets corrupted role_id values
const { data } = await getCodevs({ filters: { application_status: 'passed' }});

// ✅ CORRECT - Gets accurate role_id values
const { data } = await getCodevs({ filters: { role_id: 5 }});
```

**Fix Required**:
```typescript
export const getCodevs = async ({ filters = {} } = {}): Promise<...> => {
  // If no role_id filter, use safe utility
  if (!filters.role_id) {
    const allUsers = await fetchAllCodevsWithCorrectRoles();

    // Apply other filters client-side
    let filtered = allUsers;
    if (filters.id) filtered = filtered.filter(u => u.id === filters.id);
    if (filters.application_status) {
      filtered = filtered.filter(u => u.application_status === filters.application_status);
    }

    return { error: null, data: filtered };
  }

  // Safe to use direct query when role_id is provided
  const supabase = await createClientServerComponent();
  let query = supabase.from("codev").select(`...`).eq('role_id', filters.role_id);

  // Apply other filters
  if (filters.id) query = query.eq('id', filters.id);
  if (filters.application_status) {
    query = query.eq('application_status', filters.application_status);
  }

  const { data, error } = await query;
  return { error, data };
};
```

---

## 📊 Usage Analysis

### Where is `getCodevs()` used?

```bash
grep -r "getCodevs" apps/codebility --include="*.ts" --include="*.tsx"
```

**Need to check**:
1. Is it called without role_id filter?
2. Does the calling code rely on accurate role_id values?
3. Should we fix it now or deprecate in favor of utility functions?

---

## 🎯 Recommended Actions

### Immediate (High Priority)

1. ✅ Fix `lib/server/codev.service.ts` - `getCodevs()` function
2. ✅ Audit all usages of `getCodevs()` to ensure they work after fix
3. ✅ Add JSDoc warning to `getCodevs()` about RLS issue

### Short Term (Next Sprint)

4. Create database migration to fix unknown role_ids (4, 6)
5. Update CLAUDE.md with clear guidelines on role_id vs internal_status
6. Add constants/roles.ts file for consistency

### Long Term (Technical Debt)

7. Consider deprecating `getCodevs()` in favor of specific query functions
8. Add database triggers to prevent role_id/internal_status mismatches
9. Add automated tests to catch RLS issues

---

## 📝 Testing Checklist

Before marking `getCodevs()` as fixed, verify:

- [ ] Called without filters returns all users with correct role_id
- [ ] Called with role_id filter returns correct subset
- [ ] Called with application_status filter returns correct subset with correct role_id
- [ ] Mentors count matches database (11 mentors)
- [ ] Admins count matches database (20 admins)
- [ ] No console errors about RLS or permissions

---

## 🔍 How to Test for RLS Issues

Add this debug code temporarily:

```typescript
const { data: allUsers } = await getCodevs();

console.log('Total users:', allUsers?.length);
console.log('Mentors (role_id=5):', allUsers?.filter(u => u.role_id === 5).length);
console.log('Admins (role_id=1):', allUsers?.filter(u => u.role_id === 1).length);

// Compare with direct role-filtered query
const { data: mentors } = await getCodevs({ filters: { role_id: 5 }});
console.log('Direct mentor query:', mentors?.length);

// If numbers don't match, RLS issue exists!
```

---

**Last Updated**: April 27, 2026
**Next Review**: After implementing getCodevs() fix

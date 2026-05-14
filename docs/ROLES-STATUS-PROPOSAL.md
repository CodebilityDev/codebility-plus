# Role ID vs Internal Status: Proposal to Fix Confusion

## 🔴 Current Problem

We have **TWO parallel systems** for tracking user roles/status:

### 1. `role_id` (from `roles` table)
- 1 = Admin
- 4 = Unknown (232 users!)
- 5 = Mentor
- 6 = Unknown (20 users!)
- 7 = Applicant
- 10 = Codev

### 2. `internal_status` (from `codev` table)
- TRAINING
- GRADUATED
- MENTOR
- ADMIN
- DEPLOYED

### The Confusion

**14 mismatches found** where role_id doesn't match internal_status:

#### Admins with wrong internal_status:
- Alyssa Lyn Jecomo: role_id=1 (Admin) but internal_status=MENTOR
- Patricia Anne, Christine Paola, Gianna Lei, Jan Phillip, Juan Miguel: Admin role but TRAINING status
- Raineer, Jzeff, Jason, Charles, Khalid: Admin role but GRADUATED status

#### Mentors with wrong internal_status:
- Ken Andrei Ong, Ian Macalinao: Mentor role but TRAINING status
- David Tribugenia: Mentor role but GRADUATED status

#### Unknown role IDs:
- 232 users have role_id = 4 (not defined in system)
- 20 users have role_id = 6 (not defined in system)

---

## 💡 Proposed Solution: Option 1 (Recommended)

### **Use `role_id` as single source of truth for ROLES**
### **Use `internal_status` for PROGRESSION STATUS**

### Concept

**Roles** = Permission/Access Level (What you ARE)
- Admin (role_id = 1)
- Mentor (role_id = 5)
- Applicant (role_id = 7)
- Codev (role_id = 10)

**Status** = Training/Deployment Progression (Where you're AT)
- TRAINING - Currently in training program
- GRADUATED - Completed training program
- DEPLOYED - Currently deployed to client project

### Example: A Mentor's Journey

```
1. Joins as Applicant → role_id = 7, internal_status = TRAINING
2. Completes training → role_id = 7, internal_status = GRADUATED
3. Gets deployed → role_id = 7, internal_status = DEPLOYED
4. Promoted to Mentor → role_id = 5, internal_status = DEPLOYED
5. Returns from deployment → role_id = 5, internal_status = GRADUATED
```

**Key Point**: `role_id` and `internal_status` serve DIFFERENT purposes!

### Changes Required

#### 1. Update Constants

```typescript
// constants/roles.ts (NEW FILE)
export const ROLE_IDS = {
  ADMIN: 1,
  MENTOR: 5,
  APPLICANT: 7,
  CODEV: 10,
} as const;

export const ROLE_NAMES = {
  1: 'Admin',
  5: 'Mentor',
  7: 'Applicant',
  10: 'Codev',
} as const;
```

```typescript
// constants/internal_status.ts (UPDATED)
export const INTERNAL_STATUS = {
  TRAINING: "TRAINING",      // Currently in training
  GRADUATED: "GRADUATED",    // Completed training
  DEPLOYED: "DEPLOYED",      // Deployed to client
} as const;

// REMOVED: MENTOR, ADMIN (use role_id instead)
```

#### 2. Update Filtering Logic

**BEFORE (Confusing)**:
```typescript
// Sometimes uses role_id
users.filter(u => u.role_id === 5)

// Sometimes uses internal_status
users.filter(u => u.internal_status === 'MENTOR')

// Which is correct?? 🤷
```

**AFTER (Clear)**:
```typescript
// For ROLES - Always use role_id
const mentors = users.filter(u => u.role_id === ROLE_IDS.MENTOR);
const admins = users.filter(u => u.role_id === ROLE_IDS.ADMIN);

// For STATUS - Always use internal_status
const inTraining = users.filter(u => u.internal_status === 'TRAINING');
const graduated = users.filter(u => u.internal_status === 'GRADUATED');
const deployed = users.filter(u => u.internal_status === 'DEPLOYED');

// Combined filters (common use case)
const graduatedMentors = users.filter(u =>
  u.role_id === ROLE_IDS.MENTOR &&
  u.internal_status === 'GRADUATED'
);
```

#### 3. Database Migration (Optional)

If you want to clean up the mismatches:

```sql
-- Option A: Update internal_status to match role_id
UPDATE codev
SET internal_status = 'ADMIN'
WHERE role_id = 1 AND internal_status != 'ADMIN';

UPDATE codev
SET internal_status = 'MENTOR'
WHERE role_id = 5 AND internal_status != 'MENTOR';

-- Option B: Keep current internal_status, rely only on role_id for roles
-- No database changes needed, just update application code
```

#### 4. Fix Unknown Roles

```sql
-- Investigate what role_id 4 and 6 should be
SELECT first_name, last_name, email_address, role_id, internal_status
FROM codev
WHERE role_id IN (4, 6)
LIMIT 10;

-- Then update or create proper role definitions
```

---

## 📋 Files That Need Updates

### High Priority (Breaking Issues)

1. ✅ `lib/server/codev-queries.ts` - Already uses role_id correctly
2. ✅ `components/ui/SelectMemberModal.tsx` - Already updated
3. ✅ `app/home/my-team/AddMembersModal.tsx` - Already updated
4. ⚠️ `lib/server/codev.service.ts` - Needs RLS protection
5. ⚠️ `constants/internal_status.ts` - Remove MENTOR/ADMIN

### Medium Priority (Inconsistent Usage)

6. `app/home/in-house/_components/table/TableActions.tsx`
7. `app/home/interns/_components/ProfileModal.tsx`
8. `app/home/my-team/MyTeamPage.tsx`
9. `app/(marketing)/profiles/_components/CodevCard.tsx`

### Low Priority (New User Creation)

10. `app/auth/sign-up/_components/SignUpForm.tsx`
11. `app/auth/actions.ts`

---

## ✅ Immediate Action Items

### Step 1: Fix `codev.service.ts` RLS Issue

```typescript
// BEFORE (Vulnerable to RLS corruption)
export const getCodevs = async ({ filters = {} } = {}): Promise<...> => {
  const supabase = await createClientServerComponent();
  let query = supabase.from("codev").select(`...`);

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) {
      query = query.eq(key, value);
    }
  });

// AFTER (Protected from RLS corruption)
export const getCodevs = async ({ filters = {} } = {}): Promise<...> => {
  // If no role_id filter provided, use fetchAllCodevsWithCorrectRoles
  if (!filters.role_id) {
    return {
      error: null,
      data: await fetchAllCodevsWithCorrectRoles({
        selectFields: '...'
      })
    };
  }

  // If role_id filter provided, safe to use direct query
  const supabase = await createClientServerComponent();
  let query = supabase.from("codev").select(`...`).eq('role_id', filters.role_id);
```

### Step 2: Add Role Constants

Create `/apps/codebility/constants/roles.ts` with proper role definitions.

### Step 3: Document in CLAUDE.md

Add clear guidelines about when to use `role_id` vs `internal_status`.

---

## 🎯 Success Criteria

After implementing this proposal:

1. ✅ **Clear separation**: Developers know to use `role_id` for roles, `internal_status` for progression
2. ✅ **No RLS issues**: All queries properly handle role_id field
3. ✅ **Consistent filtering**: All modals/lists use the same logic
4. ✅ **No mismatches**: Database data is clean and consistent
5. ✅ **Better DX**: Constants and utilities make it easy to do the right thing

---

## 🤔 Alternative Options

### Option 2: Sync role_id and internal_status

**Pros**:
- Both fields always match
- Can use either field interchangeably

**Cons**:
- Adds complexity with triggers/sync logic
- Loses the progression tracking capability
- Still has two sources of truth

### Option 3: Remove role_id completely

**Pros**:
- Single source of truth
- No sync issues

**Cons**:
- Loses proper role management
- internal_status becomes overloaded concept
- Harder to implement proper RBAC

---

## 📊 Database Cleanup Queries

Run these after deciding on approach:

```sql
-- See current state
SELECT
  role_id,
  internal_status,
  COUNT(*) as count
FROM codev
WHERE role_id IS NOT NULL
GROUP BY role_id, internal_status
ORDER BY role_id, internal_status;

-- Find mismatches
SELECT first_name, last_name, role_id, internal_status
FROM codev
WHERE
  (role_id = 1 AND internal_status != 'ADMIN') OR
  (role_id = 5 AND internal_status != 'MENTOR');

-- Fix unknown role_ids (after investigation)
-- UPDATE codev SET role_id = ? WHERE role_id IN (4, 6);
```

---

**Recommendation**: Implement **Option 1** (role_id for roles, internal_status for progression)

This provides the clearest mental model and best separation of concerns.

**Next Step**: Review this proposal and let me know which approach you prefer, then I'll implement the changes.

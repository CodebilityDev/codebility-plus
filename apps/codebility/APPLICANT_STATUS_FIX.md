# Applicant Dual-Status Issue - Resolution

## Issue Summary
Users with `application_status = "passed"` were appearing in both the **In-House** page and **Applicants** page simultaneously, causing confusion about their actual status.

**Specific Case:** Johnrick Rabara (jrabarav2@gmail.com) appeared in both locations.

## Root Cause Analysis

### 1. Database Structure
The system has two related tables:
- `codev` table - Main user table with `application_status` field
- `applicant` table - Supplementary table with onboarding data (linked via `codev_id`)

### 2. The Problem
When a user's status changed to "passed":
- ✅ Their `codev.application_status` was updated to "passed"
- ❌ Their `applicant` record remained in the database
- ❌ Cached data wasn't cleared

### 3. Why It Appeared in Both Pages

**In-House Page** (`/home/in-house`):
```typescript
// Query: application_status = "passed"
getCodevs({ filters: { application_status: "passed" } })
```
✅ Correctly showed users with "passed" status

**Applicants Page** (`/home/applicants`):
```typescript
// Query: application_status != "passed"
.not("application_status", "eq", "passed")
```
✅ Query was correct - should exclude "passed" users
❌ BUT: Stale cached data was being served
❌ AND: Orphaned applicant records existed for passed users

## Solution Implemented

### 1. ✅ Cache Clearing
**Script:** `scripts/clear-cache.ts`
- Clears Redis cache for applicants, in-house, and dashboard
- **Usage:** `pnpm cache:clear`

```bash
pnpm cache:clear
```

### 2. ✅ Database Cleanup
**Script:** `scripts/archive-passed-applicants.ts`
- Deleted 173 orphaned applicant records for users with "passed" status
- Includes Johnrick Rabara's applicant record
- **Usage:** `pnpm applicants:cleanup`

```bash
pnpm applicants:cleanup
```

### 3. ✅ Automatic Prevention (Database Trigger)
**Migration:** `supabase/migrations/20260220_auto_archive_applicant_on_passed.sql`

Created database trigger that automatically:
1. Archives applicant data to `applicant_archive` table when status changes to "passed"
2. Deletes the original applicant record
3. Prevents future dual-status issues

**How it works:**
```sql
-- Trigger fires on UPDATE of application_status
CREATE TRIGGER trigger_archive_applicant_on_passed
  AFTER UPDATE OF application_status ON codev
  FOR EACH ROW
  EXECUTE FUNCTION archive_applicant_on_passed();
```

## Verification

### Before Fix
```sql
SELECT COUNT(*) FROM applicant a
JOIN codev c ON a.codev_id = c.id
WHERE c.application_status = 'passed';
-- Result: 173 orphaned records
```

### After Fix
```sql
SELECT COUNT(*) FROM applicant a
JOIN codev c ON a.codev_id = c.id
WHERE c.application_status = 'passed';
-- Result: 0 records ✅
```

## Testing the Fix

1. **Clear the cache:**
   ```bash
   pnpm cache:clear
   ```

2. **Visit the applicants page:**
   - Navigate to `/home/applicants`
   - Verify Johnrick Rabara does NOT appear

3. **Visit the in-house page:**
   - Navigate to `/home/in-house`
   - Verify Johnrick Rabara DOES appear

## Files Modified/Created

### New Scripts
- ✅ `scripts/clear-cache.ts` - Cache clearing utility
- ✅ `scripts/archive-passed-applicants.ts` - One-time cleanup script

### New Migrations
- ✅ `supabase/migrations/20260220_auto_archive_applicant_on_passed.sql` - Auto-archiving trigger
- ✅ `supabase/migrations/20260220_add_job_link_to_client_outreach.sql` - Client tracker job link

### Updated Files
- ✅ `package.json` - Added `cache:clear` and `applicants:cleanup` scripts
- ✅ `constants/settings.ts` - Fixed client tracker icon (icon-chart → icon-clients)
- ✅ `app/home/admin-controls/client-tracker/_components/ClientTrackerContent.tsx` - Dark mode fixes

## Future Prevention

### When Accepting an Applicant
The database trigger will automatically handle cleanup, but to be safe:

1. **Update application status:**
   ```typescript
   await supabase
     .from("codev")
     .update({ application_status: "passed" })
     .eq("id", codevId);
   ```

2. **Clear cache (optional - recommended):**
   ```bash
   pnpm cache:clear
   ```

3. **The trigger handles the rest automatically** - No manual cleanup needed!

## Additional Improvements Made

### Client Tracker Enhancements
1. ✅ Made plus icon smaller (40px)
2. ✅ Added `job_link` field for job postings
3. ✅ Fixed dark mode text colors for admin names and View button
4. ✅ Created migration to add `job_link` column to database

## Available Commands

```bash
# Clear all cache (applicants, in-house, dashboard)
pnpm cache:clear

# Clean up orphaned applicant records (one-time, already run)
pnpm applicants:cleanup
```

## Summary

**Issue:** Users appearing in both Applicants and In-House pages
**Cause:** Stale cache + orphaned applicant records
**Solution:**
- Cache clearing script ✅
- Database cleanup script ✅
- Automatic prevention via database trigger ✅

**Status:** ✅ **RESOLVED**

All 173 affected users (including Johnrick Rabara) have been cleaned up, and future issues are prevented by the database trigger.

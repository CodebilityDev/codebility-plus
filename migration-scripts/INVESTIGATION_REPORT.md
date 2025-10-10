# Supabase Migration Investigation Report

## 🔍 **Problem Identified**

The migration appears to have failed because the **schema between old and new databases don't match**. The new Supabase project has an updated schema that's missing columns that exist in the old database.

## 📊 **Data Status Summary**

### **Old Database (Source):**
- **Total Records**: 1,832
- **Tables with Data**: 9 tables
- **Additional Table Found**: `clients` (7 records) - not in original migration script

### **New Database (Current):**
- **Total Records**: 1 (only a test role)
- **Status**: Nearly empty - migration failed

### **Missing Data Breakdown:**
| Table | Old DB Records | New DB Records | Status |
|-------|----------------|----------------|---------|
| skill_category | 6 | 0 | ❌ Missing |
| codev | 585 | 0 | ❌ Missing |
| project_members | 93 | 0 | ❌ Missing |
| work_experience | 43 | 0 | ❌ Missing |
| codev_points | 66 | 0 | ❌ Missing |
| attendance | 995 | 0 | ❌ Missing |
| job_listings | 6 | 0 | ❌ Missing |
| job_applications | 30 | 0 | ❌ Missing |
| clients | 7 | 0 | ❌ Missing (not in migration) |
| roles | 8 | 1 | ⚠️ Partial |

## 🚫 **Schema Mismatch Issues**

### **Missing Columns in New Database:**

1. **`skill_category` table:**
   - Issue: ID type mismatch (UUID vs INTEGER)
   - Error: `invalid input syntax for type integer`

2. **`codev` table:**
   - Missing column: `date_applied`

3. **`work_experience` table:**
   - Missing column: `company_name`

4. **`codev_points` table:**
   - Missing column: `period_type`

5. **`attendance` table:**
   - Missing column: `check_in`

6. **`job_listings` table:**
   - Missing column: `created_by`

7. **`job_applications` table:**
   - Missing column: `email`

8. **`project_members` table:**
   - Foreign key constraint violation: referenced projects don't exist

## 🎯 **Root Cause Analysis**

1. **Schema Evolution**: The new database schema appears to be an updated version that doesn't include all columns from the old schema
2. **Migration Scripts Mismatch**: The migration was attempted without proper schema alignment
3. **Missing Dependencies**: Some tables depend on data that wasn't migrated (e.g., projects)
4. **Incomplete Table Discovery**: The `clients` table was not included in the original migration script

## ✅ **Recommended Solutions**

### **Option 1: Fix New Database Schema (Recommended)**

1. **Add Missing Columns** to new database:
   ```sql
   -- Add missing columns to match old schema
   ALTER TABLE codev ADD COLUMN date_applied timestamp;
   ALTER TABLE work_experience ADD COLUMN company_name text;
   ALTER TABLE codev_points ADD COLUMN period_type text;
   ALTER TABLE attendance ADD COLUMN check_in time;
   ALTER TABLE job_listings ADD COLUMN created_by uuid;
   ALTER TABLE job_applications ADD COLUMN email text;
   
   -- Fix skill_category ID type if needed
   -- (This might require dropping and recreating the table)
   ```

2. **Add Missing Tables**:
   ```sql
   -- Create clients table
   CREATE TABLE clients (
     id uuid PRIMARY KEY,
     name text,
     email text,
     phone_number text,
     address text,
     country text,
     client_type text,
     status text,
     website text,
     company_logo text,
     industry text,
     testimony text,
     created_at timestamp DEFAULT now(),
     updated_at timestamp DEFAULT now()
   );
   ```

3. **Ensure Project Data Exists** before importing project_members

4. **Re-run Migration** with complete data

### **Option 2: Export Complete Schema from Old Database**

1. **Generate Complete Schema** from old database
2. **Apply Full Schema** to new database
3. **Re-run Data Migration**

### **Option 3: Use pg_dump/pg_restore (Fastest)**

```bash
# Complete database migration with schema
pg_dump "postgresql://postgres:[OLD_PASSWORD]@[OLD_HOST]:5432/postgres" \
  --no-owner --no-acl --clean --if-exists \
  -f complete_backup.sql

psql "postgresql://postgres:[NEW_PASSWORD]@[NEW_HOST]:5432/postgres" \
  -f complete_backup.sql
```

## 📋 **Files Available for Recovery**

All data has been exported and is available in `/exports/` directory:
- ✅ `skill_category.json` (6 records)
- ✅ `codev.json` (585 records)
- ✅ `project_members.json` (93 records) 
- ✅ `work_experience.json` (43 records)
- ✅ `codev_points.json` (66 records)
- ✅ `attendance.json` (995 records)
- ✅ `job_listings.json` (6 records)
- ✅ `job_applications.json` (30 records)
- ❌ `clients.json` (needs export) - **7 additional records found**

## 🎯 **Immediate Action Items**

1. **Verify Current Environment**: Confirm which database the app is currently using
2. **Choose Migration Strategy**: Decide between schema fix vs complete re-migration
3. **Export Missing Data**: Get the `clients` table data
4. **Schema Alignment**: Ensure new database matches old database structure
5. **Complete Data Migration**: Import all 1,832+ records
6. **Test Application**: Verify all functionality works with migrated data

## 📞 **Database Connection Details Confirmed**

- **Old Database**: `https://hibnlysaokybrsufrdwp.supabase.co` ✅ Accessible
- **New Database**: `https://mynmukpnttyyjimymgrk.supabase.co` ✅ Accessible
- **Service Role**: Available for full database access

The migration can be completed successfully once the schema issues are resolved.
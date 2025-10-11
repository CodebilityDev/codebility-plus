-- ==============================================
-- MANUAL SCHEMA FIX FOR SUPABASE MIGRATION
-- ==============================================
-- Copy and paste these commands into your NEW Supabase SQL Editor
-- Run them one by one to fix schema mismatches

-- ==============================================
-- 1. ADD MISSING COLUMNS
-- ==============================================

-- Fix codev table
ALTER TABLE codev ADD COLUMN IF NOT EXISTS date_applied timestamp with time zone;

-- Fix work_experience table  
ALTER TABLE work_experience ADD COLUMN IF NOT EXISTS company_name text;

-- Fix codev_points table
ALTER TABLE codev_points ADD COLUMN IF NOT EXISTS period_type text;

-- Fix attendance table
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS check_in time without time zone;

-- Fix job_listings table
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS created_by uuid;

-- Fix job_applications table
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS email text;

-- Fix roles table (add missing permissions column)
ALTER TABLE roles ADD COLUMN IF NOT EXISTS clients boolean DEFAULT false;

-- ==============================================
-- 2. CREATE MISSING TABLES
-- ==============================================

-- Create clients table (found in old DB but missing from migration)
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- ==============================================
-- 3. FIX SKILL_CATEGORY ID TYPE (IF NEEDED)
-- ==============================================

-- Check current skill_category structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'skill_category' AND table_schema = 'public';

-- If skill_category.id is integer but old data has UUIDs, 
-- you may need to recreate the table or convert the data

-- ==============================================
-- 4. ENABLE ROW LEVEL SECURITY (IF NEEDED)
-- ==============================================

-- Enable RLS on new tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create basic policies (adjust as needed)
CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON clients FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON clients FOR DELETE USING (auth.role() = 'authenticated');

-- ==============================================
-- 5. VERIFY SCHEMA CHANGES
-- ==============================================

-- Check that all columns exist
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('codev', 'work_experience', 'codev_points', 'attendance', 'job_listings', 'job_applications', 'roles', 'clients')
ORDER BY table_name, ordinal_position;

-- Check table counts (should be mostly 0 before data import)
SELECT 
  schemaname,
  tablename,
  n_tup_ins as "rows"
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- ==============================================
-- NOTES:
-- ==============================================
-- 1. Run these commands in your NEW Supabase project's SQL Editor
-- 2. After running these fixes, you can re-run the data migration
-- 3. The skill_category table might need special handling due to ID type mismatch
-- 4. Make sure to test each command individually
-- 5. Check for any existing data before running ALTER commands
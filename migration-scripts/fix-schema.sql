-- ==============================================
-- SCHEMA FIXES TO MATCH EXISTING DATA
-- ==============================================
-- Run this in your NEW Supabase project's SQL Editor

-- Fix roles table
ALTER TABLE roles ADD COLUMN IF NOT EXISTS applicants JSONB;

-- Fix codev table  
ALTER TABLE codev ADD COLUMN IF NOT EXISTS application_status VARCHAR(50);

-- Fix work_experience table
ALTER TABLE work_experience RENAME COLUMN company TO company_name;

-- Fix attendance table
ALTER TABLE attendance RENAME COLUMN check_in_time TO check_in;
ALTER TABLE attendance RENAME COLUMN check_out_time TO check_out;

-- Fix codev_points table
ALTER TABLE codev_points ADD COLUMN IF NOT EXISTS period_type VARCHAR(50);

-- Fix job_listings table
ALTER TABLE job_listings RENAME COLUMN posted_by TO created_by;

-- Fix job_applications table  
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Temporarily disable RLS for data import
ALTER TABLE project_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE codev DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience DISABLE ROW LEVEL SECURITY;
ALTER TABLE codev_points DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;

SELECT 'Schema fixes applied successfully!' as status;
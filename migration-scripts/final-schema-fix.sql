-- ==============================================
-- COMPREHENSIVE SCHEMA FIXES
-- ==============================================

-- Inspect actual data structure first
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'roles' AND table_schema = 'public';

-- Fix roles table - add all missing columns
ALTER TABLE roles ADD COLUMN IF NOT EXISTS dashboard BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS kanban BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS projects BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS team BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS interns BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS orgchart BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS clients BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS applicants BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS admin_dashboard BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS feeds BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS overflow BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS hire BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS in_house BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS tasks BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS time_tracker BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS settings BOOLEAN DEFAULT false;

-- Fix codev table - add missing columns
ALTER TABLE codev ADD COLUMN IF NOT EXISTS date_applied TIMESTAMP WITH TIME ZONE;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS application_status VARCHAR(50);

-- Fix skill_category table - some IDs are UUIDs instead of integers
-- Let's check and handle this

-- Fix work_experience table
ALTER TABLE work_experience ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);
UPDATE work_experience SET company_name = company WHERE company_name IS NULL;

-- Fix attendance table  
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS check_in TIME;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS check_out TIME;

-- Fix codev_points table
ALTER TABLE codev_points ADD COLUMN IF NOT EXISTS period_type VARCHAR(50);

-- Fix job_listings table
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES codev(id);

-- Fix job_applications table
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Drop foreign key constraints temporarily for import
ALTER TABLE codev DROP CONSTRAINT IF EXISTS codev_role_id_fkey;
ALTER TABLE codev_points DROP CONSTRAINT IF EXISTS codev_points_skill_category_id_fkey;

-- Create a flexible import approach - update constraints after import

SELECT 'Comprehensive schema fixes applied!' as status;
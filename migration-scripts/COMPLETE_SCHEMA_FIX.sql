-- ==============================================
-- COMPLETE SCHEMA FIX - ALL MISSING COLUMNS
-- ==============================================
-- Run these in your NEW Supabase SQL Editor

-- Fix roles table - add ALL missing columns
ALTER TABLE roles ADD COLUMN IF NOT EXISTS dashboard boolean DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS kanban boolean DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS time_tracker boolean DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS interns boolean DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS inhouse boolean DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS projects boolean DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS permissions boolean DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS resume boolean DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS settings boolean DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS orgchart boolean DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS overflow boolean DEFAULT false;

-- Fix codev table - add missing columns
ALTER TABLE codev ADD COLUMN IF NOT EXISTS date_joined timestamp with time zone;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS positions text[];
ALTER TABLE codev ADD COLUMN IF NOT EXISTS tech_stacks text[];
ALTER TABLE codev ADD COLUMN IF NOT EXISTS portfolio_website text;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS nda_status boolean DEFAULT false;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS level jsonb DEFAULT '{}'::jsonb;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS rejected_count integer DEFAULT 0;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS mentor_id uuid;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS nda_signature text;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS nda_document text;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS nda_signed_at timestamp with time zone;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS nda_request_sent boolean DEFAULT false;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS promote_declined boolean;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS date_passed timestamp with time zone;

-- Fix work_experience table
ALTER TABLE work_experience ADD COLUMN IF NOT EXISTS location text DEFAULT '';

-- Fix attendance table  
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS check_out time without time zone;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS project_id uuid;

-- Fix job_listings table
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS department varchar;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS type varchar;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS level varchar;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS requirements text[];
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS remote boolean DEFAULT false;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS posted_date date DEFAULT CURRENT_DATE;

-- Fix job_applications table
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS job_id uuid;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS first_name varchar;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS last_name varchar;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS phone varchar;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS linkedin varchar;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS portfolio varchar;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS experience text;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS github varchar;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS years_of_experience integer;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS referred_by uuid;

-- Clear existing data for clean import
DELETE FROM skill_category;
DELETE FROM roles;
DELETE FROM codev;
DELETE FROM work_experience;
DELETE FROM codev_points;
DELETE FROM attendance;
DELETE FROM job_listings;
DELETE FROM job_applications;

SELECT 'All schema fixes applied and tables cleared for import!' as status;
-- ==============================================
-- COMPLETE SCHEMA ALIGNMENT
-- ==============================================
-- Run this in your NEW Supabase project to match old schema

-- 1. Fix skill_category to use UUID instead of INTEGER
ALTER TABLE skill_category DROP CONSTRAINT skill_category_pkey;
ALTER TABLE skill_category ALTER COLUMN id TYPE uuid USING gen_random_uuid();
ALTER TABLE skill_category ADD PRIMARY KEY (id);

-- 2. Fix codev_points skill_category_id to UUID
ALTER TABLE codev_points ALTER COLUMN skill_category_id TYPE uuid USING gen_random_uuid();

-- 3. Add missing columns to roles table
ALTER TABLE roles ADD COLUMN IF NOT EXISTS dashboard BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS kanban BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS time_tracker BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS interns BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS inhouse BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS clients BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS projects BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS roles BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS permissions BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS resume BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS settings BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS orgchart BOOLEAN DEFAULT false;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS overflow BOOLEAN DEFAULT false;

-- 4. Add missing columns to codev table
ALTER TABLE codev ADD COLUMN IF NOT EXISTS positions TEXT[];
ALTER TABLE codev ADD COLUMN IF NOT EXISTS tech_stacks TEXT[];
ALTER TABLE codev ADD COLUMN IF NOT EXISTS portfolio_website TEXT;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS nda_status BOOLEAN DEFAULT false;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS level JSONB DEFAULT '{}'::jsonb;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS rejected_count INTEGER DEFAULT 0;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS mentor_id UUID;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS nda_signature TEXT;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS nda_document TEXT;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS nda_signed_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS nda_request_sent BOOLEAN DEFAULT false;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS date_applied TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc');
ALTER TABLE codev ADD COLUMN IF NOT EXISTS promote_declined BOOLEAN;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS date_passed TIMESTAMP WITH TIME ZONE;
ALTER TABLE codev ADD COLUMN IF NOT EXISTS date_joined TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc');

-- 5. Fix attendance table column names
ALTER TABLE attendance RENAME COLUMN check_in_time TO check_in;
ALTER TABLE attendance RENAME COLUMN check_out_time TO check_out;
ALTER TABLE attendance ADD COLUMN IF NOT EXISTS project_id UUID;

-- 6. Add missing columns to work_experience
ALTER TABLE work_experience ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE work_experience ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '';
-- Copy company to company_name for compatibility
UPDATE work_experience SET company_name = company WHERE company_name IS NULL;

-- 7. Add period_type to codev_points
ALTER TABLE codev_points ADD COLUMN IF NOT EXISTS period_type TEXT DEFAULT 'all';

-- 8. Fix job_listings table
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS department VARCHAR;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS type VARCHAR;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS level VARCHAR;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS requirements TEXT[];
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS remote BOOLEAN DEFAULT false;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS posted_date DATE DEFAULT CURRENT_DATE;
ALTER TABLE job_listings ADD COLUMN IF NOT EXISTS created_by UUID;

-- 9. Fix job_applications table
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS job_id UUID;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS first_name VARCHAR;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS last_name VARCHAR;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS email VARCHAR;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS phone VARCHAR;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS linkedin VARCHAR;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS portfolio VARCHAR;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS experience TEXT;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS github VARCHAR;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS years_of_experience INTEGER;
ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS referred_by UUID;

-- 10. Create missing tables from old schema
CREATE TABLE IF NOT EXISTS attendance_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codev_id UUID REFERENCES codev(id),
    points INTEGER DEFAULT 0,
    last_updated DATE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone_number TEXT,
    address TEXT,
    country TEXT,
    client_type TEXT,
    status TEXT DEFAULT 'prospect',
    website TEXT,
    company_logo TEXT,
    industry TEXT,
    testimony TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kanban_boards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    project_id UUID,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kanban_columns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    board_id UUID,
    position INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS kanban_sprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id UUID DEFAULT gen_random_uuid(),
    project_id UUID DEFAULT gen_random_uuid(),
    name TEXT,
    start_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    end_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active',
    start_date DATE NOT NULL,
    end_date DATE,
    github_link TEXT,
    website_url TEXT,
    figma_link TEXT,
    client_id UUID,
    project_category_id INTEGER,
    main_image TEXT,
    kanban_display BOOLEAN DEFAULT false,
    public_display BOOLEAN DEFAULT true,
    meeting_schedule JSONB,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT,
    codev_id UUID,
    kanban_column_id UUID,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT,
    due_date DATE,
    created_by UUID,
    sidekick_ids UUID[],
    difficulty TEXT,
    points INTEGER,
    pr_link TEXT,
    is_archive BOOLEAN DEFAULT false,
    skill_category_id UUID,
    deadline DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- 11. Temporarily disable RLS for import
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE skill_category DISABLE ROW LEVEL SECURITY;
ALTER TABLE codev DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE work_experience DISABLE ROW LEVEL SECURITY;
ALTER TABLE codev_points DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications DISABLE ROW LEVEL SECURITY;

-- 12. Drop foreign key constraints that might cause issues
ALTER TABLE codev DROP CONSTRAINT IF EXISTS codev_role_id_fkey;
ALTER TABLE codev_points DROP CONSTRAINT IF EXISTS codev_points_skill_category_id_fkey;

SELECT 'Complete schema alignment completed! Ready for data re-import.' as status;
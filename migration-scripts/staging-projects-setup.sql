-- Staging Database Projects Table Setup with Tech Stack Support
-- This script creates the projects table and adds tech stack support for staging environment

-- First, create the projects table if it doesn't exist
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
    tech_stack TEXT[], -- Tech stack field included in table creation
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Add tech_stack column if the table existed but didn't have the column
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack TEXT[];

-- Add comment to describe the tech_stack column
COMMENT ON COLUMN projects.tech_stack IS 'Array of technologies/frameworks used in the project';

-- Create index for better performance when querying by tech stack
CREATE INDEX IF NOT EXISTS idx_projects_tech_stack ON projects USING GIN (tech_stack);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created successfully
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'projects') THEN
        RAISE NOTICE 'Projects table created/updated successfully with tech_stack support';
    ELSE
        RAISE EXCEPTION 'Failed to create projects table';
    END IF;
END $$;
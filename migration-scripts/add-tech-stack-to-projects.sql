-- Add tech_stack field to projects table
-- This migration adds support for storing technology stacks used in projects

ALTER TABLE projects ADD COLUMN IF NOT EXISTS tech_stack TEXT[];

-- Add comment to describe the column
COMMENT ON COLUMN projects.tech_stack IS 'Array of technologies/frameworks used in the project';

-- Create index for better performance when querying by tech stack
CREATE INDEX IF NOT EXISTS idx_projects_tech_stack ON projects USING GIN (tech_stack);
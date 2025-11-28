-- Migration: Convert project-category relationship from one-to-one to many-to-many
-- This allows a project to have multiple categories
-- Created: 2025-10-28

-- Step 1: Ensure projects_category table exists
CREATE TABLE IF NOT EXISTS projects_category (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now()
);

-- Step 2: Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS project_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL,
    category_id INTEGER NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT now(),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES projects_category(id)
        ON DELETE CASCADE,
    -- Ensure a project can't have the same category twice
    CONSTRAINT unique_project_category UNIQUE (project_id, category_id)
);

-- Step 3: Migrate existing data from projects.project_category_id to junction table
-- Only migrate where project_category_id is not null
INSERT INTO project_categories (project_id, category_id)
SELECT id, project_category_id
FROM projects
WHERE project_category_id IS NOT NULL
ON CONFLICT (project_id, category_id) DO NOTHING;

-- Step 4: Remove the old project_category_id column from projects table
ALTER TABLE projects DROP COLUMN IF EXISTS project_category_id;

-- Step 5: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_categories_project_id ON project_categories(project_id);
CREATE INDEX IF NOT EXISTS idx_project_categories_category_id ON project_categories(category_id);

-- Step 6: Add helpful comments
COMMENT ON TABLE project_categories IS 'Junction table linking projects to multiple categories (many-to-many relationship)';
COMMENT ON TABLE projects_category IS 'Available project categories';
COMMENT ON COLUMN project_categories.project_id IS 'References projects.id';
COMMENT ON COLUMN project_categories.category_id IS 'References projects_category.id';

-- Step 7: Create a view for easy querying of projects with their categories
CREATE OR REPLACE VIEW projects_with_categories AS
SELECT
    p.id as project_id,
    p.name as project_name,
    p.description as project_description,
    p.status,
    p.start_date,
    p.end_date,
    p.github_link,
    p.website_url,
    p.figma_link,
    p.main_image,
    p.tech_stack,
    p.kanban_display,
    p.public_display,
    array_agg(
        jsonb_build_object(
            'id', pc.id,
            'name', pc.name,
            'description', pc.description
        )
    ) FILTER (WHERE pc.id IS NOT NULL) as categories,
    p.created_at,
    p.updated_at
FROM projects p
LEFT JOIN project_categories pcat ON p.id = pcat.project_id
LEFT JOIN projects_category pc ON pcat.category_id = pc.id
GROUP BY p.id;

COMMENT ON VIEW projects_with_categories IS 'Convenient view showing projects with all their categories as a JSON array';

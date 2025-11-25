-- Add new fields to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS tagline TEXT,
ADD COLUMN IF NOT EXISTS key_features JSONB,
ADD COLUMN IF NOT EXISTS gallery JSONB,
ADD COLUMN IF NOT EXISTS team_lead TEXT,
ADD COLUMN IF NOT EXISTS team_members JSONB,
ADD COLUMN IF NOT EXISTS secondary_image TEXT;

-- Add comments for documentation
COMMENT ON COLUMN projects.tagline IS 'Short catchy tagline for the project';
COMMENT ON COLUMN projects.key_features IS 'Array of key features as JSON';
COMMENT ON COLUMN projects.gallery IS 'Array of gallery image URLs as JSON';
COMMENT ON COLUMN projects.team_lead IS 'ID of the team leader';
COMMENT ON COLUMN projects.team_members IS 'Array of team member IDs as JSON';
COMMENT ON COLUMN projects.secondary_image IS 'URL of secondary project image';
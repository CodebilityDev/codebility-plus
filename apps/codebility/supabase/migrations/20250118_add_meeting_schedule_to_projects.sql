-- Add meeting_schedule column to projects table
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS meeting_schedule jsonb;

-- Comment on the column
COMMENT ON COLUMN projects.meeting_schedule IS 'Stores the meeting schedule for the project team (days and time)';
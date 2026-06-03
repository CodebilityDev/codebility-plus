ALTER TABLE tasks ADD COLUMN approved_at TIMESTAMPTZ;

-- Backfill existing archived tasks with their updated_at time so old leaderboard data is not lost
UPDATE tasks SET approved_at = updated_at WHERE is_archive = true AND approved_at IS NULL;

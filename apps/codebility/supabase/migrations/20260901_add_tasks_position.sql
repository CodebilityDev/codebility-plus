-- Add persisted sort order for tasks within a kanban column
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS position INTEGER;

-- Backfill from updated_at (newest first = position 0)
WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY kanban_column_id
      ORDER BY updated_at DESC NULLS LAST, created_at DESC
    ) - 1 AS new_position
  FROM tasks
  WHERE kanban_column_id IS NOT NULL
)
UPDATE tasks t
SET position = ranked.new_position
FROM ranked
WHERE t.id = ranked.id;

-- Tasks without a column get position 0
UPDATE tasks SET position = 0 WHERE position IS NULL;

ALTER TABLE tasks ALTER COLUMN position SET NOT NULL;
ALTER TABLE tasks ALTER COLUMN position SET DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_tasks_column_position
  ON tasks (kanban_column_id, position);

-- Enable Supabase Realtime for kanban board tables.
-- Without this, postgres_changes subscriptions never receive events.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'tasks'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'kanban_columns'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.kanban_columns;
  END IF;
END $$;

-- Include full old row on UPDATE/DELETE so cross-column moves and deletes patch correctly.
ALTER TABLE public.tasks REPLICA IDENTITY FULL;
ALTER TABLE public.kanban_columns REPLICA IDENTITY FULL;

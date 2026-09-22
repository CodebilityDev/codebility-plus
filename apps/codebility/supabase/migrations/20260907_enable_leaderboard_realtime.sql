-- Enable Supabase Realtime for the leaderboard points ledger.
--
-- The dashboard leaderboard has always opened a postgres_changes subscription on
-- codev_points, but the table was never added to the supabase_realtime
-- publication, so Postgres published nothing and the subscription was inert.
-- Only tasks and kanban_columns were published (20260902_enable_kanban_realtime).

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'codev_points'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.codev_points;
  END IF;
END $$;

-- REPLICA IDENTITY stays DEFAULT here, unlike the kanban tables. Kanban patches
-- local state from the payload and needs the full old row; the leaderboard only
-- needs to know that something changed before refetching, so the primary key is
-- enough and the WAL stays smaller.

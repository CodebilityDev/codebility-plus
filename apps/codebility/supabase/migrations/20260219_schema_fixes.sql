-- =============================================================================
-- Schema Fixes: Safe structural improvements identified via codebase analysis
-- Date: 2026-02-19
--
-- Changes:
--  1. Add FK: contracts.codev_id → codev(id)
--  2. Drop duplicate FK on tasks.skill_category_id
--  3. Fix kanban_sprints.board_id and project_id bad gen_random_uuid() defaults
--  4. Add FK: profile_points.codev_id → codev(id)
--  5. Drop unused columns roles.roles and roles.permissions
--  6. Drop unused table social_points_categories
--  7. Add FKs on xp_logs_discord (if referenced tables exist)
--
-- NOTE: The following were intentionally left unchanged:
--  - overflow_post.likes/comments (backed by active RPC: increment_post_likes, etc.)
--  - announcements.category UNIQUE (used as upsert key with onConflict: "category")
--  - positions table (kept as-is, used for lookups)
--  - codev.level JSONB (intentional per-skill-category storage)
--  - task_ticket_codes table (used for URL routing by ticket code)
-- =============================================================================


-- -----------------------------------------------------------------------------
-- 1. Add FK: contracts.codev_id → codev(id)
--    Safe: contracts table is not used in any app page code.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'contracts_codev_id_fkey'
      AND table_name = 'contracts'
  ) THEN
    ALTER TABLE contracts
      ADD CONSTRAINT contracts_codev_id_fkey
      FOREIGN KEY (codev_id) REFERENCES codev(id) ON DELETE SET NULL;
  END IF;
END
$$;


-- -----------------------------------------------------------------------------
-- 2. Drop duplicate FK on tasks.skill_category_id
--    The tasks table has two FK constraints pointing to the same target
--    (skill_categories). Keep the naturally named one, drop the manual one.
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'fk_skill_category'
      AND table_name = 'tasks'
  ) THEN
    ALTER TABLE tasks DROP CONSTRAINT fk_skill_category;
  END IF;
END
$$;


-- -----------------------------------------------------------------------------
-- 3. Fix kanban_sprints.board_id and project_id bad defaults
--    These FK columns were mistakenly set to DEFAULT gen_random_uuid() which
--    would generate random UUIDs instead of valid FK references.
--    Inserts always supply these values explicitly, so DEFAULT is unnecessary.
-- -----------------------------------------------------------------------------
ALTER TABLE kanban_sprints
  ALTER COLUMN board_id DROP DEFAULT;

ALTER TABLE kanban_sprints
  ALTER COLUMN project_id DROP DEFAULT;


-- -----------------------------------------------------------------------------
-- 4. Add FK: profile_points.codev_id → codev(id)
--    First delete orphaned rows (codev_id not in codev table), then add FK.
-- -----------------------------------------------------------------------------
DELETE FROM profile_points
WHERE codev_id NOT IN (SELECT id FROM codev);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profile_points_codev_id_fkey'
      AND table_name = 'profile_points'
  ) THEN
    ALTER TABLE profile_points
      ADD CONSTRAINT profile_points_codev_id_fkey
      FOREIGN KEY (codev_id) REFERENCES codev(id) ON DELETE CASCADE;
  END IF;
END
$$;


-- -----------------------------------------------------------------------------
-- 5. Drop unused columns: roles.roles and roles.permissions
--    These boolean columns are never queried anywhere in the codebase.
--    Actual permissions are individual columns (dashboard, kanban, etc.).
-- -----------------------------------------------------------------------------
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roles' AND column_name = 'roles'
  ) THEN
    ALTER TABLE roles DROP COLUMN roles;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'roles' AND column_name = 'permissions'
  ) THEN
    ALTER TABLE roles DROP COLUMN permissions;
  END IF;
END
$$;


-- -----------------------------------------------------------------------------
-- 6. Drop unused table: social_points_categories
--    This table is not referenced by any app code or other table FKs.
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS social_points_categories;


-- -----------------------------------------------------------------------------
-- 7. Add FKs on xp_logs_discord (only if referenced tables exist)
--    xp_logs_discord is not used in app code, but let's add proper integrity
--    if the referenced discord tables are present in the schema.
-- -----------------------------------------------------------------------------
-- Delete xp_logs_discord rows with orphaned user_id (not in users_discord)
DELETE FROM xp_logs_discord
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users_discord')
  AND user_id NOT IN (SELECT id FROM users_discord);

-- Delete xp_logs_discord rows with orphaned guild_id (not in guilds_discord)
DELETE FROM xp_logs_discord
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'guilds_discord')
  AND guild_id IS NOT NULL
  AND guild_id NOT IN (SELECT id FROM guilds_discord);

DO $$
BEGIN
  -- FK: xp_logs_discord.user_id → users_discord(id)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users_discord')
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'xp_logs_discord_user_id_fkey'
      AND table_name = 'xp_logs_discord'
  ) THEN
    ALTER TABLE xp_logs_discord
      ADD CONSTRAINT xp_logs_discord_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users_discord(id) ON DELETE CASCADE;
  END IF;
END
$$;

DO $$
BEGIN
  -- FK: xp_logs_discord.guild_id → guilds_discord(id)
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'guilds_discord')
  AND NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'xp_logs_discord_guild_id_fkey'
      AND table_name = 'xp_logs_discord'
  ) THEN
    ALTER TABLE xp_logs_discord
      ADD CONSTRAINT xp_logs_discord_guild_id_fkey
      FOREIGN KEY (guild_id) REFERENCES guilds_discord(id) ON DELETE SET NULL;
  END IF;
END
$$;

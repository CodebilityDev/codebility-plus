-- ================================
-- Discord Bot Database Rollback
-- ================================
-- This rollback script drops all Discord bot tables
-- ⚠️ WARNING: This will delete ALL Discord bot data!
-- Use only if you need to completely reset the bot database
-- Created: 2025-01-25

-- ================================
-- Drop tables in reverse dependency order
-- ================================

-- Drop views first
DROP VIEW IF EXISTS user_rewards_summary_discord CASCADE;
DROP VIEW IF EXISTS guild_leaderboard_discord CASCADE;

-- Drop dependent tables
DROP TABLE IF EXISTS xp_logs_discord CASCADE;
DROP TABLE IF EXISTS user_rewards_discord CASCADE;
DROP TABLE IF EXISTS level_rewards_discord CASCADE;
DROP TABLE IF EXISTS settings_discord CASCADE;
DROP TABLE IF EXISTS xp_config_discord CASCADE;
DROP TABLE IF EXISTS user_stats_discord CASCADE;

-- Drop main tables
DROP TABLE IF EXISTS guilds_discord CASCADE;
DROP TABLE IF EXISTS users_discord CASCADE;

-- Drop the update trigger function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ================================
-- Verification
-- ================================
-- Run this to verify all tables are dropped:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name LIKE '%discord%';

-- Expected result: No rows (all Discord tables removed)

-- ================================
-- Rollback Complete
-- ================================
-- All Discord bot tables have been removed.
-- To restore, run the migration script: 001_create_discord_tables.sql

-- ================================
-- Discord Bot Database Migration
-- ================================
-- This migration creates all necessary tables for the Discord XP/Leveling Bot
-- Run this in Supabase SQL Editor or via Supabase CLI
-- Created: 2025-01-25

-- ================================
-- 1. Create users_discord table
-- ================================
CREATE TABLE IF NOT EXISTS users_discord (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  discriminator TEXT DEFAULT '0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_discord_username ON users_discord(username);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_discord_updated_at
  BEFORE UPDATE ON users_discord
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 2. Create guilds_discord table
-- ================================
CREATE TABLE IF NOT EXISTS guilds_discord (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon_url TEXT,
  owner_id TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_guilds_discord_active ON guilds_discord(active);

-- Add trigger for updated_at
CREATE TRIGGER update_guilds_discord_updated_at
  BEFORE UPDATE ON guilds_discord
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 3. Create user_stats_discord table
-- ================================
CREATE TABLE IF NOT EXISTS user_stats_discord (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL REFERENCES guilds_discord(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users_discord(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0 CHECK (xp >= 0),
  level INTEGER DEFAULT 0 CHECK (level >= 0),
  total_messages INTEGER DEFAULT 0 CHECK (total_messages >= 0),
  last_message_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_guild_user UNIQUE (guild_id, user_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_stats_guild ON user_stats_discord(guild_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user ON user_stats_discord(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_level ON user_stats_discord(level DESC, xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_active ON user_stats_discord(guild_id, active);

-- Add trigger for updated_at
CREATE TRIGGER update_user_stats_discord_updated_at
  BEFORE UPDATE ON user_stats_discord
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 4. Create xp_config_discord table
-- ================================
CREATE TABLE IF NOT EXISTS xp_config_discord (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL UNIQUE REFERENCES guilds_discord(id) ON DELETE CASCADE,
  min_xp INTEGER DEFAULT 5 CHECK (min_xp >= 1 AND min_xp <= 1000),
  max_xp INTEGER DEFAULT 15 CHECK (max_xp >= 1 AND max_xp <= 1000),
  cooldown INTEGER DEFAULT 60 CHECK (cooldown >= 5 AND cooldown <= 3600),
  levelup_channel TEXT,
  levelup_message TEXT DEFAULT '🎉 {user} leveled up to **Level {level}**!',
  xp_gain_channel TEXT,
  xp_gain_message TEXT DEFAULT '🎯 {user} gained **{xp} XP**! (Total: {total_xp} XP | Level {level})',
  notify_on_xp_gain BOOLEAN DEFAULT FALSE,
  reward_notification_channel TEXT,
  reward_notification_message TEXT DEFAULT '🎁 {user} reached **Level {level}** and earned the role(s): {roles}!',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_xp_range CHECK (min_xp <= max_xp)
);

-- Add trigger for updated_at
CREATE TRIGGER update_xp_config_discord_updated_at
  BEFORE UPDATE ON xp_config_discord
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 5. Create level_rewards_discord table
-- ================================
CREATE TABLE IF NOT EXISTS level_rewards_discord (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL REFERENCES guilds_discord(id) ON DELETE CASCADE,
  level INTEGER NOT NULL CHECK (level >= 1 AND level <= 100),
  reward_type TEXT NOT NULL CHECK (reward_type IN ('role', 'badge', 'other')),
  reward_value TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_guild_level_reward UNIQUE (guild_id, level, reward_value)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_level_rewards_guild ON level_rewards_discord(guild_id);
CREATE INDEX IF NOT EXISTS idx_level_rewards_level ON level_rewards_discord(guild_id, level);

-- ================================
-- 6. Create user_rewards_discord table
-- ================================
CREATE TABLE IF NOT EXISTS user_rewards_discord (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL REFERENCES guilds_discord(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users_discord(id) ON DELETE CASCADE,
  reward_id BIGINT NOT NULL REFERENCES level_rewards_discord(id) ON DELETE CASCADE,
  level_earned INTEGER NOT NULL CHECK (level_earned >= 1),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_guild_user_reward UNIQUE (guild_id, user_id, reward_id)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_rewards_guild_user ON user_rewards_discord(guild_id, user_id);
CREATE INDEX IF NOT EXISTS idx_user_rewards_reward ON user_rewards_discord(reward_id);

-- ================================
-- 7. Create xp_logs_discord table
-- ================================
CREATE TABLE IF NOT EXISTS xp_logs_discord (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL REFERENCES guilds_discord(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users_discord(id) ON DELETE CASCADE,
  message_id TEXT,
  xp_earned INTEGER NOT NULL CHECK (xp_earned > 0),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for querying logs
CREATE INDEX IF NOT EXISTS idx_xp_logs_guild ON xp_logs_discord(guild_id);
CREATE INDEX IF NOT EXISTS idx_xp_logs_user ON xp_logs_discord(guild_id, user_id);
CREATE INDEX IF NOT EXISTS idx_xp_logs_created ON xp_logs_discord(created_at DESC);

-- ================================
-- 8. Create settings_discord table (optional, for sync)
-- ================================
CREATE TABLE IF NOT EXISTS settings_discord (
  guild_id TEXT PRIMARY KEY REFERENCES guilds_discord(id) ON DELETE CASCADE,
  xp_per_message INTEGER DEFAULT 10,
  cooldown_seconds INTEGER DEFAULT 60,
  level_up_channel_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add trigger for updated_at
CREATE TRIGGER update_settings_discord_updated_at
  BEFORE UPDATE ON settings_discord
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================
-- 9. Create helpful views (optional)
-- ================================

-- View: Guild Leaderboard
CREATE OR REPLACE VIEW guild_leaderboard_discord AS
SELECT
  us.guild_id,
  us.user_id,
  u.username,
  u.display_name,
  us.xp,
  us.level,
  us.total_messages,
  us.last_message_at,
  RANK() OVER (PARTITION BY us.guild_id ORDER BY us.level DESC, us.xp DESC) as rank
FROM user_stats_discord us
JOIN users_discord u ON us.user_id = u.id
WHERE us.active = TRUE
ORDER BY us.guild_id, rank;

-- View: User Rewards Summary
CREATE OR REPLACE VIEW user_rewards_summary_discord AS
SELECT
  ur.guild_id,
  ur.user_id,
  u.username,
  COUNT(ur.id) as total_rewards,
  ARRAY_AGG(lr.reward_value ORDER BY lr.level) as reward_values,
  ARRAY_AGG(lr.level ORDER BY lr.level) as reward_levels
FROM user_rewards_discord ur
JOIN users_discord u ON ur.user_id = u.id
JOIN level_rewards_discord lr ON ur.reward_id = lr.id
GROUP BY ur.guild_id, ur.user_id, u.username;

-- ================================
-- 10. Grant necessary permissions
-- ================================
-- Note: Adjust based on your Supabase setup and security requirements

-- If using Row Level Security (RLS), enable it:
ALTER TABLE users_discord ENABLE ROW LEVEL SECURITY;
ALTER TABLE guilds_discord ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats_discord ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_config_discord ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_rewards_discord ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards_discord ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_logs_discord ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings_discord ENABLE ROW LEVEL SECURITY;

-- Create policies to allow service role full access
-- (The bot uses service_role key which bypasses RLS by default)
-- These policies are for authenticated users accessing via the dashboard

CREATE POLICY "Service role has full access to users_discord"
  ON users_discord FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to guilds_discord"
  ON guilds_discord FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to user_stats_discord"
  ON user_stats_discord FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to xp_config_discord"
  ON xp_config_discord FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to level_rewards_discord"
  ON level_rewards_discord FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to user_rewards_discord"
  ON user_rewards_discord FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to xp_logs_discord"
  ON xp_logs_discord FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to settings_discord"
  ON settings_discord FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- ================================
-- 11. Verification queries
-- ================================
-- Run these to verify the migration was successful:

-- Check all tables exist
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name LIKE '%discord%';

-- Check constraints
-- SELECT constraint_name, table_name FROM information_schema.table_constraints
-- WHERE table_schema = 'public'
-- AND table_name LIKE '%discord%';

-- Check indexes
-- SELECT indexname, tablename FROM pg_indexes
-- WHERE schemaname = 'public'
-- AND tablename LIKE '%discord%';

-- ================================
-- Migration Complete
-- ================================
-- All Discord bot tables, indexes, triggers, and policies have been created.
-- The bot should now be able to store and retrieve data successfully.

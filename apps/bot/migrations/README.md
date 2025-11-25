# Discord Bot Database Migrations

This directory contains SQL migration scripts for the Discord XP/Leveling Bot.

## 📋 Prerequisites

- Supabase project with PostgreSQL database
- Supabase service role key (found in Project Settings > API)
- Access to Supabase SQL Editor or Supabase CLI

## 🚀 Running Migrations

### Option 1: Using Supabase Dashboard (Recommended for first-time setup)

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to `SQL Editor` in the left sidebar

2. **Run the Migration**
   - Click `New Query`
   - Copy the entire contents of `001_create_discord_tables.sql`
   - Paste into the SQL editor
   - Click `Run` or press `Ctrl/Cmd + Enter`

3. **Verify Success**
   - Check the output for any errors
   - Run verification query:
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name LIKE '%discord%';
   ```
   - You should see 8 tables:
     - `users_discord`
     - `guilds_discord`
     - `user_stats_discord`
     - `xp_config_discord`
     - `level_rewards_discord`
     - `user_rewards_discord`
     - `xp_logs_discord`
     - `settings_discord`

### Option 2: Using Supabase CLI

1. **Install Supabase CLI** (if not already installed)
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Your Project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

4. **Run Migration**
   ```bash
   supabase db push
   ```

### Option 3: Using psql (Advanced)

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres" \
  -f migrations/001_create_discord_tables.sql
```

## 📊 Migration Files

| File | Description | Purpose |
|------|-------------|---------|
| `001_create_discord_tables.sql` | Initial schema setup | Creates all tables, indexes, triggers, and RLS policies |
| `002_rollback_discord_tables.sql` | Rollback script | **⚠️ DANGER:** Drops all Discord bot tables |
| `README.md` | This file | Migration documentation and instructions |

## 🔐 Row Level Security (RLS)

The migration automatically:
- ✅ Enables RLS on all tables
- ✅ Creates policies allowing `service_role` full access
- ✅ Protects data from unauthorized access

**Important:** The bot uses the `service_role` key which **bypasses RLS** for full database access.

## 🗂️ Database Schema Overview

### Core Tables

#### `users_discord`
Stores Discord user information
- Primary Key: `id` (Discord user ID)
- Tracks: username, display_name, avatar_url
- Auto-updated: `updated_at` timestamp

#### `guilds_discord`
Stores Discord server (guild) information
- Primary Key: `id` (Discord guild ID)
- Tracks: name, icon_url, owner_id, active status
- Auto-updated: `updated_at` timestamp

#### `user_stats_discord`
Stores XP and level data per user per guild
- Composite Unique Key: `(guild_id, user_id)`
- Tracks: xp, level, total_messages, last_message_at
- Constraints: XP, level, and messages must be non-negative
- Indexes: Optimized for leaderboard queries

#### `xp_config_discord`
Guild-specific XP system configuration
- One config per guild (UNIQUE on `guild_id`)
- Configurable: min_xp, max_xp, cooldown, channels, messages
- Default values provided for all fields

#### `level_rewards_discord`
Role/badge rewards at specific levels
- Composite Unique: `(guild_id, level, reward_value)`
- Supports: role, badge, or custom reward types
- Level range: 1-100

#### `user_rewards_discord`
Tracks which rewards users have earned
- Composite Unique: `(guild_id, user_id, reward_id)`
- Prevents duplicate reward grants
- Cascades on deletion

#### `xp_logs_discord`
Audit trail of all XP gains
- Logs: guild_id, user_id, message_id, xp_earned, reason
- Useful for debugging and analytics
- Indexed by guild and timestamp

#### `settings_discord`
Alternative/legacy settings storage
- Optional sync table for compatibility
- Can be used for additional bot settings

### Views

#### `guild_leaderboard_discord`
Pre-computed leaderboard view
- Ranks users by level and XP per guild
- Includes user details and stats
- Optimized for `/leaderboard` command

#### `user_rewards_summary_discord`
Aggregated view of user rewards
- Shows total rewards and lists per user
- Useful for reward management

## 🔍 Verification Queries

### Check Tables Exist
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE '%discord%'
ORDER BY table_name;
```

### Check Constraints
```sql
SELECT constraint_name, table_name, constraint_type
FROM information_schema.table_constraints
WHERE table_schema = 'public'
AND table_name LIKE '%discord%'
ORDER BY table_name, constraint_type;
```

### Check Indexes
```sql
SELECT indexname, tablename
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename LIKE '%discord%'
ORDER BY tablename, indexname;
```

### Check RLS Policies
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
AND tablename LIKE '%discord%';
```

### Sample Data Check
```sql
-- Check if any data exists
SELECT
  (SELECT COUNT(*) FROM users_discord) as users,
  (SELECT COUNT(*) FROM guilds_discord) as guilds,
  (SELECT COUNT(*) FROM user_stats_discord) as user_stats,
  (SELECT COUNT(*) FROM xp_config_discord) as configs,
  (SELECT COUNT(*) FROM level_rewards_discord) as rewards,
  (SELECT COUNT(*) FROM user_rewards_discord) as user_rewards,
  (SELECT COUNT(*) FROM xp_logs_discord) as xp_logs;
```

## 🛠️ Troubleshooting

### Migration Fails with "relation already exists"
**Solution:** Tables already exist. Either:
1. Skip migration (tables are already set up)
2. Run rollback script first: `002_rollback_discord_tables.sql`

### Foreign Key Constraint Violations
**Cause:** Trying to insert data with missing parent records
**Solution:** Ensure `users_discord` and `guilds_discord` records exist before inserting into dependent tables

### Permission Denied Errors
**Cause:** Using anon key instead of service_role key
**Solution:** Verify your bot is using `SUPABASE_SERVICE_ROLE_KEY` from `.env`

### Upsert Conflicts Not Working
**Cause:** Incorrect `onConflict` parameter
**Solution:** Use composite key: `onConflict: "guild_id,user_id"`

### RLS Blocking Bot Access
**Cause:** Service role key not set correctly
**Solution:**
1. Verify environment variable: `SUPABASE_SERVICE_ROLE_KEY`
2. Service role key bypasses RLS automatically
3. Check bot logs for "401 Unauthorized" errors

## 🔄 Rolling Back

**⚠️ WARNING:** This will delete ALL Discord bot data!

```sql
-- Option 1: Run in SQL Editor
-- Copy contents of 002_rollback_discord_tables.sql and run

-- Option 2: Using psql
psql "YOUR_DATABASE_URL" -f migrations/002_rollback_discord_tables.sql
```

## 📝 Adding New Migrations

When modifying the schema:

1. **Create New Migration File**
   ```
   migrations/003_add_new_feature.sql
   ```

2. **Include Rollback Section**
   ```sql
   -- Migration
   ALTER TABLE user_stats_discord ADD COLUMN prestige INTEGER DEFAULT 0;

   -- Rollback (at bottom of file)
   -- ALTER TABLE user_stats_discord DROP COLUMN prestige;
   ```

3. **Test Locally First**
   - Run on local Supabase instance
   - Verify no errors
   - Test rollback

4. **Document Changes**
   - Update this README
   - Add comments in SQL
   - Update database schema diagram if available

## 📞 Support

If you encounter issues:
1. Check Supabase logs in Dashboard > Logs
2. Review bot console output for errors
3. Verify database connection with:
   ```sql
   SELECT NOW(); -- Should return current timestamp
   ```

## 🔗 Related Documentation

- [Supabase PostgreSQL Docs](https://supabase.com/docs/guides/database/overview)
- [PostgreSQL Official Docs](https://www.postgresql.org/docs/)
- [Bot README](../README.md)
- [Database Schema](../database-schema.md) _(if exists)_

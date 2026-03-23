# Discord XP & Leveling Bot

A feature-rich Discord bot built with TypeScript and Discord.js v14, featuring an advanced XP/leveling system with role rewards, customizable rank cards, and comprehensive guild management.

## Features

- 🎮 **XP System**: Earn XP by sending messages with configurable gains and cooldowns
- 📊 **Rank Cards**: Beautiful, canvas-generated rank cards showing level progress
- 🏆 **Leaderboards**: Server-wide leaderboards to see top members
- 🎁 **Role Rewards**: Automatic role assignment at specific levels
- 🎨 **Customizable**: Configure XP rates, messages, and notification channels per guild
- 📈 **Progress Tracking**: Detailed statistics and XP logs
- 🏷️ **Smart Nicknames**: Auto-update nicknames with highest earned role
- 💾 **Database Persistence**: All data stored in Supabase (PostgreSQL)

## Commands

| Command | Description |
|---------|-------------|
| `/rank [user]` | View your or another user's rank card |
| `/leaderboard` | Display the server leaderboard |
| `/configxp` | Configure XP system settings (Admin only) |
| `/rewards` | Manage level-based role rewards (Admin only) |
| `/resetxp <user>` | Reset a user's XP (Admin only) |
| `/levelupmessage` | Customize level-up messages (Admin only) |
| `/badges` | View available badges and achievements |
| `/help` | Display help information |

## Prerequisites

- Node.js 18.x or higher
- pnpm (or npm/yarn)
- Discord Bot Token
- Supabase account with PostgreSQL database

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd apps/bot
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `apps/bot` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_application_id_here

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 4. Database Setup

#### Create the following tables in your Supabase database:

```sql
-- Users table
CREATE TABLE users_discord (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  discriminator TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guilds table
CREATE TABLE guilds_discord (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon_url TEXT,
  owner_id TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User stats per guild
CREATE TABLE user_stats_discord (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL REFERENCES guilds_discord(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users_discord(id) ON DELETE CASCADE,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guild_id, user_id)
);

-- XP configuration per guild
CREATE TABLE xp_config_discord (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL UNIQUE REFERENCES guilds_discord(id) ON DELETE CASCADE,
  min_xp INTEGER DEFAULT 5,
  max_xp INTEGER DEFAULT 15,
  cooldown INTEGER DEFAULT 60,
  levelup_channel TEXT,
  levelup_message TEXT,
  xp_gain_channel TEXT,
  xp_gain_message TEXT,
  notify_on_xp_gain BOOLEAN DEFAULT FALSE,
  reward_notification_channel TEXT,
  reward_notification_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Level rewards (roles, badges, etc.)
CREATE TABLE level_rewards_discord (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL REFERENCES guilds_discord(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  reward_type TEXT NOT NULL, -- 'role', 'badge', etc.
  reward_value TEXT NOT NULL, -- role ID, badge name, etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guild_id, level, reward_value)
);

-- User rewards tracking
CREATE TABLE user_rewards_discord (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL REFERENCES guilds_discord(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users_discord(id) ON DELETE CASCADE,
  reward_id BIGINT NOT NULL REFERENCES level_rewards_discord(id) ON DELETE CASCADE,
  level_earned INTEGER NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(guild_id, user_id, reward_id)
);

-- XP logs for auditing
CREATE TABLE xp_logs_discord (
  id BIGSERIAL PRIMARY KEY,
  guild_id TEXT NOT NULL REFERENCES guilds_discord(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users_discord(id) ON DELETE CASCADE,
  message_id TEXT,
  xp_earned INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_stats_guild ON user_stats_discord(guild_id);
CREATE INDEX idx_user_stats_user ON user_stats_discord(user_id);
CREATE INDEX idx_user_stats_level ON user_stats_discord(level DESC, xp DESC);
CREATE INDEX idx_level_rewards_guild ON level_rewards_discord(guild_id);
CREATE INDEX idx_xp_logs_guild ON xp_logs_discord(guild_id);
```

### 5. Discord Bot Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token and add to `.env`
5. Enable the following **Privileged Gateway Intents**:
   - Server Members Intent
   - Message Content Intent
6. Go to "OAuth2 > URL Generator"
7. Select scopes: `bot`, `applications.commands`
8. Select bot permissions:
   - Read Messages/View Channels
   - Send Messages
   - Manage Roles
   - Manage Nicknames
9. Copy the generated URL and invite the bot to your server

## Development

### Run in Development Mode

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build
```

### Start Production Build

```bash
pnpm start
```

## Configuration

### XP System

Configure XP gains per guild using `/configxp`:
- **Min/Max XP**: XP range earned per message (default: 5-15)
- **Cooldown**: Seconds between XP gains per user (default: 60s)
- **Level-up Channel**: Where to send level-up notifications
- **XP Gain Channel**: Where to send XP gain notifications (optional)

### Custom Messages

Use placeholders in your custom messages:
- `{user}` - Mentions the user
- `{level}` - Current level
- `{xp}` - XP gained
- `{total_xp}` - Total XP
- `{roles}` - Earned roles (for reward notifications)

Example:
```
🎉 Congratulations {user}! You've reached **Level {level}**!
```

### Role Rewards

Set up automatic role rewards using `/rewards`:
1. Choose a level threshold
2. Select a role to grant
3. Bot will automatically assign the role when users reach that level

## Project Structure

```
apps/bot/
├── commands/          # Slash command handlers
│   ├── badges.ts
│   ├── configXP.ts
│   ├── help.ts
│   ├── leaderboard.ts
│   ├── levelUpMessage.ts
│   ├── rankCard.ts
│   ├── resetXP.ts
│   └── rewards.ts
├── events/            # Discord event handlers
│   ├── autoRoleAssignment.ts
│   ├── guildCreate.ts
│   ├── guildDelete.ts
│   ├── guildMemberRemove.ts
│   └── messageCreate.ts
├── utils/             # Utility functions
│   ├── configStore.ts
│   ├── rankCardGen.ts      # Canvas rank card generation
│   ├── supabase.bot.ts     # Database client
│   ├── xpConstants.ts      # XP calculation constants
│   ├── xpHelper.ts         # XP calculation helpers
│   └── xpSystem.ts         # Core XP logic
├── constants/         # Constants and configurations
├── types/            # TypeScript type definitions
├── index.ts          # Bot entry point
├── package.json
└── tsconfig.json
```

## Troubleshooting

### Bot not responding to commands
- Verify bot has proper permissions in your Discord server
- Check that application commands are registered (happens on bot startup)
- Ensure Message Content Intent is enabled

### XP not being awarded
- Check cooldown settings (default 60 seconds)
- Verify database connection in bot logs
- Ensure user has proper permissions to send messages

### Role rewards not working
- Verify bot role is higher than the roles it's trying to assign
- Check Manage Roles permission is enabled
- Review bot logs for permission errors

## Security Notes

⚠️ **Never commit `.env` file to version control**

The bot uses Supabase Service Role key which has full database access. Ensure:
- Environment variables are properly secured
- Bot is hosted in a secure environment
- Regular security updates are applied

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]

## Support

For issues or questions:
- Open an issue on GitHub
- Contact the development team

---

Built with ❤️ using Discord.js v14 and TypeScript

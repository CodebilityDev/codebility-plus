// apps/bot/types/database.ts

/**
 * Database table type definitions
 */

export interface UserStatsDiscord {
  id?: number;
  guild_id: string;
  user_id: string;
  xp: number;
  level: number;
  total_messages: number;
  last_message_at?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface XPConfigDiscord {
  id?: number;
  guild_id: string;
  min_xp: number;
  max_xp: number;
  cooldown: number;
  levelup_channel?: string | null;
  levelup_message?: string;
  xp_gain_channel?: string | null;
  xp_gain_message?: string;
  notify_on_xp_gain: boolean;
  reward_notification_channel?: string | null;
  reward_notification_message?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LevelRewardDiscord {
  id: number;
  guild_id: string;
  level: number;
  reward_type: 'role' | 'badge' | 'other';
  reward_value: string;
  description?: string;
  created_at?: string;
}

export interface UserRewardDiscord {
  id?: number;
  guild_id: string;
  user_id: string;
  reward_id: number;
  level_earned: number;
  granted_at?: string;
}

export interface LeaderboardEntry {
  user_id: string;
  xp: number;
  level: number;
  total_messages: number;
}

export interface UserDiscord {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  discriminator?: string;
  created_at?: string;
  updated_at?: string;
}

export interface GuildDiscord {
  id: string;
  name: string;
  icon_url?: string;
  owner_id?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

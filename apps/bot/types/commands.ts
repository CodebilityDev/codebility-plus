// apps/bot/types/commands.ts

import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

/**
 * Command structure for Discord bot commands
 */
export interface CommandModule {
  name: string;
  data: SlashCommandBuilder;
}

export interface CommandExecuteFunction {
  (interaction: ChatInputCommandInteraction): Promise<void>;
}

/**
 * XP Config Update Data
 * Used for partial updates to xp_config_discord table
 */
export interface XPConfigUpdateData {
  guild_id: string;
  min_xp?: number;
  max_xp?: number;
  cooldown?: number;
  levelup_channel?: string | null;
  levelup_message?: string;
  xp_gain_channel?: string | null;
  xp_gain_message?: string;
  notify_on_xp_gain?: boolean;
  reward_notification_channel?: string | null;
  reward_notification_message?: string;
  active?: boolean;
}

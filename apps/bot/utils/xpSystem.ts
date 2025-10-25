// apps/bot/utils/xpSystem.ts
import { supabaseBot } from "./supabase.bot";
import { Message, TextChannel } from "discord.js";
import { getLevelProgress } from "./xpHelper"; // ✅ updated import

/** XP configuration for each guild */
interface XPConfig {
  minXP: number;
  maxXP: number;
  cooldown: number;
  levelUpChannel?: string | null;
  levelUpMessage?: string;
}

// In-memory cooldown map
const cooldowns = new Map<string, number>();

// ---------------------------
// Ensure User Exists
// ---------------------------
async function ensureUserExists(
  userId: string,
  username: string,
  avatarUrl?: string,
  discriminator?: string
) {
  try {
    const { error } = await supabaseBot
      .from("users_discord")
      .upsert(
        {
          id: userId,
          username: username || "Unknown User",
          avatar_url: avatarUrl || null,
          discriminator: discriminator || "0",
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("❌ Error ensuring user exists:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("❌ Exception in ensureUserExists:", err);
    return false;
  }
}

// ---------------------------
// Ensure Guild Exists
// ---------------------------
async function ensureGuildExists(
  guildId: string,
  guildName: string,
  iconUrl?: string,
  ownerId?: string
) {
  try {
    const { error } = await supabaseBot
      .from("guilds_discord")
      .upsert(
        {
          id: guildId,
          name: guildName || "Unknown Guild",
          icon_url: iconUrl || null,
          owner_id: ownerId || null,
          active: true,
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("❌ Error ensuring guild exists:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("❌ Exception in ensureGuildExists:", err);
    return false;
  }
}

// ---------------------------
// Handle XP
// ---------------------------
export async function handleXP(message: Message) {
  if (message.author.bot || !message.guild) return;

  const guildId = message.guild.id;
  const userId = message.author.id;
  const username = message.author.username;
  const avatarUrl = message.author.displayAvatarURL();
  const guildName = message.guild.name;
  const now = Date.now();

  try {
    // Ensure user and guild exist
    const [userExists, guildExists] = await Promise.all([
      ensureUserExists(
        userId,
        username,
        avatarUrl,
        message.author.discriminator || "0"
      ),
      ensureGuildExists(
        guildId,
        guildName,
        message.guild.iconURL() || undefined,
        message.guild.ownerId || undefined
      ),
    ]);

    if (!userExists || !guildExists) return;

    // Fetch XP config
    const { data: configData, error: configError } = await supabaseBot
      .from("xp_config_discord")
      .select("*")
      .eq("guild_id", guildId)
      .maybeSingle();

    if (configError) console.error("❌ Error fetching XP config:", configError);

    const config: XPConfig = {
      minXP: configData?.min_xp ?? 5,
      maxXP: configData?.max_xp ?? 15,
      cooldown: configData?.cooldown ?? 60,
      levelUpChannel: configData?.levelup_channel ?? null,
      levelUpMessage:
        configData?.levelup_message ?? "🎉 {user} leveled up to **Level {level}**!",
    };

    // Fetch user stats
    const { data: userData, error: statsError } = await supabaseBot
      .from("user_stats_discord")
      .select("*")
      .eq("guild_id", guildId)
      .eq("user_id", userId)
      .maybeSingle();

    if (statsError) console.error("❌ Error fetching user stats:", statsError);

    const currentXP = userData?.xp ?? 0;
    const currentLevel = userData?.level ?? 0;
    const totalMessages = (userData?.total_messages ?? 0) + 1;

    // Cooldown check
    const cooldownKey = `${guildId}:${userId}`;
    const lastAction = cooldowns.get(cooldownKey) ?? 0;
    if (now - lastAction < config.cooldown * 1000) return;
    cooldowns.set(cooldownKey, now);

    // XP gain
    const gainedXP =
      Math.floor(Math.random() * (config.maxXP - config.minXP + 1)) +
      config.minXP;
    const totalXP = currentXP + gainedXP;

    const progress = getLevelProgress(totalXP);
    const newLevel = progress.level;
    const leveledUp = newLevel > currentLevel;

    // Update stats
    const { error: updateError } = await supabaseBot
      .from("user_stats_discord")
      .upsert(
        {
          guild_id: guildId,
          user_id: userId,
          xp: totalXP,
          level: newLevel,
          total_messages: totalMessages,
          last_message_at: new Date().toISOString(),
          active: true,
        },
        { onConflict: "guild_id,user_id" }
      );

    if (updateError) console.error("❌ Error updating user stats:", updateError);

    // Log XP
    const { error: logError } = await supabaseBot
      .from("xp_logs_discord")
      .insert({
        guild_id: guildId,
        user_id: userId,
        message_id: message.id,
        xp_earned: gainedXP,
        reason: "Message XP",
      });

    if (logError) console.error("❌ Error logging XP:", logError);
    
    // Handle level-up
    if (leveledUp) {
      // Use the level-up message from config, default if missing
      const template =
        config.levelUpMessage || "🎉 {user} leveled up to **Level {level}**!";
      
      const announcement = template
        .replace("{user}", `<@${userId}>`)
        .replace("{level}", newLevel.toString());

      try {
        let targetChannel: TextChannel | null = null;
        const channelId = config.levelUpChannel ?? null;

        if (channelId) {
          const ch = message.guild.channels.cache.get(channelId);
          if (ch?.isTextBased()) targetChannel = ch as TextChannel;
        }

        if (!targetChannel && message.channel.isTextBased())
          targetChannel = message.channel as TextChannel;

        if (targetChannel) await targetChannel.send(announcement);
      } catch (err) {
        console.error("❌ Error sending level-up message:", err);
      }
    }
  } catch (error) {
    console.error("❌ Critical error in handleXP:", error);
  }
}

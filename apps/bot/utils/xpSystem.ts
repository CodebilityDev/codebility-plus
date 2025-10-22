// app/bot/utils/xpSystem.ts
import { supabaseBot } from "./supabase.bot";
import { Message, TextChannel } from "discord.js";

interface XPConfig {
  minXP: number;
  maxXP: number;
  cooldown: number;
  levelUpChannel?: string | null;
  levelUpMessage?: string;
}

const cooldowns = new Map<string, number>();

/**
 * Ensures user exists in users_discord table
 */
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

/**
 * Ensures guild exists in guilds_discord table
 */
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

export async function handleXP(message: Message) {
  if (message.author.bot || !message.guild) return;

  const guildId = message.guild.id;
  const userId = message.author.id;
  const username = message.author.username;
  const avatarUrl = message.author.displayAvatarURL();
  const guildName = message.guild.name;

  console.log("🎯 handleXP called:", {
    userId,
    username,
    guildId,
    messageId: message.id,
  });

  const now = Date.now();

  try {
    // Ensure user and guild exist (for foreign key constraints)
    console.log("👤 Ensuring user and guild exist...");
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

    if (!userExists || !guildExists) {
      console.error("❌ Failed to ensure user or guild exists");
      return;
    }
    console.log("✅ User and guild ensured");

    // Fetch XP config
    console.log("⚙️ Fetching XP config...");
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
        configData?.levelup_message ??
        "🎉 {user} leveled up to **Level {level}**!",
    };

    console.log("📋 Config:", config);

    // Fetch user stats
    console.log("📊 Fetching user stats...");
    const { data: userData, error: statsError } = await supabaseBot
      .from("user_stats_discord")
      .select("*")
      .eq("guild_id", guildId)
      .eq("user_id", userId)
      .maybeSingle();

    if (statsError) console.error("❌ Error fetching user stats:", statsError);

    const currentXP = userData?.xp ?? 0;
    const currentLevel = userData?.level ?? 1;
    const totalMessages = (userData?.total_messages ?? 0) + 1;
    const lastMessageAt = userData?.last_message_at
      ? new Date(userData.last_message_at).getTime()
      : 0;

    // Cooldown
    const timeSinceLastMessage = now - lastMessageAt;
    const cooldownMs = config.cooldown * 1000;
    if (timeSinceLastMessage < cooldownMs) {
      console.log("⏭️ Skipping XP: User is on cooldown");
      return;
    }

    // Calculate XP gain
    const gainedXP =
      Math.floor(Math.random() * (config.maxXP - config.minXP + 1)) +
      config.minXP;
    const newXP = currentXP + gainedXP;
    let newLevel = currentLevel;
    let leveledUp = false;
    const nextLevelXP = 100 * (currentLevel + 1);

    if (newXP >= nextLevelXP) {
      leveledUp = true;
      newLevel++;
    }

    console.log(
      `💎 XP gained: ${gainedXP} | ${currentXP} → ${newXP} | Level: ${currentLevel} → ${newLevel}`
    );

    // ✅ FIX: Remove username (belongs to users_discord, not user_stats_discord)
    console.log("💾 Updating user stats...");
    const { error: updateError } = await supabaseBot
      .from("user_stats_discord")
      .upsert(
        {
          guild_id: guildId,
          user_id: userId,
          xp: newXP,
          level: newLevel,
          total_messages: totalMessages,
          last_message_at: new Date().toISOString(),
          active: true,
        },
        { onConflict: "guild_id,user_id" }
      );

    if (updateError) {
      console.error("❌ Error updating user stats:", updateError);
      return;
    }
    console.log("✅ User stats updated successfully");

    // Log XP gain
    console.log("📝 Logging XP gain...");
    const logPayload = {
      guild_id: guildId,
      user_id: userId,
      message_id: message.id,
      xp_earned: gainedXP,
      reason: "Message XP",
    };

    const { error: logError, data: logData } = await supabaseBot
      .from("xp_logs_discord")
      .insert(logPayload)
      .select();

    if (logError) {
      console.error("❌ Error logging XP:", logError);
    } else {
      console.log("✅ XP logged successfully:", logData);
    }

    // Level-up handler
    if (leveledUp) {
      console.log(`🎉 ${username} leveled up to ${newLevel}!`);

      const { data: levelupConfig } = await supabaseBot
        .from("levelup_messages_discord")
        .select("*")
        .eq("guild_id", guildId)
        .maybeSingle();

      if (levelupConfig && levelupConfig.is_enabled) {
        const template =
          levelupConfig.message_template || config.levelUpMessage;
        const announcement = template
          .replace("{user}", `<@${userId}>`)
          .replace("{level}", newLevel.toString());

        try {
          let targetChannel: TextChannel | null = null;
          if (levelupConfig.channel_id) {
            const configuredChannel = message.guild.channels.cache.get(
              levelupConfig.channel_id
            );
            if (configuredChannel?.isTextBased()) {
              targetChannel = configuredChannel as TextChannel;
            }
          }

          if (!targetChannel && message.channel.isTextBased()) {
            targetChannel = message.channel as TextChannel;
          }

          if (targetChannel) {
            await targetChannel.send(announcement);
            console.log("✅ Level-up message sent");
          }
        } catch (err) {
          console.error("❌ Error sending level-up message:", err);
        }
      }

      // Rewards
      const { data: rewards, error: rewardsError } = await supabaseBot
        .from("level_rewards_discord")
        .select("*")
        .eq("guild_id", guildId)
        .eq("level", newLevel);

      if (rewardsError) {
        console.error("❌ Error fetching rewards:", rewardsError);
      } else if (rewards && rewards.length > 0) {
        const member = await message.guild.members
          .fetch(userId)
          .catch(() => null);

        if (member) {
          for (const reward of rewards) {
            if (reward.reward_type === "role") {
              const role = message.guild.roles.cache.get(reward.reward_value);
              if (role) {
                await member.roles.add(role).catch((err) => {
                  console.error(`❌ Error adding role ${role.name}:`, err);
                });
                console.log(
                  `✅ Awarded role ${role.name} to ${username} (Level ${newLevel})`
                );
              }
            } else if (reward.reward_type === "badge") {
              const { error: badgeError } = await supabaseBot
                .from("user_badges_discord")
                .insert({
                  user_id: userId,
                  badge_id: parseInt(reward.reward_value),
                });

              if (badgeError && badgeError.code !== "23505") {
                console.error("❌ Error awarding badge:", badgeError.message);
              } else if (!badgeError) {
                console.log(
                  `✅ Awarded badge ${reward.reward_value} to ${username}`
                );
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("❌ Critical error in handleXP:", error);
  }
}

// apps/bot/utils/xpSystem.ts
import { supabaseBot } from "./supabase.bot";
import { Message, TextChannel } from "discord.js";
import { getLevelProgress } from "./xpHelper";

/** XP configuration for each guild */
interface XPConfig {
  minXP: number;
  maxXP: number;
  cooldown: number;
  levelUpChannel?: string | null;
  levelUpMessage?: string;
  xpGainChannel?: string | null;
  xpGainMessage?: string;
  notifyOnXpGain?: boolean;
  rewardNotificationChannel?: string | null;
  rewardNotificationMessage?: string;
}

interface GrantedReward {
  rewardId: number;
  roleName: string;
  roleId: string;
}

// In-memory cooldown map
const cooldowns = new Map<string, number>();

// ---------------------------
// Ensure User Exists
// ---------------------------
async function ensureUserExists(
  userId: string,
  username: string,
  displayName: string,  // ✅ ADD THIS
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
          display_name: displayName || username || "Unknown User",  // ✅ ADD THIS
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
// 🆕 Check if User Already Has Reward
// ---------------------------
async function hasUserReceivedReward(
  guildId: string,
  userId: string,
  rewardId: number
): Promise<boolean> {
  try {
    const { data, error } = await supabaseBot
      .from("user_rewards_discord")
      .select("id")
      .eq("guild_id", guildId)
      .eq("user_id", userId)
      .eq("reward_id", rewardId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") { // PGRST116 = no rows returned
      console.error("❌ Error checking user reward:", error);
      return false;
    }

    return !!data; // Returns true if reward exists in database
  } catch (err) {
    console.error("❌ Exception in hasUserReceivedReward:", err);
    return false;
  }
}

// ---------------------------
// 🆕 Record Granted Reward
// ---------------------------
async function recordGrantedReward(
  guildId: string,
  userId: string,
  rewardId: number,
  level: number
): Promise<boolean> {
  try {
    const { error } = await supabaseBot
      .from("user_rewards_discord")
      .insert({
        guild_id: guildId,
        user_id: userId,
        reward_id: rewardId,
        level_earned: level,
      });

    if (error) {
      // If it's a duplicate key error, that's okay (race condition protection)
      if (error.code === "23505") {
        console.log(`ℹ️ Reward ${rewardId} already recorded for user ${userId}`);
        return true;
      }
      console.error("❌ Error recording granted reward:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("❌ Exception in recordGrantedReward:", err);
    return false;
  }
}

// ---------------------------
// 🆕 Update Member Nickname with Highest Role
// ---------------------------
async function updateMemberNickname(
  message: Message,
  userId: string,
  guildId: string
) {
  try {
    const member = await message.guild?.members.fetch(userId);
    if (!member) return;

    // Can't change nickname of server owner
    if (member.id === message.guild?.ownerId) {
      console.log(`ℹ️ Cannot change nickname of server owner`);
      return;
    }

    // Check if bot has permission to manage nicknames
    const botMember = message.guild?.members.me;
    if (!botMember?.permissions.has("ManageNicknames")) {
      console.log(`⚠️ Bot lacks ManageNicknames permission`);
      return;
    }

    // Fetch all user's reward roles
    const { data: userRewards, error: rewardsError } = await supabaseBot
      .from("user_rewards_discord")
      .select("reward_id")
      .eq("guild_id", guildId)
      .eq("user_id", userId);

    if (rewardsError || !userRewards || userRewards.length === 0) {
      // No rewards, remove role suffix from nickname if it exists
      const currentNickname = member.nickname || member.user.username;
      if (currentNickname.includes(" | ")) {
        const baseName = currentNickname.split(" | ")[0];
        try {
          await member.setNickname(baseName);
          console.log(`✅ Removed role suffix from ${member.user.username}'s nickname`);
        } catch (err) {
          console.error(`❌ Error removing nickname suffix:`, err);
        }
      }
      return;
    }

    // Fetch reward details
    const rewardIds = userRewards.map(r => r.reward_id);
    const { data: rewards, error: fetchError } = await supabaseBot
      .from("level_rewards_discord")
      .select("*")
      .eq("guild_id", guildId)
      .eq("reward_type", "role")
      .in("id", rewardIds)
      .order("level", { ascending: false }); // Get highest level role first

    if (fetchError || !rewards || rewards.length === 0) {
      console.log(`ℹ️ No valid role rewards found for user ${userId}`);
      return;
    }

    // Get the highest level role
    const highestReward = rewards[0];
    const role = message.guild?.roles.cache.get(highestReward.reward_value);
    
    if (!role) {
      console.log(`⚠️ Role ${highestReward.reward_value} not found`);
      return;
    }

    // Create new nickname
    const username = member.user.username;
    const newNickname = `${username} | ${role.name}`;

    // Check if nickname needs updating
    const currentNickname = member.nickname;
    if (currentNickname === newNickname) {
      console.log(`ℹ️ Nickname already set for ${username}`);
      return;
    }

    // Discord nickname limit is 32 characters
    if (newNickname.length > 32) {
      console.log(`⚠️ Nickname too long for ${username}: ${newNickname.length} chars`);
      // Try with truncated username
      const maxUsernameLength = 32 - role.name.length - 3; // 3 for " | "
      if (maxUsernameLength > 3) {
        const truncatedNickname = `${username.substring(0, maxUsernameLength)} | ${role.name}`;
        await member.setNickname(truncatedNickname);
        console.log(`✅ Set truncated nickname for ${username}: ${truncatedNickname}`);
      }
      return;
    }

    // Update nickname
    await member.setNickname(newNickname);
    console.log(`✅ Updated nickname for ${username} to: ${newNickname}`);

  } catch (error) {
    // Check for specific permission errors
    if (error instanceof Error) {
      if (error.message.includes("Missing Permissions")) {
        console.log(`⚠️ Cannot change nickname - member has higher role than bot`);
      } else {
        console.error(`❌ Error updating member nickname:`, error);
      }
    }
  }
}

// ---------------------------
// Handle Role Rewards
// ---------------------------
async function handleRoleRewards(
  message: Message,
  userId: string,
  guildId: string,
  newLevel: number,
  config: XPConfig
): Promise<GrantedReward[]> {
  const grantedRoles: GrantedReward[] = [];
  
  try {
    // Fetch all role rewards for this level
    const { data: rewards, error: rewardsError } = await supabaseBot
      .from("level_rewards_discord")
      .select("*")
      .eq("guild_id", guildId)
      .eq("level", newLevel)
      .eq("reward_type", "role");

    if (rewardsError) {
      console.error("❌ Error fetching role rewards:", rewardsError);
      return grantedRoles;
    }

    if (!rewards || rewards.length === 0) {
      console.log(`ℹ️ No role rewards found for level ${newLevel}`);
      return grantedRoles;
    }

    console.log(`🔍 Found ${rewards.length} role reward(s) for level ${newLevel}`);

    const member = await message.guild?.members.fetch(userId);
    if (!member) {
      console.error("❌ Could not fetch member");
      return grantedRoles;
    }

    // Process each role reward
    for (const reward of rewards) {
      try {
        const roleId = reward.reward_value;
        const role = message.guild?.roles.cache.get(roleId);

        if (!role) {
          console.warn(`⚠️ Role ${roleId} not found in guild`);
          continue;
        }

        // 🔍 Check if user already received this reward in database
        const alreadyInDatabase = await hasUserReceivedReward(guildId, userId, reward.id);
        
        // Check if user already has the role on Discord
        const hasRoleOnDiscord = member.roles.cache.has(roleId);
        
        // Determine if this is truly NEW
        const isNewReward = !alreadyInDatabase;
        
        if (isNewReward) {
          // This is a NEW reward!
          if (!hasRoleOnDiscord) {
            // Grant the role
            await member.roles.add(role);
            console.log(`✅ Added NEW role ${role.name} to ${member.user.username}`);
          } else {
            console.log(`ℹ️ User already has role ${role.name} on Discord, recording in database`);
          }
          
          // 💾 Record the granted reward in database
          const recorded = await recordGrantedReward(guildId, userId, reward.id, newLevel);
          
          if (recorded) {
            // Add to granted roles list for notification
            grantedRoles.push({
              rewardId: reward.id,
              roleName: role.name,
              roleId: roleId,
            });
            console.log(`📝 Recorded NEW reward ${role.name} for ${member.user.username}`);
          }
        } else {
          // Reward already in database, but we'll still include it in announcement
          // since the user just leveled up to this level
          console.log(`ℹ️ User ${member.user.username} already has reward ${reward.id} in database`);
          
          // Add to the announcement list anyway for level-up celebration
          grantedRoles.push({
            rewardId: reward.id,
            roleName: role.name,
            roleId: roleId,
          });
          console.log(`🎉 Including ${role.name} in level-up announcement`);
        }
      } catch (roleError) {
        console.error(`❌ Error processing role ${reward.reward_value}:`, roleError);
      }
    }

    // 🏷️ Update member nickname with highest role
    if (grantedRoles.length > 0) {
      await updateMemberNickname(message, userId, guildId);
    }

  } catch (error) {
    console.error("❌ Error in handleRoleRewards:", error);
  }
  
  return grantedRoles;
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
        message.author.displayName,  // ✅ ADD THIS
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
      xpGainChannel: configData?.xp_gain_channel ?? null,
      xpGainMessage:
        configData?.xp_gain_message ?? "🎯 {user} gained **{xp} XP**! (Total: {total_xp} XP | Level {level})",
      notifyOnXpGain: configData?.notify_on_xp_gain ?? false,
      rewardNotificationChannel: configData?.reward_notification_channel ?? null,
      rewardNotificationMessage:
        configData?.reward_notification_message ?? "🎁 {user} reached **Level {level}** and earned the role(s): {roles}!",
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
    const newTotalXP = currentXP + gainedXP;

    // Calculate level progress
    const progress = getLevelProgress(newTotalXP);
    const newLevel = progress.level;
    const leveledUp = newLevel > currentLevel;

    // Log the calculations for debugging
    console.log(`📊 XP Update for ${username}:`, {
      oldXP: currentXP,
      gainedXP,
      newTotalXP,
      oldLevel: currentLevel,
      newLevel,
      xpIntoLevel: progress.xpIntoLevel,
      xpToNextLevel: progress.xpToNextLevel,
      totalXP: progress.totalXP
    });

    // Update stats
    const { error: updateError } = await supabaseBot
      .from("user_stats_discord")
      .upsert(
        {
          guild_id: guildId,
          user_id: userId,
          xp: newTotalXP,
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
    
    // Handle XP Gain Notification
    if (config.notifyOnXpGain) {
      const template = config.xpGainMessage || "🎯 {user} gained **{xp} XP**!";
      
      const xpGainAnnouncement = template
        .replace("{user}", `<@${userId}>`)
        .replace("{xp}", gainedXP.toString())
        .replace("{total_xp}", newTotalXP.toString())
        .replace("{level}", newLevel.toString())
        .replace("{xp_into_level}", progress.xpIntoLevel.toString())
        .replace("{xp_to_next_level}", progress.xpToNextLevel.toString());

      try {
        let targetChannel: TextChannel | null = null;
        const channelId = config.xpGainChannel ?? null;

        if (channelId) {
          const ch = message.guild.channels.cache.get(channelId);
          if (ch?.isTextBased()) targetChannel = ch as TextChannel;
        }

        if (!targetChannel && message.channel.isTextBased())
          targetChannel = message.channel as TextChannel;

        if (targetChannel) {
          await targetChannel.send(xpGainAnnouncement);
          console.log(`✅ XP gain notification sent for ${username}`);
        }
      } catch (err) {
        console.error("❌ Error sending XP gain notification:", err);
      }
    }

    // Handle level-up
    if (leveledUp) {
      console.log(`🎉 ${username} leveled up from ${currentLevel} to ${newLevel}!`);
      
      // 🎁 Handle role rewards FIRST and get the list of granted roles
      const grantedRoles = await handleRoleRewards(message, userId, guildId, newLevel, config);

      // 📢 Send role reward notification if roles were granted
      if (grantedRoles.length > 0) {
        console.log(`🎁 ${grantedRoles.length} new role(s) granted, sending notification...`);
        
        const template =
          config.rewardNotificationMessage ||
          "🎁 {user} reached **Level {level}** and earned the role(s): {roles}!";

        const rolesText = grantedRoles.map(r => `**${r.roleName}**`).join(", ");
        const notification = template
          .replace("{user}", `<@${userId}>`)
          .replace("{level}", newLevel.toString())
          .replace("{roles}", rolesText);

        try {
          let targetChannel: TextChannel | null = null;
          const channelId = config.rewardNotificationChannel ?? config.levelUpChannel ?? null;

          if (channelId) {
            const ch = message.guild.channels.cache.get(channelId);
            if (ch?.isTextBased()) targetChannel = ch as TextChannel;
          }

          if (!targetChannel && message.channel.isTextBased()) {
            targetChannel = message.channel as TextChannel;
          }

          if (targetChannel) {
            await targetChannel.send(notification);
            console.log(`✅ Role reward notification sent: ${rolesText}`);
          } else {
            console.error("❌ No valid channel found for role reward notification");
          }
        } catch (notifError) {
          console.error("❌ Error sending role reward notification:", notifError);
        }
      } else {
        console.log(`ℹ️ No new roles granted for level ${newLevel}`);
      }

      // 📢 Send level-up message
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

        if (targetChannel) {
          await targetChannel.send(announcement);
          console.log(`✅ Level-up notification sent for ${username}`);
        }
      } catch (err) {
        console.error("❌ Error sending level-up message:", err);
      }
    }
  } catch (error) {
    console.error("❌ Critical error in handleXP:", error);
  }
}
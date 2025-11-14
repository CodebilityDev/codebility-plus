// apps/bot/commands/rankCard.ts

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
  MessageFlags,
} from "discord.js";
import { supabaseBot } from "../utils/supabase.bot";
import { generateRankCard } from "../utils/rankCardGen";
import { getLevelProgress } from "../utils/xpHelper";

// === Slash Command Definition ===
const slashCommand = new SlashCommandBuilder()
  .setName("rank")
  .setDescription("View your rank card showing XP and level progress.")
  .addUserOption((opt) =>
    opt
      .setName("user")
      .setDescription("Target user to view rank card")
      .setRequired(false)
  )
  .setDMPermission(false);

// === Export Command Metadata ===
export const command = {
  name: "rank",
  data: slashCommand,
};

// === Fetch User's Earned Reward Roles ===
async function getUserRewardRoles(guildId: string, userId: string, currentLevel: number) {
  try {
    // Fetch all rewards the user should have based on their level
    const { data: rewards, error: rewardsError } = await supabaseBot
      .from("level_rewards_discord")
      .select("*")
      .eq("guild_id", guildId)
      .eq("reward_type", "role")
      .lte("level", currentLevel) // All rewards up to current level
      .order("level", { ascending: true });

    if (rewardsError) {
      console.error("❌ Error fetching reward roles:", rewardsError.message);
      return [];
    }

    if (!rewards || rewards.length === 0) return [];

    // Check which roles the user actually has from user_rewards_discord
    const { data: grantedRewards, error: grantedError } = await supabaseBot
      .from("user_rewards_discord")
      .select("reward_id, level_earned, granted_at")
      .eq("guild_id", guildId)
      .eq("user_id", userId);

    if (grantedError) {
      console.error("❌ Error fetching granted rewards:", grantedError.message);
      // Continue anyway, we'll show all available rewards
    }

    const grantedIds = new Set(grantedRewards?.map(r => r.reward_id) || []);

    // Map rewards with granted status
    return rewards.map(reward => ({
      id: reward.id,
      roleId: reward.reward_value,
      level: reward.level,
      granted: grantedIds.has(reward.id),
    }));
  } catch (error) {
    console.error("❌ Exception in getUserRewardRoles:", error);
    return [];
  }
}

// === Execute Function ===
export const execute = async (interaction: ChatInputCommandInteraction) => {
  try {
    await interaction.deferReply();

    const guildId = interaction.guildId;
    if (!guildId) {
      await interaction.editReply({
        content: "❌ This command can only be used inside a Discord server.",
      });
      return;
    }

    const user = interaction.options.getUser("user") || interaction.user;

    // Prevent bot users
    if (user.bot) {
      await interaction.editReply({
        content: "❌ Cannot generate rank card for bot users!",
      });
      return;
    }

    // Ensure user record exists
    const { error: userRecordError } = await supabaseBot
      .from("users_discord")
      .upsert(
        {
          id: user.id,
          username: user.username,
          avatar_url: user.displayAvatarURL(),
          discriminator: user.discriminator || "0",
        },
        { onConflict: "id" }
      );

    if (userRecordError) {
      console.error("❌ Error ensuring user record:", userRecordError.message);
    }

    // Ensure guild record exists
    const { error: guildError } = await supabaseBot
      .from("guilds_discord")
      .upsert(
        {
          id: guildId,
          name: interaction.guild?.name || "Unknown Guild",
          active: true,
        },
        { onConflict: "id" }
      );

    if (guildError) {
      console.error("❌ Error ensuring guild record:", guildError.message);
    }

    // === Fetch Current User Data ===
    const { data: userData, error: userError } = await supabaseBot
      .from("user_stats_discord")
      .select("user_id, xp, level")
      .eq("guild_id", guildId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (userError) {
      console.error("❌ Error fetching user stats:", userError.message);
      await interaction.editReply({
        content: "❌ Failed to retrieve user stats from the database.",
      });
      return;
    }

    if (!userData) {
      await interaction.editReply({
        content: `⚠️ **${user.username}** has no XP data yet. Start chatting to gain XP!`,
      });
      return;
    }

    // Calculate level progress from total XP
    const progress = getLevelProgress(userData.xp);

    // === Fetch Reward Roles ===
    const rewardRoles = await getUserRewardRoles(guildId, user.id, userData.level);

    // Get Discord role objects for granted rewards
    const grantedRoleObjects = [];
    for (const reward of rewardRoles.filter(r => r.granted)) {
      const role = interaction.guild?.roles.cache.get(reward.roleId);
      if (role) {
        grantedRoleObjects.push({
          id: role.id,
          name: role.name,
          color: role.hexColor,
          levelRequirement: reward.level,
        });
      }
    }

    // === Fetch All Users in Guild to Determine Rank ===
    const { data: allUsers, error: rankError } = await supabaseBot
      .from("user_stats_discord")
      .select("user_id, xp, level")
      .eq("guild_id", guildId)
      .eq("active", true)
      .order("level", { ascending: false })
      .order("xp", { ascending: false });

    if (rankError) {
      console.error("❌ Error fetching rank list:", rankError.message);
      await interaction.editReply({
        content: "❌ Failed to calculate rank.",
      });
      return;
    }

    // === Determine User Rank ===
    let rank = 0;
    let totalUsers = 0;
    
    if (allUsers && allUsers.length > 0) {
      totalUsers = allUsers.length;
      const position = allUsers.findIndex((u) => u.user_id === user.id);
      rank = position !== -1 ? position + 1 : 0;
    }

    // === Generate Rank Card (pass granted roles data) ===
    const buffer = await generateRankCard(user, guildId, grantedRoleObjects);

    if (!buffer) {
      await interaction.editReply({
        content: `⚠️ Could not generate rank card for **${user.username}**. Please try again later.`,
      });
      return;
    }

    // === Create and Send Image Attachment ===
    const attachment = new AttachmentBuilder(buffer, {
      name: `rank-${user.username}-${Date.now()}.png`,
    });

    const rankDisplay = rank > 0 ? `#${rank} of ${totalUsers}` : "Unranked";

    // Build roles display for text output
    const rolesText = grantedRoleObjects.length > 0 
      ? `\n• **Reward Roles:** ${grantedRoleObjects.map(r => `${r.name} (Lv.${r.levelRequirement})`).join(", ")}`
      : "";

    await interaction.editReply({
      content: `📊 **${user.username}'s Rank Card**\n\n• **Level:** ${progress.level}\n• **XP:** ${progress.xpIntoLevel.toLocaleString()} / ${progress.xpToNextLevel.toLocaleString()}\n• **Rank:** ${rankDisplay}${rolesText}`,
      files: [attachment],
    });

    console.log(
      `✅ Rank card generated for ${user.username} (${user.id}) in guild ${guildId}`
    );
  } catch (error) {
    console.error("❌ Error executing /rank command:", error);

    const errorMessage = {
      content: "❌ Failed to generate rank card. Please try again later.",
    };

    if (interaction.deferred) {
      await interaction.editReply(errorMessage);
    } else if (!interaction.replied) {
      await interaction.reply({
        ...errorMessage,
        flags: [MessageFlags.Ephemeral],
      });
    }
  }
};
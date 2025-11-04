// apps/bot/commands/resetXP.ts

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import { supabaseBot } from "../utils/supabase.bot";

// Create the slash command
const slashCommand = new SlashCommandBuilder()
  .setName("resetxp")
  .setDescription("Reset a user's XP and level.")
  .addUserOption((opt) =>
    opt
      .setName("target")
      .setDescription("The user whose XP you want to reset")
      .setRequired(true)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

// Export the command definition
export const command = {
  name: "resetxp",
  data: slashCommand,
};

// Execute the command
export const execute = async (interaction: ChatInputCommandInteraction) => {
  try {
    // Defer reply for long-running DB operations
    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const targetUser = interaction.options.getUser("target", true);
    const guildId = interaction.guildId;

    // Check if guild ID is available (command used in a server)
    if (!guildId) {
      await interaction.editReply({
        content: "❌ This command can only be used inside a Discord server.",
      });
      return;
    }

    // Prevent bots from being reset
    if (targetUser.bot) {
      await interaction.editReply({
        content: "❌ You cannot reset XP for bot accounts!",
      });
      return;
    }

    // Ensure user record exists
    const { error: userRecordError } = await supabaseBot
      .from("users_discord")
      .upsert(
        {
          id: targetUser.id,
          username: targetUser.username,
          avatar_url: targetUser.displayAvatarURL(),
          discriminator: targetUser.discriminator || "0",
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

    // Check if user has XP data first
    const { data: existingData, error: checkError } = await supabaseBot
      .from("user_stats_discord")
      .select("id, xp, level")
      .eq("user_id", targetUser.id)
      .eq("guild_id", guildId)
      .maybeSingle();

    if (checkError) {
      console.error("❌ Error checking user stats:", checkError.message);
      await interaction.editReply({
        content: "❌ Failed to check user XP data. Please try again later.",
      });
      return;
    }

    // If user does not exist in the table (no XP yet)
    if (!existingData) {
      await interaction.editReply({
        content: `⚠️ **${targetUser.username}** has no XP data in this server yet.`,
      });
      return;
    }

    // Update XP and level to 0
    const { error: updateError } = await supabaseBot
      .from("user_stats_discord")
      .update({
        xp: 0,
        level: 0, // Reset to level 1 (most bots start at level 1, not 0)
        total_messages: 0,
      })
      .eq("user_id", targetUser.id)
      .eq("guild_id", guildId);

    // Handle possible Supabase errors
    if (updateError) {
      console.error("❌ Error resetting XP:", updateError.message);
      await interaction.editReply({
        content: "❌ Failed to reset XP. Please try again later.",
      });
      return;
    }

    // Successful reset confirmation
    await interaction.editReply({
      content: `🔄 **XP successfully reset for ${targetUser.username}!**\n\n• **XP:** 0\n• **Level:** 1\n• **Messages:** 0`,
    });

    // Log event to console
    console.log(
      `✅ [XP Reset] User: ${targetUser.username} (${targetUser.id}) | Guild: ${guildId} | Reset by: ${interaction.user.username}`
    );
  } catch (err) {
    console.error("❌ Error executing /resetxp command:", err);

    const errorMessage = {
      content:
        "❌ An unexpected error occurred while resetting XP. Please try again later.",
    };

    // Handle both deferred and non-deferred responses safely
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
// apps/bot/commands/badges.ts
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import { supabaseBot } from "../utils/supabase.bot";

//Slash command
const slashCommand = new SlashCommandBuilder()
  .setName("badges")
  .setDescription("View your badges or award a badge (admin only).")
  .addUserOption((opt) =>
    opt
      .setName("user")
      .setDescription("Target user to view or award badges to.")
      .setRequired(false)
  )
  .addStringOption((opt) =>
    opt
      .setName("badge")
      .setDescription("Badge ID to award (admin only)")
      .setRequired(false)
  );

// Export the command 
export const command = {
  name: "badges",
  data: slashCommand,
};

// Execute function
export const execute = async (interaction: ChatInputCommandInteraction) => {
  try {
    await interaction.deferReply();

    const userOption = interaction.options.getUser("user");
    const badgeId = interaction.options.getString("badge");
    const targetUser = userOption || interaction.user;

    // Ensure users_discord record exists for target user
    const { error: userError } = await supabaseBot
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

    if (userError) {
      console.error("❌ Error ensuring user record:", userError.message);
    }

    // ===== ADMIN AWARD FLOW =====
    if (badgeId) {
      // Permission check
      if (
        !interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)
      ) {
        await interaction.editReply({
          content:
            "❌ You do not have permission to award badges. (Requires **Manage Server** permission.)",
        });
        return;
      }

      // Validate badgeId
      const badgeIdNum = parseInt(badgeId);
      if (isNaN(badgeIdNum)) {
        await interaction.editReply({
          content: "❌ Invalid badge ID. Please provide a valid **number**.",
        });
        return;
      }

      // Check if badge exists
      const { data: badge, error: badgeError } = await supabaseBot
        .from("badges_discord")
        .select("id, badge_name")
        .eq("id", badgeIdNum)
        .single();

      if (badgeError || !badge) {
        await interaction.editReply({
          content: `❌ No badge found with ID **${badgeIdNum}**.`,
        });
        return;
      }

      // Check if user already has this badge
      const { data: existingBadge } = await supabaseBot
        .from("user_badges_discord")
        .select("id")
        .eq("user_id", targetUser.id)
        .eq("badge_id", badgeIdNum)
        .maybeSingle();

      if (existingBadge) {
        await interaction.editReply({
          content: `⚠️ <@${targetUser.id}> already has the badge **${badge.badge_name}**.`,
        });
        return;
      }

      // Award the badge
      const { error: insertError } = await supabaseBot
        .from("user_badges_discord")
        .insert({
          user_id: targetUser.id,
          badge_id: badgeIdNum,
        });

      if (insertError) {
        console.error("❌ Error awarding badge:", insertError.message);
        await interaction.editReply({
          content: "⚠️ Failed to award badge. Please try again later.",
        });
        return;
      }

      await interaction.editReply({
        content: `🏅 **${badge.badge_name}** has been awarded to <@${targetUser.id}>!`,
      });

      console.log(
        `✅ Badge ${badgeIdNum} awarded to ${targetUser.username} by ${interaction.user.username}`
      );
      return;
    }

    // ===== VIEW BADGES FLOW =====
    const { data: userBadges, error: ubError } = await supabaseBot
      .from("user_badges_discord")
      .select("badge_id, awarded_at")
      .eq("user_id", targetUser.id);

    if (ubError) {
      console.error("❌ Error fetching user badges:", ubError.message);
      await interaction.editReply({
        content: "⚠️ Failed to fetch user badges. Please try again.",
      });
      return;
    }

    if (!userBadges || userBadges.length === 0) {
      await interaction.editReply({
        content: `<@${targetUser.id}> has no badges yet. 🏆`,
      });
      return;
    }

    // Fetch all badge details from badges_discord
    const { data: allBadges, error: allBadgesError } = await supabaseBot
      .from("badges_discord")
      .select("id, badge_name, badge_icon_url, description");

    if (allBadgesError || !allBadges) {
      console.error("❌ Error fetching badge details:", allBadgesError.message);
      await interaction.editReply({
        content: "⚠️ Failed to load badge details. Please try again.",
      });
      return;
    }

    // Merge badge info
    const badgesWithDetails = userBadges
      .map((ub) => {
        const badge = allBadges.find((b) => b.id === ub.badge_id);
        if (!badge) return null;
        return {
          badge_name: badge.badge_name,
          badge_icon_url: badge.badge_icon_url,
          description: badge.description,
          awarded_at: ub.awarded_at,
        };
      })
      .filter((badge): badge is NonNullable<typeof badge> => badge !== null);

    // ===== CREATE EMBED =====
    const embed = new EmbedBuilder()
      .setTitle(`${targetUser.username}'s Badges`)
      .setColor("#FFD700")
      .setThumbnail(targetUser.displayAvatarURL())
      .setFooter({ text: `Total Badges: ${badgesWithDetails.length}` })
      .setTimestamp();

    if (badgesWithDetails.length > 0) {
      embed.setDescription(
        badgesWithDetails
          .map(
            (b) =>
              `🏅 **${b.badge_name}**\n${b.description ?? "No description."}`
          )
          .join("\n\n")
      );
    } else {
      embed.setDescription("No badges found.");
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error("❌ Error executing badges command:", error);

    const errorMessage = {
      content:
        "❌ An unexpected error occurred while processing this command. Please try again later.",
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
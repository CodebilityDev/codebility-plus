<<<<<<< HEAD
// apps/bot/commands/rankCard.ts

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
  MessageFlags,
} from "discord.js";
import { supabaseBot } from "../utils/supabase.bot";
import { generateRankCard } from "../utils/rankCardGen";

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

    // === Generate Rank Card ===
    const buffer = await generateRankCard(user, guildId);

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

    await interaction.editReply({
      content: `📊 **${user.username}'s Rank Card**\n\n• **Level:** ${userData.level}\n• **XP:** ${userData.xp.toLocaleString()}\n• **Rank:** ${rankDisplay}`,
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
=======
// apps/bot/commands/rankCard.ts

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  AttachmentBuilder,
  MessageFlags,
} from "discord.js";
import { supabaseBot } from "../utils/supabase.bot";
import { generateRankCard } from "../utils/rankCardGen";

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

    // === Generate Rank Card ===
    const buffer = await generateRankCard(user, guildId);

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

    await interaction.editReply({
      content: `📊 **${user.username}'s Rank Card**\n\n• **Level:** ${userData.level}\n• **XP:** ${userData.xp.toLocaleString()}\n• **Rank:** ${rankDisplay}`,
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
>>>>>>> 109c65d674b3a05390ea718f72346bc8818a8fe2
};
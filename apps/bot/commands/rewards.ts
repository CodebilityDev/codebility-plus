// app/bot/commands/rewards.ts
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  MessageFlags,
} from "discord.js";
import { supabaseBot } from "../utils/supabase.bot";

// Define reward structure matching DB schema
interface LevelReward {
  id?: number;
  guild_id: string;
  level: number;
  reward_type: string;
  reward_value: string;
  created_at?: string;
}

// Ensure guild exists in guilds_discord before writing
async function ensureGuildRegistered(guildId: string, guildName?: string) {
  const { error: upsertError } = await supabaseBot
    .from("guilds_discord")
    .upsert(
      {
        id: guildId,
        name: guildName ?? "Unknown Server",
        active: true,
      },
      { onConflict: "id" }
    );

  if (upsertError) {
    console.error("❌ Error ensuring guild record:", upsertError.message);
    throw new Error("Failed to register guild in database.");
  }
}

// Create the slash command
const slashCommand = new SlashCommandBuilder()
  .setName("rewards")
  .setDescription("Manage level-up rewards (roles, badges, or messages).")
  .addStringOption((opt) =>
    opt
      .setName("action")
      .setDescription("Action to perform")
      .setRequired(true)
      .addChoices(
        { name: "Create Reward", value: "create" },
        { name: "List Rewards", value: "list" },
        { name: "Remove Reward", value: "remove" }
      )
  )
  .addIntegerOption((opt) =>
    opt
      .setName("level")
      .setDescription("Target level for the reward")
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(999)
  )
  .addStringOption((opt) =>
    opt
      .setName("type")
      .setDescription("Type of reward")
      .setRequired(false)
      .addChoices(
        { name: "Role", value: "role" },
        { name: "Badge", value: "badge" },
        { name: "Custom Message", value: "custom_message" }
      )
  )
  .addStringOption((opt) =>
    opt
      .setName("value")
      .setDescription("Role ID, Badge ID, or message content")
      .setRequired(false)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .setDMPermission(false);

// Export the command definition
export const command = {
  name: "rewards",
  data: slashCommand,
};

// Command execution
export const execute = async (interaction: ChatInputCommandInteraction) => {
  try {
    const guildId = interaction.guildId;
    const guildName = interaction.guild?.name;

    if (!guildId) {
      await interaction.reply({
        content: "❌ This command can only be used inside a server.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Check permissions
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {
      await interaction.reply({
        content:
          "❌ You do not have permission to manage rewards. (Requires **Manage Server** permission)",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    // Ensure the guild exists in DB
    try {
      await ensureGuildRegistered(guildId, guildName);
    } catch (error) {
      await interaction.reply({
        content: "❌ Failed to register guild. Please try again later.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    const action = interaction.options.getString("action", true);
    const level = interaction.options.getInteger("level");
    const type = interaction.options.getString("type");
    const value = interaction.options.getString("value");

    // ===== CREATE REWARD =====
    if (action === "create") {
      if (!level || !type || !value) {
        await interaction.reply({
          content:
            "❌ **Missing required parameters.**\nPlease provide: `level`, `type`, and `value`.",
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      await interaction.deferReply();

      // Validate role if type is role
      if (type === "role") {
        const role = interaction.guild?.roles.cache.get(value);
        if (!role) {
          await interaction.editReply({
            content:
              "❌ **Invalid role ID.** Please make sure the role exists in this server.",
          });
          return;
        }
      }

      // Check for existing reward at this level and type
      const { data: existingReward, error: fetchError } = await supabaseBot
        .from("level_rewards_discord")
        .select("*")
        .eq("guild_id", guildId)
        .eq("level", level)
        .eq("reward_type", type)
        .maybeSingle();

      if (fetchError) {
        console.error("❌ Fetch error:", fetchError.message);
        await interaction.editReply({
          content: "❌ Database error while checking existing reward.",
        });
        return;
      }

      if (existingReward) {
        await interaction.editReply({
          content: `⚠️ A **${type}** reward already exists for level **${level}**.\nRemove it first using \`/rewards remove\`.`,
        });
        return;
      }

      // Insert new reward
      const { error: insertError } = await supabaseBot
        .from("level_rewards_discord")
        .insert({
          guild_id: guildId,
          level,
          reward_type: type,
          reward_value: value,
        });

      if (insertError) {
        console.error("❌ Insert error:", insertError.message);
        await interaction.editReply({
          content: "❌ Failed to create reward. Please try again.",
        });
        return;
      }

      const rewardLabel =
        type === "role"
          ? `<@&${value}>`
          : type === "badge"
          ? `🏅 Badge ID: **${value}**`
          : `💬 Message: "${value}"`;

      await interaction.editReply({
        content: `✅ **Reward created successfully!**\n\n• **Level:** ${level}\n• **Type:** ${type}\n• **Reward:** ${rewardLabel}`,
      });

      console.log(
        `✅ Reward created — Guild: ${guildName} (${guildId}) | Level: ${level} | Type: ${type}`
      );
      return;
    }

    // ===== LIST REWARDS =====
    if (action === "list") {
      await interaction.deferReply();

      const { data: rewards, error } = await supabaseBot
        .from("level_rewards_discord")
        .select("*")
        .eq("guild_id", guildId)
        .order("level", { ascending: true });

      if (error) {
        console.error("❌ Fetch rewards error:", error.message);
        await interaction.editReply({
          content: "❌ Failed to fetch rewards from the database.",
        });
        return;
      }

      if (!rewards || rewards.length === 0) {
        await interaction.editReply({
          content:
            "ℹ️ **No rewards set yet.**\n\nUse `/rewards create` to add your first reward!",
        });
        return;
      }

      // Group rewards by level
      const grouped = rewards.reduce<Record<number, LevelReward[]>>((acc, r) => {
        if (!acc[r.level]) acc[r.level] = [];
        acc[r.level]!.push(r);
        return acc;
      }, {});

      const description = Object.entries(grouped)
        .map(([lvl, list]) => {
          const rewardLines = list
            .map((r) => {
              const value =
                r.reward_type === "role"
                  ? `<@&${r.reward_value}>`
                  : r.reward_type === "badge"
                  ? `🏅 Badge ${r.reward_value}`
                  : `💬 "${r.reward_value}"`;
              return `  • **${r.reward_type}:** ${value}`;
            })
            .join("\n");
          return `**Level ${lvl}**\n${rewardLines}`;
        })
        .join("\n\n");

      const embed = new EmbedBuilder()
        .setTitle(`🎁 Level Rewards — ${interaction.guild?.name}`)
        .setDescription(description)
        .setColor("#9B59B6")
        .setFooter({ text: `Total: ${rewards.length} reward${rewards.length !== 1 ? 's' : ''}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // ===== REMOVE REWARD =====
    if (action === "remove") {
      if (!level || !type) {
        await interaction.reply({
          content:
            "❌ **Missing required parameters.**\nPlease provide both `level` and `type` to remove a reward.",
          flags: [MessageFlags.Ephemeral],
        });
        return;
      }

      await interaction.deferReply();

      // Check if reward exists first
      const { data: existingReward, error: checkError } = await supabaseBot
        .from("level_rewards_discord")
        .select("*")
        .eq("guild_id", guildId)
        .eq("level", level)
        .eq("reward_type", type)
        .maybeSingle();

      if (checkError) {
        console.error("❌ Check error:", checkError.message);
        await interaction.editReply({
          content: "❌ Failed to check reward. Please try again.",
        });
        return;
      }

      if (!existingReward) {
        await interaction.editReply({
          content: `⚠️ No **${type}** reward found for level **${level}**.`,
        });
        return;
      }

      // Delete the reward
      const { error: deleteError } = await supabaseBot
        .from("level_rewards_discord")
        .delete()
        .eq("guild_id", guildId)
        .eq("level", level)
        .eq("reward_type", type);

      if (deleteError) {
        console.error("❌ Delete error:", deleteError.message);
        await interaction.editReply({
          content: "❌ Failed to remove reward. Please try again.",
        });
        return;
      }

      await interaction.editReply({
        content: `✅ **Reward removed successfully!**\n\n• **Level:** ${level}\n• **Type:** ${type}`,
      });

      console.log(
        `✅ Reward removed — Guild: ${guildName} (${guildId}) | Level: ${level} | Type: ${type}`
      );
      return;
    }

    // Unknown action safeguard (should never happen with choices)
    await interaction.reply({
      content: "⚠️ Invalid action. Please use the provided options.",
      flags: [MessageFlags.Ephemeral],
    });
  } catch (error) {
    console.error("❌ Error executing rewards command:", error);
    
    const message = {
      content: "❌ An unexpected error occurred while managing rewards.",
    };
    
    if (interaction.deferred) {
      await interaction.editReply(message);
    } else if (!interaction.replied) {
      await interaction.reply({
        ...message,
        flags: [MessageFlags.Ephemeral],
      });
    }
  }
};
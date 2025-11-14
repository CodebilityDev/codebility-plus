// apps/bot/commands/configXP.ts

import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  MessageFlags,
  ChannelType,
} from "discord.js";
import { supabaseBot } from "../utils/supabase.bot";

const slashCommand = new SlashCommandBuilder()
  .setName("configxp")
  .setDescription("Configure the XP leveling system for your server.")
  .addSubcommand((sub) =>
    sub
      .setName("settings")
      .setDescription("Configure XP gain settings")
      .addIntegerOption((o) =>
        o
          .setName("min")
          .setDescription("Minimum XP gained per message")
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100)
      )
      .addIntegerOption((o) =>
        o
          .setName("max")
          .setDescription("Maximum XP gained per message")
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100)
      )
      .addIntegerOption((o) =>
        o
          .setName("cooldown")
          .setDescription("Cooldown between XP gains (in seconds)")
          .setRequired(true)
          .setMinValue(0)
          .setMaxValue(300)
      )
      .addChannelOption((o) =>
        o
          .setName("levelup_channel")
          .setDescription("Channel where level-up messages will be sent")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("notifications")
      .setDescription("Configure XP gain notifications")
      .addBooleanOption((opt) =>
        opt
          .setName("enabled")
          .setDescription("Enable XP gain notifications?")
          .setRequired(true)
      )
      .addChannelOption((opt) =>
        opt
          .setName("channel")
          .setDescription("Channel for XP notifications (optional)")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("rewards")
      .setDescription("Configure reward role notifications")
      .addChannelOption((opt) =>
        opt
          .setName("channel")
          .setDescription("Channel for reward notifications (optional, defaults to level-up channel)")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(false)
      )
      .addStringOption((opt) =>
        opt
          .setName("message")
          .setDescription("Custom message template (use: {user}, {level}, {roles})")
          .setRequired(false)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("message")
      .setDescription("Set custom XP gain message template")
      .addStringOption((opt) =>
        opt
          .setName("template")
          .setDescription("Use: {user}, {xp}, {total_xp}, {level}, {xp_into_level}, {xp_to_next_level}")
          .setRequired(true)
      )
  )
  .addSubcommand((sub) =>
    sub
      .setName("view")
      .setDescription("View current XP configuration")
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export const command = {
  name: "configxp",
  data: slashCommand,
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  try {
    const guildId = interaction.guildId;
    const guildName = interaction.guild?.name ?? "Unknown Guild";

    if (!guildId) {
      await interaction.reply({
        content: "❌ This command can only be used inside a server.",
        flags: [MessageFlags.Ephemeral],
      });
      return;
    }

    await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

    const subcommand = interaction.options.getSubcommand();

    // Ensure guild record exists
    const { error: guildError } = await supabaseBot
      .from("guilds_discord")
      .upsert(
        {
          id: guildId,
          name: guildName,
          active: true,
        },
        { onConflict: "id" }
      );

    if (guildError) {
      console.error("❌ Error ensuring guild record:", guildError.message);
      await interaction.editReply({
        content: "❌ Failed to ensure guild record. Please try again later.",
      });
      return;
    }

    // Fetch existing config
    const { data: existingConfig, error: fetchError } = await supabaseBot
      .from("xp_config_discord")
      .select("*")
      .eq("guild_id", guildId)
      .maybeSingle();

    if (fetchError) {
      console.error("❌ Error fetching XP config:", fetchError.message);
    }

    // Handle subcommands
    if (subcommand === "settings") {
      const min = interaction.options.getInteger("min", true);
      const max = interaction.options.getInteger("max", true);
      const cooldown = interaction.options.getInteger("cooldown", true);
      const levelUpChannel = interaction.options.getChannel("levelup_channel");

      // Validate XP range
      if (min > max) {
        await interaction.editReply({
          content: "❌ Minimum XP cannot be greater than maximum XP!",
        });
        return;
      }

      // Prepare update data
      const updateData: any = {
        guild_id: guildId,
        min_xp: min,
        max_xp: max,
        cooldown: cooldown,
        levelup_channel: levelUpChannel?.id ?? null,
      };

      // If config doesn't exist, add defaults
      if (!existingConfig) {
        updateData.levelup_message = "🎉 {user} leveled up to **Level {level}**!";
        updateData.xp_gain_message = "🎯 {user} gained **{xp} XP**! (Total: {total_xp} XP | Level {level})";
        updateData.reward_notification_message = "🎁 {user} reached **Level {level}** and earned the role(s): {roles}!";
        updateData.notify_on_xp_gain = false;
        updateData.active = true;
      }

      const { error: xpError } = await supabaseBot
        .from("xp_config_discord")
        .upsert(updateData, { onConflict: "guild_id" });

      if (xpError) {
        console.error("❌ Error saving XP config:", xpError.message);
        await interaction.editReply({
          content: "❌ Failed to save XP configuration. Please try again later.",
        });
        return;
      }

      // Also sync to settings_discord
      const { error: settingsError } = await supabaseBot
        .from("settings_discord")
        .upsert(
          {
            guild_id: guildId,
            xp_per_message: Math.floor((min + max) / 2),
            cooldown_seconds: cooldown,
            level_up_channel_id: levelUpChannel?.id ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "guild_id" }
        );

      if (settingsError) {
        console.error("⚠️ Warning: settings_discord sync failed:", settingsError.message);
      }

      const summary = [
        `✅ **XP configuration updated successfully!**`,
        "",
        "**Settings:**",
        `• Min XP: **${min}**`,
        `• Max XP: **${max}**`,
        `• Cooldown: **${cooldown}s**`,
        levelUpChannel ? `• Level-up Channel: <#${levelUpChannel.id}>` : `• Level-up Channel: Message channel`,
      ].join("\n");

      await interaction.editReply({ content: summary });
      console.log(`✅ XP config updated for guild: ${guildName} (${guildId})`);

    } else if (subcommand === "notifications") {
      const enabled = interaction.options.getBoolean("enabled", true);
      const channel = interaction.options.getChannel("channel");

      const updateData: any = {
        guild_id: guildId,
        notify_on_xp_gain: enabled,
        xp_gain_channel: channel?.id || null,
      };

      // If config doesn't exist, create with defaults
      if (!existingConfig) {
        updateData.min_xp = 5;
        updateData.max_xp = 15;
        updateData.cooldown = 60;
        updateData.levelup_message = "🎉 {user} leveled up to **Level {level}**!";
        updateData.xp_gain_message = "🎯 {user} gained **{xp} XP**! (Total: {total_xp} XP | Level {level})";
        updateData.reward_notification_message = "🎁 {user} reached **Level {level}** and earned the role(s): {roles}!";
        updateData.active = true;
      }

      const { error: updateError } = await supabaseBot
        .from("xp_config_discord")
        .upsert(updateData, { onConflict: "guild_id" });

      if (updateError) {
        console.error("❌ Error updating XP notifications:", updateError.message);
        await interaction.editReply({
          content: "❌ Failed to update XP notification settings.",
        });
        return;
      }

      const statusMsg = enabled
        ? `✅ **XP gain notifications enabled!**\n\n${
            channel 
              ? `📍 Notifications will be sent to ${channel}` 
              : "📍 Notifications will appear in the message channel"
          }\n\n💡 Customize the message with \`/configxp message\``
        : "🔕 **XP gain notifications disabled.**";

      await interaction.editReply({ content: statusMsg });
      console.log(`✅ [XP Notifications] Guild: ${guildId} | Enabled: ${enabled} | Channel: ${channel?.id || "message channel"}`);

    } else if (subcommand === "rewards") {
      const channel = interaction.options.getChannel("channel");
      const messageTemplate = interaction.options.getString("message");

      const updateData: any = {
        guild_id: guildId,
      };

      // Update channel if provided
      if (channel) {
        updateData.reward_notification_channel = channel.id;
      }

      // Update message template if provided
      if (messageTemplate) {
        // Validate template has required placeholders
        if (!messageTemplate.includes("{user}")) {
          await interaction.editReply({
            content: "❌ Template must include `{user}` placeholder!",
          });
          return;
        }
        updateData.reward_notification_message = messageTemplate;
      }

      // If config doesn't exist, create with defaults
      if (!existingConfig) {
        updateData.min_xp = 5;
        updateData.max_xp = 15;
        updateData.cooldown = 60;
        updateData.levelup_message = "🎉 {user} leveled up to **Level {level}**!";
        updateData.xp_gain_message = "🎯 {user} gained **{xp} XP**! (Total: {total_xp} XP | Level {level})";
        updateData.notify_on_xp_gain = false;
        updateData.active = true;
        
        if (!messageTemplate) {
          updateData.reward_notification_message = "🎁 {user} reached **Level {level}** and earned the role(s): {roles}!";
        }
      }

      const { error: updateError } = await supabaseBot
        .from("xp_config_discord")
        .upsert(updateData, { onConflict: "guild_id" });

      if (updateError) {
        console.error("❌ Error updating reward notifications:", updateError.message);
        await interaction.editReply({
          content: "❌ Failed to update reward notification settings.",
        });
        return;
      }

      const currentMessage = messageTemplate || existingConfig?.reward_notification_message || "🎁 {user} reached **Level {level}** and earned the role(s): {roles}!";
      const currentChannel = channel || (existingConfig?.reward_notification_channel ? `<#${existingConfig.reward_notification_channel}>` : "Level-up channel");

      await interaction.editReply({
        content: `✅ **Reward notification settings updated!**\n\n📍 **Channel:** ${typeof currentChannel === 'string' ? currentChannel : currentChannel}\n📝 **Message:** \`${currentMessage}\`\n\n**Preview:**\n${currentMessage
          .replace("{user}", `<@${interaction.user.id}>`)
          .replace("{level}", "5")
          .replace("{roles}", "**Elite**, **Champion**")}\n\n💡 **Available placeholders:** \`{user}\`, \`{level}\`, \`{roles}\``,
      });

      console.log(`✅ [Reward Notifications] Guild: ${guildId} | Updated`);

    } else if (subcommand === "message") {
      const template = interaction.options.getString("template", true);

      // Validate template has {user} placeholder
      if (!template.includes("{user}")) {
        await interaction.editReply({
          content: "❌ Template must include `{user}` placeholder to mention the user!",
        });
        return;
      }

      const updateData: any = {
        guild_id: guildId,
        xp_gain_message: template,
      };

      // If config doesn't exist, create with defaults
      if (!existingConfig) {
        updateData.min_xp = 5;
        updateData.max_xp = 15;
        updateData.cooldown = 60;
        updateData.levelup_message = "🎉 {user} leveled up to **Level {level}**!";
        updateData.reward_notification_message = "🎁 {user} reached **Level {level}** and earned the role(s): {roles}!";
        updateData.notify_on_xp_gain = false;
        updateData.active = true;
      }

      const { error: updateError } = await supabaseBot
        .from("xp_config_discord")
        .upsert(updateData, { onConflict: "guild_id" });

      if (updateError) {
        console.error("❌ Error updating XP message:", updateError.message);
        await interaction.editReply({
          content: "❌ Failed to update XP gain message template.",
        });
        return;
      }

      await interaction.editReply({
        content: `✅ **XP gain message template updated!**\n\n**Preview:**\n${template
          .replace("{user}", `<@${interaction.user.id}>`)
          .replace("{xp}", "10")
          .replace("{total_xp}", "150")
          .replace("{level}", "3")
          .replace("{xp_into_level}", "50")
          .replace("{xp_to_next_level}", "100")}\n\n💡 Enable notifications with \`/configxp notifications enabled:True\``,
      });

      console.log(`✅ [XP Message] Guild: ${guildId} | Updated template`);

    } else if (subcommand === "view") {
      const config = existingConfig || {
        min_xp: 5,
        max_xp: 15,
        cooldown: 60,
        levelup_channel: null,
        levelup_message: "🎉 {user} leveled up to **Level {level}**!",
        xp_gain_channel: null,
        xp_gain_message: "🎯 {user} gained **{xp} XP**! (Total: {total_xp} XP | Level {level})",
        notify_on_xp_gain: false,
        reward_notification_channel: null,
        reward_notification_message: "🎁 {user} reached **Level {level}** and earned the role(s): {roles}!",
      };

      const xpGainChannel = config.xp_gain_channel
        ? `<#${config.xp_gain_channel}>`
        : "Message channel";

      const levelUpChannel = config.levelup_channel
        ? `<#${config.levelup_channel}>`
        : "Message channel";

      const rewardChannel = config.reward_notification_channel
        ? `<#${config.reward_notification_channel}>`
        : "Level-up channel";

      await interaction.editReply({
        content: `📊 **XP System Configuration**

**XP Gain Settings:**
• Min XP: **${config.min_xp}**
• Max XP: **${config.max_xp}**
• Cooldown: **${config.cooldown}s**

**XP Gain Notifications:**
• Enabled: ${config.notify_on_xp_gain ? "✅ Yes" : "❌ No"}
• Channel: ${xpGainChannel}
• Message: \`${config.xp_gain_message}\`

**Level Up Notifications:**
• Channel: ${levelUpChannel}
• Message: \`${config.levelup_message}\`

**Reward Role Notifications:**
• Channel: ${rewardChannel}
• Message: \`${config.reward_notification_message}\`

**Available Placeholders:**
**XP Messages:** \`{user}\`, \`{xp}\`, \`{total_xp}\`, \`{level}\`, \`{xp_into_level}\`, \`{xp_to_next_level}\`
**Reward Messages:** \`{user}\`, \`{level}\`, \`{roles}\``,
      });
    }

  } catch (error) {
    console.error("🔥 Error executing configxp command:", error);

    const errorMessage = {
      content: "❌ An unexpected error occurred while saving the XP configuration.",
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
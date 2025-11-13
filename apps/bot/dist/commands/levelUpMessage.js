"use strict";
// apps/bot/commands/levelUpMessage.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.command = void 0;
const discord_js_1 = require("discord.js");
const supabase_bot_1 = require("../utils/supabase.bot");
// ===== Slash Command Definition =====
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("levelupmessage")
    .setDescription("Configure your server's level-up message settings.")
    .addStringOption((opt) => opt
    .setName("message")
    .setDescription("Set a new message (use {user} and {level} placeholders).")
    .setRequired(false)
    .setMaxLength(500))
    .addChannelOption((opt) => opt
    .setName("channel")
    .setDescription("Set the channel for level-up messages.")
    .addChannelTypes(discord_js_1.ChannelType.GuildText)
    .setRequired(false))
    .addBooleanOption((opt) => opt.setName("enable").setDescription("Enable or disable level-up messages.").setRequired(false))
    .addBooleanOption((opt) => opt.setName("reset").setDescription("Reset to the default message template.").setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.ManageGuild);
// ===== Export Command Metadata =====
exports.command = {
    name: "levelupmessage",
    data: slashCommand,
};
// ===== Command Execution Logic =====
const execute = async (interaction) => {
    try {
        const guildId = interaction.guildId;
        const guildName = interaction.guild?.name || "Unknown Server";
        if (!guildId) {
            await interaction.reply({
                content: "❌ This command can only be used inside a server.",
                flags: [discord_js_1.MessageFlags.Ephemeral],
            });
            return;
        }
        // Check for permission
        if (!interaction.memberPermissions?.has(discord_js_1.PermissionFlagsBits.ManageGuild)) {
            await interaction.reply({
                content: "❌ You need the **Manage Server** permission to configure level-up messages.",
                flags: [discord_js_1.MessageFlags.Ephemeral],
            });
            return;
        }
        const newMessage = interaction.options.getString("message");
        const reset = interaction.options.getBoolean("reset");
        const enable = interaction.options.getBoolean("enable");
        const channelOption = interaction.options.getChannel("channel");
        const channel = channelOption && channelOption.type === discord_js_1.ChannelType.GuildText
            ? channelOption
            : null;
        await interaction.deferReply({ flags: [discord_js_1.MessageFlags.Ephemeral] });
        // Ensure guild exists
        const { error: guildError } = await supabase_bot_1.supabaseBot
            .from("guilds_discord")
            .upsert({
            id: guildId,
            name: guildName,
            active: true,
        }, { onConflict: "id" });
        if (guildError) {
            console.error("❌ Error ensuring guild record:", guildError.message);
        }
        const defaultMessage = "🎉 {user} leveled up to **Level {level}**!";
        // ===== GET CURRENT SETTINGS =====
        const { data: currentSettings, error: fetchError } = await supabase_bot_1.supabaseBot
            .from("levelup_messages_discord")
            .select("*")
            .eq("guild_id", guildId)
            .maybeSingle();
        if (fetchError) {
            console.error("❌ Failed to fetch current settings:", fetchError.message);
            await interaction.editReply({
                content: "⚠️ Could not load current settings. Please try again later.",
            });
            return;
        }
        // ===== RESET TO DEFAULT =====
        if (reset) {
            const { error } = await supabase_bot_1.supabaseBot
                .from("levelup_messages_discord")
                .upsert({
                guild_id: guildId,
                message_template: defaultMessage,
                is_enabled: true,
                channel_id: currentSettings?.channel_id || null,
            }, { onConflict: "guild_id" });
            if (error) {
                console.error("❌ Error resetting message:", error.message);
                await interaction.editReply({
                    content: "❌ Failed to reset message. Please try again.",
                });
                return;
            }
            await interaction.editReply({
                content: `✅ Level-up message has been reset to default:\n\`${defaultMessage}\``,
            });
            console.log(`🔄 Level-up message reset for ${guildName} by ${interaction.user.username}`);
            return;
        }
        // ===== VALIDATE MESSAGE PLACEHOLDERS =====
        if (newMessage) {
            if (!newMessage.includes("{user}") || !newMessage.includes("{level}")) {
                await interaction.editReply({
                    content: "⚠️ The message must include both `{user}` and `{level}` placeholders.\n\n**Example:**\n`Congrats {user}! You reached Level {level}!`",
                });
                return;
            }
        }
        // ===== BUILD UPDATES OBJECT =====
        const updates = {};
        if (newMessage)
            updates.message_template = newMessage;
        if (channel)
            updates.channel_id = channel.id;
        if (enable !== null && enable !== undefined)
            updates.is_enabled = enable;
        if (Object.keys(updates).length === 0) {
            await interaction.editReply({
                content: "⚠️ Please provide at least one option to update.\n\n**Available options:**\n• `/levelupmessage message:` Set custom message\n• `/levelupmessage channel:` Set announcement channel\n• `/levelupmessage enable:` Enable/disable messages\n• `/levelupmessage reset:` Reset to default",
            });
            return;
        }
        // ===== SAVE SETTINGS TO DATABASE =====
        const upsertData = {
            guild_id: guildId,
            message_template: updates.message_template ?? currentSettings?.message_template ?? defaultMessage,
            channel_id: updates.channel_id !== undefined ? updates.channel_id : currentSettings?.channel_id ?? null,
            is_enabled: updates.is_enabled !== undefined ? updates.is_enabled : currentSettings?.is_enabled ?? true,
        };
        const { error: updateError } = await supabase_bot_1.supabaseBot
            .from("levelup_messages_discord")
            .upsert(upsertData, { onConflict: "guild_id" });
        if (updateError) {
            console.error("❌ Error updating settings:", updateError.message);
            await interaction.editReply({
                content: "⚠️ Failed to update level-up message settings. Please try again.",
            });
            return;
        }
        // ===== CREATE PREVIEW =====
        const finalMessage = upsertData.message_template;
        const messagePreview = finalMessage
            .replace("{user}", `<@${interaction.user.id}>`)
            .replace("{level}", "5");
        // ===== BUILD SUMMARY =====
        const summaryParts = [];
        if (updates.message_template) {
            summaryParts.push(`📝 **Message:** \`${updates.message_template}\``);
        }
        if (updates.channel_id !== undefined) {
            summaryParts.push(updates.channel_id ? `📢 **Channel:** <#${updates.channel_id}>` : `📢 **Channel:** None (disabled)`);
        }
        if (updates.is_enabled !== undefined) {
            summaryParts.push(`⚙️ **Status:** ${updates.is_enabled ? "Enabled ✅" : "Disabled ❌"}`);
        }
        const summary = summaryParts.join("\n");
        await interaction.editReply({
            content: `✅ **Level-up message configuration updated!**\n\n${summary}\n\n**Preview:**\n${messagePreview}`,
        });
        console.log(`✅ Level-up message updated for ${guildName} by ${interaction.user.username}`);
    }
    catch (error) {
        console.error("❌ Error executing /levelupmessage command:", error);
        const errMsg = {
            content: "❌ An unexpected error occurred while configuring level-up messages. Please try again later.",
        };
        if (interaction.deferred) {
            await interaction.editReply(errMsg);
        }
        else if (!interaction.replied) {
            await interaction.reply({
                ...errMsg,
                flags: [discord_js_1.MessageFlags.Ephemeral],
            });
        }
    }
};
exports.execute = execute;

"use strict";
// apps/bot/commands/configXP.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.command = void 0;
const discord_js_1 = require("discord.js");
const supabase_bot_1 = require("../utils/supabase.bot");
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("configxp")
    .setDescription("Configure the XP leveling system for your server.")
    .addIntegerOption((o) => o
    .setName("min")
    .setDescription("Minimum XP gained per message")
    .setRequired(true)
    .setMinValue(1)
    .setMaxValue(100))
    .addIntegerOption((o) => o
    .setName("max")
    .setDescription("Maximum XP gained per message")
    .setRequired(true)
    .setMinValue(1)
    .setMaxValue(100))
    .addIntegerOption((o) => o
    .setName("cooldown")
    .setDescription("Cooldown between XP gains (in seconds)")
    .setRequired(true)
    .setMinValue(0)
    .setMaxValue(300))
    .addChannelOption((o) => o
    .setName("levelup_channel")
    .setDescription("Channel where level-up messages will be sent")
    .setRequired(false))
    .setDefaultMemberPermissions(discord_js_1.PermissionFlagsBits.Administrator);
exports.command = {
    name: "configxp",
    data: slashCommand,
};
const execute = async (interaction) => {
    try {
        const guildId = interaction.guildId;
        const guildName = interaction.guild?.name ?? "Unknown Guild";
        if (!guildId) {
            await interaction.reply({
                content: "❌ This command can only be used inside a server.",
                flags: [discord_js_1.MessageFlags.Ephemeral],
            });
            return;
        }
        const min = interaction.options.getInteger("min", true);
        const max = interaction.options.getInteger("max", true);
        const cooldown = interaction.options.getInteger("cooldown", true);
        const levelUpChannel = interaction.options.getChannel("levelup_channel");
        // Validate XP range
        if (min > max) {
            await interaction.reply({
                content: "❌ Minimum XP cannot be greater than maximum XP!",
                flags: [discord_js_1.MessageFlags.Ephemeral],
            });
            return;
        }
        await interaction.deferReply({ flags: [discord_js_1.MessageFlags.Ephemeral] });
        // ✅ Ensure guild record exists
        const { error: guildError } = await supabase_bot_1.supabaseBot
            .from("guilds_discord")
            .upsert({
            id: guildId,
            name: guildName,
            active: true,
        }, { onConflict: "id" });
        if (guildError) {
            console.error("❌ Error ensuring guild record:", guildError.message);
            await interaction.editReply({
                content: "❌ Failed to ensure guild record. Please try again later.",
            });
            return;
        }
        // ✅ Upsert into xp_config_discord
        const { error: xpError } = await supabase_bot_1.supabaseBot
            .from("xp_config_discord")
            .upsert({
            guild_id: guildId,
            min_xp: min,
            max_xp: max,
            cooldown: cooldown,
            levelup_channel: levelUpChannel?.id ?? null,
        }, { onConflict: "guild_id" });
        if (xpError) {
            console.error("❌ Error saving XP config:", xpError.message);
            await interaction.editReply({
                content: "❌ Failed to save XP configuration. Please try again later.",
            });
            return;
        }
        // ✅ Also sync to settings_discord
        const { error: settingsError } = await supabase_bot_1.supabaseBot
            .from("settings_discord")
            .upsert({
            guild_id: guildId,
            xp_per_message: Math.floor((min + max) / 2), // avg XP for info purposes
            cooldown_seconds: cooldown,
            level_up_channel_id: levelUpChannel?.id ?? null,
            updated_at: new Date().toISOString(),
        }, { onConflict: "guild_id" });
        if (settingsError) {
            console.error("⚠️ Warning: settings_discord sync failed:", settingsError.message);
            // Don’t block command if this one fails, but log it
        }
        // ✅ Success message
        const summary = [
            `✅ **XP configuration updated successfully!**`,
            "",
            "**Settings:**",
            `• Min XP: **${min}**`,
            `• Max XP: **${max}**`,
            `• Cooldown: **${cooldown}s**`,
            levelUpChannel ? `• Level-up Channel: <#${levelUpChannel.id}>` : null,
        ]
            .filter(Boolean)
            .join("\n");
        await interaction.editReply({ content: summary });
        console.log(`✅ XP config + settings updated for guild: ${guildName} (${guildId})`);
    }
    catch (error) {
        console.error("🔥 Error executing configxp command:", error);
        const errorMessage = {
            content: "❌ An unexpected error occurred while saving the XP configuration.",
        };
        if (interaction.deferred) {
            await interaction.editReply(errorMessage);
        }
        else if (!interaction.replied) {
            await interaction.reply({
                ...errorMessage,
                flags: [discord_js_1.MessageFlags.Ephemeral],
            });
        }
    }
};
exports.execute = execute;

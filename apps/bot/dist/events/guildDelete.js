"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// apps/bot/events/guildDelete.ts
const discord_js_1 = require("discord.js");
const supabase_bot_1 = require("../utils/supabase.bot");
exports.default = {
    name: discord_js_1.Events.GuildDelete,
    /**
     * Triggered when the bot is removed from a guild (server)
     * @param {Guild} guild - The guild the bot was removed from
     */
    async execute(guild) {
        try {
            console.log(`👋 Bot removed from guild: ${guild.name} (${guild.id})`);
            // Step 1: Mark guild as inactive (soft delete)
            const { error: updateError } = await supabase_bot_1.supabaseBot
                .from("guilds_discord")
                .update({
                active: false,
                left_at: new Date().toISOString(),
            })
                .eq("id", guild.id); // String, not BigInt
            if (updateError) {
                console.error("❌ Error updating guild status:", updateError.message);
                return;
            }
            console.log(`✅ Guild marked as inactive: ${guild.name}`);
            // Step 2: Disable XP config for this guild
            const { error: xpUpdateError } = await supabase_bot_1.supabaseBot
                .from("xp_config_discord")
                .update({
                active: false,
            })
                .eq("guild_id", guild.id); // String, not BigInt
            if (xpUpdateError) {
                console.error("⚠️ Error updating XP config:", xpUpdateError.message);
            }
            else {
                console.log(`⚙️ XP config disabled for guild: ${guild.name}`);
            }
            // Step 3: Mark user stats as inactive (archive)
            const { error: statsUpdateError } = await supabase_bot_1.supabaseBot
                .from("user_stats_discord")
                .update({
                active: false,
            })
                .eq("guild_id", guild.id); // String, not BigInt
            if (statsUpdateError) {
                console.error("⚠️ Error updating user stats:", statsUpdateError.message);
            }
            else {
                console.log(`📊 User stats archived for guild: ${guild.name}`);
            }
            // Step 4: Disable level-up messages
            const { error: messageUpdateError } = await supabase_bot_1.supabaseBot
                .from("levelup_messages_discord")
                .update({
                is_enabled: false,
            })
                .eq("guild_id", guild.id); // String, not BigInt
            if (messageUpdateError) {
                console.error("⚠️ Error disabling level-up messages:", messageUpdateError.message);
            }
            else {
                console.log(`💬 Level-up messages disabled for guild: ${guild.name}`);
            }
            console.log(`🎯 Guild cleanup complete for: ${guild.name}`);
        }
        catch (error) {
            console.error("🔥 guildDelete event error:", error);
        }
    },
};

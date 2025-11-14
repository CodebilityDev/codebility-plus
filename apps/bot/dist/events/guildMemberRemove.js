"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// apps/bot/events/guildMemberRemove.ts
const discord_js_1 = require("discord.js");
const supabase_bot_1 = require("../utils/supabase.bot");
exports.default = {
    name: discord_js_1.Events.GuildMemberRemove,
    /**
     * Triggered when a user leaves or is removed from a guild (server)
     * @param {GuildMember | PartialGuildMember} member - The guild member who left
     */
    async execute(member) {
        try {
            const guildId = member.guild.id;
            const userId = member.id;
            const username = member.user?.tag || member.id;
            console.log(`👋 Member left guild: ${username} (${userId}) in ${member.guild.name}`);
            // Step 1: Mark user stats as inactive for this guild
            const { data: updatedStats, error: updateError } = await supabase_bot_1.supabaseBot
                .from("user_stats_discord")
                .update({ active: false })
                .eq("guild_id", guildId) // String, not BigInt
                .eq("user_id", userId) // String, not BigInt
                .select();
            if (updateError) {
                console.error("❌ Error updating user stats active status:", updateError.message);
                return;
            }
            if (updatedStats && updatedStats.length > 0) {
                console.log(`🗂️ User ${username} marked as inactive in guild ${member.guild.name}`);
            }
            else {
                console.log(`ℹ️ No stats found for user ${username} in guild ${member.guild.name}`);
            }
            // Step 2: Check if user is in any other active guilds
            const { data: activeGuilds, error: checkError } = await supabase_bot_1.supabaseBot
                .from("user_stats_discord")
                .select("guild_id")
                .eq("user_id", userId)
                .eq("active", true);
            if (checkError) {
                console.error("⚠️ Error checking other guilds:", checkError.message);
                return;
            }
            // Only mark user as globally inactive if they're not in ANY other guilds with the bot
            if (!activeGuilds || activeGuilds.length === 0) {
                const { error: userUpdateError } = await supabase_bot_1.supabaseBot
                    .from("users_discord")
                    .update({ active: false })
                    .eq("id", userId); // String, not BigInt
                if (userUpdateError) {
                    console.warn("⚠️ Failed to update users_discord active flag:", userUpdateError.message);
                }
                else {
                    console.log(`👤 User ${username} marked as globally inactive (not in any tracked guilds)`);
                }
            }
            else {
                console.log(`ℹ️ User ${username} is still active in ${activeGuilds.length} other guild(s)`);
            }
        }
        catch (err) {
            console.error("🔥 guildMemberRemove event error:", err);
        }
    },
};

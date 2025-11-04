"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.command = void 0;
// apps/bot/commands/leaderboard.ts
const discord_js_1 = require("discord.js");
const supabase_bot_1 = require("../utils/supabase.bot");
// Create the slash command
const slashCommand = new discord_js_1.SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show the top XP leaderboard for this server.")
    .addIntegerOption((opt) => opt
    .setName("limit")
    .setDescription("Number of users to display (default: 10)")
    .setRequired(false)
    .setMinValue(5)
    .setMaxValue(25))
    .setDMPermission(false);
// Export the command definition
exports.command = {
    name: "leaderboard",
    data: slashCommand,
};
// Export the execute function
const execute = async (interaction) => {
    try {
        await interaction.deferReply();
        const guildId = interaction.guildId;
        if (!guildId) {
            await interaction.editReply({
                content: "❌ This command can only be used inside a server.",
            });
            return;
        }
        const limit = interaction.options.getInteger("limit") || 10;
        // Ensure guild exists
        const { error: guildError } = await supabase_bot_1.supabaseBot
            .from("guilds_discord")
            .upsert({
            id: guildId,
            name: interaction.guild?.name || "Unknown Guild",
            active: true,
        }, { onConflict: "id" });
        if (guildError) {
            console.error("❌ Error ensuring guild record:", guildError.message);
        }
        // --- Query top users from user_stats_discord (no view needed) ---
        const { data: leaderboard, error } = await supabase_bot_1.supabaseBot
            .from("user_stats_discord")
            .select("user_id, xp, level, total_messages")
            .eq("guild_id", guildId)
            .eq("active", true)
            .order("level", { ascending: false })
            .order("xp", { ascending: false })
            .limit(limit);
        if (error) {
            console.error("❌ Error fetching leaderboard:", error.message);
            await interaction.editReply({
                content: "⚠️ Failed to fetch leaderboard data. Please try again.",
            });
            return;
        }
        if (!leaderboard || leaderboard.length === 0) {
            await interaction.editReply({
                content: "😅 **No leaderboard data yet.**\n\nStart chatting to earn XP and climb the ranks!",
            });
            return;
        }
        const requesterId = interaction.user.id;
        // Fetch usernames for all users in leaderboard
        const userIds = leaderboard.map(entry => entry.user_id);
        const { data: users } = await supabase_bot_1.supabaseBot
            .from("users_discord")
            .select("id, username")
            .in("id", userIds);
        const userMap = new Map(users?.map(u => [u.id, u.username]) || []);
        // --- Build leaderboard description with highlighting ---
        const description = leaderboard
            .map((entry, index) => {
            const rank = index + 1;
            const medal = rank === 1 ? "🥇" :
                rank === 2 ? "🥈" :
                    rank === 3 ? "🥉" :
                        `#${rank}`;
            const isRequester = entry.user_id === requesterId;
            const username = userMap.get(entry.user_id) || `User ${entry.user_id}`;
            const userPrefix = isRequester ? "➡️ " : "";
            const userHighlightStart = isRequester ? "**" : "";
            const userHighlightEnd = isRequester ? "**" : "";
            return `${userPrefix}${medal} ${userHighlightStart}${username}${userHighlightEnd} — Level ${entry.level} (${entry.xp.toLocaleString()} XP)`;
        })
            .join("\n");
        // --- Include requester rank if not in top ---
        const requesterInTop = leaderboard.find((entry) => entry.user_id === requesterId);
        let requesterRankInfo = "";
        if (!requesterInTop) {
            const { data: requesterData } = await supabase_bot_1.supabaseBot
                .from("user_stats_discord")
                .select("user_id, level, xp")
                .eq("guild_id", guildId)
                .eq("user_id", requesterId)
                .eq("active", true)
                .maybeSingle();
            if (requesterData) {
                // Calculate requester's rank
                const { data: allUsers } = await supabase_bot_1.supabaseBot
                    .from("user_stats_discord")
                    .select("user_id, level, xp")
                    .eq("guild_id", guildId)
                    .eq("active", true)
                    .order("level", { ascending: false })
                    .order("xp", { ascending: false });
                const requesterRank = (allUsers?.findIndex(u => u.user_id === requesterId) ?? -1) + 1;
                if (requesterRank > 0) {
                    requesterRankInfo = `\n\n➡️ **${interaction.user.username}** — Your Rank: #${requesterRank} — Level ${requesterData.level} (${requesterData.xp.toLocaleString()} XP)`;
                }
            }
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`🏆 ${interaction.guild?.name} Leaderboard`)
            .setDescription(description + requesterRankInfo)
            .setColor("#FFD700")
            .setThumbnail(interaction.guild?.iconURL() || "")
            .setFooter({
            text: `Showing top ${leaderboard.length} member${leaderboard.length !== 1 ? 's' : ''} • Chat more to climb the ranks!`
        })
            .setTimestamp();
        await interaction.editReply({ embeds: [embed] });
        console.log(`✅ Leaderboard displayed for ${interaction.guild?.name} by ${interaction.user.username}`);
    }
    catch (error) {
        console.error("❌ Error executing leaderboard command:", error);
        const errorMessage = {
            content: "❌ An error occurred while fetching the leaderboard. Please try again.",
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

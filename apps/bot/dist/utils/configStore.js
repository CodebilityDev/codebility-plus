"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveXPConfig = saveXPConfig;
exports.getXPConfig = getXPConfig;
exports.resetXPConfig = resetXPConfig;
exports.getLevelUpMessageConfig = getLevelUpMessageConfig;
exports.getGuildConfig = getGuildConfig;
// apps/bot/utils/configStore.ts
const supabase_bot_1 = require("./supabase.bot");
const DEFAULT_CONFIG = {
    minXP: 5,
    maxXP: 15,
    cooldown: 60,
    levelUpChannel: null,
    levelUpMessage: "🎉 {user} leveled up to **Level {level}**!",
};
const TABLE = "xp_config_discord";
/**
 * Save or update guild XP config in xp_config_discord table.
 */
async function saveXPConfig(guildId, config) {
    if (!guildId)
        throw new Error("guildId required");
    const payload = {
        guild_id: guildId, // String, not BigInt
        min_xp: config.minXP ?? DEFAULT_CONFIG.minXP,
        max_xp: config.maxXP ?? DEFAULT_CONFIG.maxXP,
        cooldown: config.cooldown ?? DEFAULT_CONFIG.cooldown,
        levelup_channel: config.levelUpChannel ?? DEFAULT_CONFIG.levelUpChannel,
        levelup_message: config.levelUpMessage ?? DEFAULT_CONFIG.levelUpMessage,
        active: true,
    };
    const { error } = await supabase_bot_1.supabaseBot.from(TABLE).upsert(payload, {
        onConflict: "guild_id",
    });
    if (error) {
        console.error("❌ Error saving XP config:", error.message);
        throw error;
    }
    console.log(`✅ XP config saved for guild: ${guildId}`);
    return { success: true };
}
/**
 * Retrieve guild XP config from xp_config_discord table.
 * Returns defaults if no config found.
 */
async function getXPConfig(guildId) {
    if (!guildId)
        return DEFAULT_CONFIG;
    // Fetch from xp_config_discord
    const { data: configData, error } = await supabase_bot_1.supabaseBot
        .from(TABLE)
        .select("*")
        .eq("guild_id", guildId) // String, not BigInt
        .maybeSingle();
    if (error) {
        console.error("❌ Error fetching XP config:", error.message);
        return DEFAULT_CONFIG;
    }
    if (!configData) {
        return DEFAULT_CONFIG;
    }
    return {
        minXP: configData.min_xp ?? DEFAULT_CONFIG.minXP,
        maxXP: configData.max_xp ?? DEFAULT_CONFIG.maxXP,
        cooldown: configData.cooldown ?? DEFAULT_CONFIG.cooldown,
        levelUpChannel: configData.levelup_channel ?? DEFAULT_CONFIG.levelUpChannel,
        levelUpMessage: configData.levelup_message ?? DEFAULT_CONFIG.levelUpMessage,
    };
}
/**
 * Reset XP config to defaults (delete row in xp_config_discord table)
 */
async function resetXPConfig(guildId) {
    if (!guildId)
        throw new Error("guildId required");
    const { error } = await supabase_bot_1.supabaseBot
        .from(TABLE)
        .delete()
        .eq("guild_id", guildId); // String, not BigInt
    if (error) {
        console.error("❌ Error resetting XP config:", error.message);
        throw error;
    }
    console.log(`✅ XP config reset for guild: ${guildId}`);
    return { success: true };
}
/**
 * Get level-up message configuration for a guild
 */
async function getLevelUpMessageConfig(guildId) {
    if (!guildId) {
        return {
            message: DEFAULT_CONFIG.levelUpMessage,
            channelId: null,
            enabled: true,
        };
    }
    const { data: messageConfig, error } = await supabase_bot_1.supabaseBot
        .from("levelup_messages_discord")
        .select("*")
        .eq("guild_id", guildId) // String, not BigInt
        .maybeSingle();
    if (error) {
        console.error("❌ Error fetching level-up message config:", error.message);
    }
    return {
        message: messageConfig?.message_template ?? DEFAULT_CONFIG.levelUpMessage,
        channelId: messageConfig?.channel_id ?? null,
        enabled: messageConfig?.is_enabled ?? true,
    };
}
/**
 * Get complete guild configuration (XP + Level-up messages)
 */
async function getGuildConfig(guildId) {
    const xpConfig = await getXPConfig(guildId);
    const levelUpConfig = await getLevelUpMessageConfig(guildId);
    return {
        xp: xpConfig,
        levelUpMessage: levelUpConfig,
    };
}

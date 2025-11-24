"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrCreateXPConfig = getOrCreateXPConfig;
exports.getUserXP = getUserXP;
exports.updateUserXP = updateUserXP;
exports.getXPForLevel = getXPForLevel;
exports.getLevelFromXP = getLevelFromXP;
exports.checkLevelUp = checkLevelUp;
exports.getRandomXP = getRandomXP;
exports.isOnCooldown = isOnCooldown;
exports.getUserRank = getUserRank;
exports.getLevelProgress = getLevelProgress;
// apps/bot/utils/xpHelper.ts
const supabase_bot_1 = require("./supabase.bot");
const xpConstants_1 = require("./xpConstants"); // ✅ shared XP formula
// ---------------------------
// Guild XP Config
// ---------------------------
async function getOrCreateXPConfig(guild_id) {
    if (!guild_id)
        return null;
    const { data, error } = await supabase_bot_1.supabaseBot
        .from("xp_config_discord")
        .select("*")
        .eq("guild_id", guild_id)
        .maybeSingle();
    if (error) {
        console.error("❌ xpHelper: Error fetching XP config:", error.message);
        return null;
    }
    if (data)
        return data;
    // Create default
    const defaultConfig = {
        guild_id,
        min_xp: 5,
        max_xp: 15,
        cooldown: 60,
        levelup_channel: null,
        levelup_message: "🎉 {user} reached Level {level}!",
        active: true,
    };
    const { data: newConfig, error: insertError } = await supabase_bot_1.supabaseBot
        .from("xp_config_discord")
        .insert(defaultConfig)
        .select()
        .single();
    if (insertError) {
        console.error("❌ xpHelper: Error creating XP config:", insertError.message);
        return null;
    }
    return newConfig;
}
// ---------------------------
// User XP
// ---------------------------
async function getUserXP(guild_id, user_id) {
    if (!guild_id || !user_id)
        return null;
    const { data, error } = await supabase_bot_1.supabaseBot
        .from("user_stats_discord")
        .select("*")
        .eq("guild_id", guild_id)
        .eq("user_id", user_id)
        .maybeSingle();
    if (error) {
        console.error("❌ xpHelper: Error fetching user stats:", error.message);
        return null;
    }
    if (data)
        return data;
    // Create new user stats
    const newData = {
        guild_id,
        user_id,
        xp: 0,
        level: 0,
        total_messages: 0,
        last_message_at: new Date().toISOString(),
        active: true,
    };
    const { data: newStats, error: insertError } = await supabase_bot_1.supabaseBot
        .from("user_stats_discord")
        .insert(newData)
        .select()
        .single();
    if (insertError) {
        console.error("❌ xpHelper: Error creating user stats:", insertError.message);
        return null;
    }
    console.log(`✅ Created new stats for user ${user_id} in guild ${guild_id}`);
    return newStats;
}
// ---------------------------
// Update User XP
// ---------------------------
async function updateUserXP(guild_id, user_id, xp, level, incrementMessages = true) {
    if (!guild_id || !user_id)
        return false;
    const updateData = {
        xp,
        level,
        last_message_at: new Date().toISOString(),
    };
    if (incrementMessages) {
        const { data: currentStats } = await supabase_bot_1.supabaseBot
            .from("user_stats_discord")
            .select("total_messages")
            .eq("guild_id", guild_id)
            .eq("user_id", user_id)
            .maybeSingle();
        updateData.total_messages = (currentStats?.total_messages ?? 0) + 1;
    }
    const { error } = await supabase_bot_1.supabaseBot
        .from("user_stats_discord")
        .update(updateData)
        .eq("guild_id", guild_id)
        .eq("user_id", user_id);
    if (error) {
        console.error("❌ xpHelper: Error updating user XP:", error.message);
        return false;
    }
    return true;
}
// ---------------------------
// XP & Level calculations
// ---------------------------
function getXPForLevel(level) {
    return (0, xpConstants_1.xpForLevel)(level);
}
function getLevelFromXP(totalXP) {
    let level = 0;
    let remaining = totalXP;
    while (remaining >= (0, xpConstants_1.xpForLevel)(level)) {
        remaining -= (0, xpConstants_1.xpForLevel)(level);
        level++;
    }
    return level;
}
function checkLevelUp(currentXP, currentLevel) {
    const xpNeeded = (0, xpConstants_1.xpForLevel)(currentLevel);
    const leveledUp = currentXP >= xpNeeded;
    return {
        leveledUp,
        newLevel: leveledUp ? currentLevel + 1 : currentLevel,
        newXP: currentXP,
    };
}
function getRandomXP(minXP, maxXP) {
    return Math.floor(Math.random() * (maxXP - minXP + 1)) + minXP;
}
function isOnCooldown(lastMessageAt, cooldownSeconds) {
    if (!lastMessageAt)
        return false;
    return Date.now() - new Date(lastMessageAt).getTime() < cooldownSeconds * 1000;
}
// ---------------------------
// User Rank
// ---------------------------
async function getUserRank(guild_id, user_id) {
    if (!guild_id || !user_id)
        return null;
    const { data: allUsers, error } = await supabase_bot_1.supabaseBot
        .from("user_stats_discord")
        .select("user_id, level, xp")
        .eq("guild_id", guild_id)
        .eq("active", true)
        .order("level", { ascending: false })
        .order("xp", { ascending: false });
    if (error) {
        console.error("❌ xpHelper: Error fetching user ranks:", error.message);
        return null;
    }
    if (!allUsers || allUsers.length === 0)
        return { rank: 0, totalUsers: 0 };
    const rank = allUsers.findIndex((u) => u.user_id === user_id) + 1;
    return { rank, totalUsers: allUsers.length };
}
function getLevelProgress(totalXP) {
    let level = 0;
    let remainingXP = totalXP;
    while (remainingXP >= (0, xpConstants_1.xpForLevel)(level)) {
        remainingXP -= (0, xpConstants_1.xpForLevel)(level);
        level++;
    }
    return {
        level,
        xpIntoLevel: remainingXP,
        xpToNextLevel: (0, xpConstants_1.xpForLevel)(level) - remainingXP,
        totalXP,
    };
}

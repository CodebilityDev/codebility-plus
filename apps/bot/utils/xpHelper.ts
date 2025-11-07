// apps/bot/utils/xpHelper.ts
import { supabaseBot } from "./supabase.bot.js";
import { xpForLevel } from "./xpConstants.js"; // ✅ shared XP formula

// ---------------------------
// Types
// ---------------------------

export interface XPConfig {
  id: number;
  guild_id: string;
  min_xp: number;
  max_xp: number;
  cooldown: number;
  levelup_channel: string | null;
  levelup_message: string;
  active: boolean;
  created_at?: string;
}

export interface UserStats {
  id: number;
  guild_id: string;
  user_id: string;
  xp: number;
  level: number;
  total_messages: number;
  last_message_at: string | null;
  updated_at?: string;
  active: boolean;
}

// ---------------------------
// Guild XP Config
// ---------------------------
export async function getOrCreateXPConfig(guild_id: string): Promise<XPConfig | null> {
  if (!guild_id) return null;

  const { data, error } = await supabaseBot
    .from("xp_config_discord")
    .select("*")
    .eq("guild_id", guild_id)
    .maybeSingle();

  if (error) {
    console.error("❌ xpHelper: Error fetching XP config:", error.message);
    return null;
  }

  if (data) return data as XPConfig;

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

  const { data: newConfig, error: insertError } = await supabaseBot
    .from("xp_config_discord")
    .insert(defaultConfig)
    .select()
    .single();

  if (insertError) {
    console.error("❌ xpHelper: Error creating XP config:", insertError.message);
    return null;
  }

  return newConfig as XPConfig;
}

// ---------------------------
// User XP
// ---------------------------
export async function getUserXP(
  guild_id: string,
  user_id: string
): Promise<UserStats | null> {
  if (!guild_id || !user_id) return null;

  const { data, error } = await supabaseBot
    .from("user_stats_discord")
    .select("*")
    .eq("guild_id", guild_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (error) {
    console.error("❌ xpHelper: Error fetching user stats:", error.message);
    return null;
  }

  if (data) return data as UserStats;

  // Create new user stats
  const newData: Omit<UserStats, "id" | "updated_at"> = {
    guild_id,
    user_id,
    xp: 0,
    level: 0,
    total_messages: 0,
    last_message_at: new Date().toISOString(),
    active: true,
  };

  const { data: newStats, error: insertError } = await supabaseBot
    .from("user_stats_discord")
    .insert(newData)
    .select()
    .single();

  if (insertError) {
    console.error("❌ xpHelper: Error creating user stats:", insertError.message);
    return null;
  }

  console.log(`✅ Created new stats for user ${user_id} in guild ${guild_id}`);
  return newStats as UserStats;
}

// ---------------------------
// Update User XP
// ---------------------------
export async function updateUserXP(
  guild_id: string,
  user_id: string,
  xp: number,
  level: number,
  incrementMessages = true
): Promise<boolean> {
  if (!guild_id || !user_id) return false;

  const updateData: Partial<UserStats> = {
    xp,
    level,
    last_message_at: new Date().toISOString(),
  };

  if (incrementMessages) {
    const { data: currentStats } = await supabaseBot
      .from("user_stats_discord")
      .select("total_messages")
      .eq("guild_id", guild_id)
      .eq("user_id", user_id)
      .maybeSingle();

    updateData.total_messages = (currentStats?.total_messages ?? 0) + 1;
  }

  const { error } = await supabaseBot
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
export function getXPForLevel(level: number): number {
  return xpForLevel(level);
}

export function getLevelFromXP(totalXP: number): number {
  let level = 0;
  let remaining = totalXP;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return level;
}

export function checkLevelUp(currentXP: number, currentLevel: number) {
  const xpNeeded = xpForLevel(currentLevel);
  const leveledUp = currentXP >= xpNeeded;
  return {
    leveledUp,
    newLevel: leveledUp ? currentLevel + 1 : currentLevel,
    newXP: currentXP,
  };
}

export function getRandomXP(minXP: number, maxXP: number): number {
  return Math.floor(Math.random() * (maxXP - minXP + 1)) + minXP;
}

export function isOnCooldown(lastMessageAt: string | null, cooldownSeconds: number): boolean {
  if (!lastMessageAt) return false;
  return Date.now() - new Date(lastMessageAt).getTime() < cooldownSeconds * 1000;
}

// ---------------------------
// User Rank
// ---------------------------
export async function getUserRank(
  guild_id: string,
  user_id: string
): Promise<{ rank: number; totalUsers: number } | null> {
  if (!guild_id || !user_id) return null;

  const { data: allUsers, error } = await supabaseBot
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

  if (!allUsers || allUsers.length === 0) return { rank: 0, totalUsers: 0 };

  const rank = allUsers.findIndex((u) => u.user_id === user_id) + 1;
  return { rank, totalUsers: allUsers.length };
}





export function getLevelProgress(totalXP: number) {
  let level = 0;
  let remainingXP = totalXP;

  while (remainingXP >= xpForLevel(level)) {
    remainingXP -= xpForLevel(level);
    level++;
  }

  return {
    level,
    xpIntoLevel: remainingXP,
    xpToNextLevel: xpForLevel(level) - remainingXP,
    totalXP,
  };
}

// app/bot/utils/xpHelper.ts
import { supabaseBot } from "./supabase.bot";

/**
 * XP Configuration interface matching database schema
 */
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

/**
 * User Stats interface matching database schema
 */
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

/**
 * Get or create guild XP configuration
 */
export async function getOrCreateXPConfig(
  guild_id: string
): Promise<XPConfig | null> {
  if (!guild_id) {
    console.error("❌ xpHelper: guild_id is required");
    return null;
  }

  // Try to get existing config
  const { data, error } = await supabaseBot
    .from("xp_config_discord")
    .select("*")
    .eq("guild_id", guild_id) // String, not BigInt
    .maybeSingle();

  if (error) {
    console.error("❌ xpHelper: Error fetching XP config:", error.message);
    return null;
  }

  if (data) return data as XPConfig;

  // Create default config
  const defaultConfig = {
    guild_id, // String, not BigInt
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

/**
 * Get or create user XP stats
 */
export async function getUserXP(
  guild_id: string,
  user_id: string,
  username?: string
): Promise<UserStats | null> {
  if (!guild_id || !user_id) {
    console.error("❌ xpHelper: guild_id and user_id are required");
    return null;
  }

  // Try to get existing stats
  const { data, error } = await supabaseBot
    .from("user_stats_discord")
    .select("*")
    .eq("guild_id", guild_id) // String, not BigInt
    .eq("user_id", user_id)   // String, not BigInt
    .maybeSingle();

  if (error) {
    console.error("❌ xpHelper: Error fetching user stats:", error.message);
    return null;
  }

  if (data) return data as UserStats;

  // Create new stats entry
  const newData = {
    guild_id, // String, not BigInt
    user_id,  // String, not BigInt
    xp: 0,
    level: 1, // Start at level 1, not 0
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

/**
 * Update user XP and level
 */
export async function updateUserXP(
  guild_id: string,
  user_id: string,
  xp: number,
  level: number,
  incrementMessages: boolean = true
): Promise<boolean> {
  if (!guild_id || !user_id) {
    console.error("❌ xpHelper: guild_id and user_id are required");
    return false;
  }

  const updateData: any = {
    xp,
    level,
    last_message_at: new Date().toISOString(),
  };

  // Optionally increment message count
  if (incrementMessages) {
    // Get current message count first
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
    .eq("guild_id", guild_id) // String, not BigInt
    .eq("user_id", user_id);  // String, not BigInt

  if (error) {
    console.error("❌ xpHelper: Error updating user XP:", error.message);
    return false;
  }

  return true;
}

/**
 * Calculate XP needed for next level
 */
export function getXPForLevel(level: number): number {
  return 100 * (level + 1);
}

/**
 * Calculate level from total XP
 */
export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpNeeded = getXPForLevel(level);
  let currentXP = totalXP;

  while (currentXP >= xpNeeded) {
    currentXP -= xpNeeded;
    level++;
    xpNeeded = getXPForLevel(level);
  }

  return level;
}

/**
 * Check if user has leveled up
 */
export function checkLevelUp(currentXP: number, currentLevel: number): {
  leveledUp: boolean;
  newLevel: number;
  newXP: number;
} {
  const xpNeeded = getXPForLevel(currentLevel);

  if (currentXP >= xpNeeded) {
    return {
      leveledUp: true,
      newLevel: currentLevel + 1,
      newXP: currentXP, // Keep total XP
    };
  }

  return {
    leveledUp: false,
    newLevel: currentLevel,
    newXP: currentXP,
  };
}

/**
 * Get random XP gain within min and max range
 */
export function getRandomXP(minXP: number, maxXP: number): number {
  return Math.floor(Math.random() * (maxXP - minXP + 1)) + minXP;
}

/**
 * Check if user is on cooldown
 */
export function isOnCooldown(
  lastMessageAt: string | null,
  cooldownSeconds: number
): boolean {
  if (!lastMessageAt) return false;

  const lastMessageTime = new Date(lastMessageAt).getTime();
  const now = Date.now();
  const cooldownMs = cooldownSeconds * 1000;

  return now - lastMessageTime < cooldownMs;
}

/**
 * Get user's rank in a guild
 */
export async function getUserRank(
  guild_id: string,
  user_id: string
): Promise<{ rank: number; totalUsers: number } | null> {
  if (!guild_id || !user_id) {
    console.error("❌ xpHelper: guild_id and user_id are required");
    return null;
  }

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

  if (!allUsers || allUsers.length === 0) {
    return { rank: 0, totalUsers: 0 };
  }

  const rank = allUsers.findIndex((u) => u.user_id === user_id) + 1;
  const totalUsers = allUsers.length;

  return { rank, totalUsers };
}
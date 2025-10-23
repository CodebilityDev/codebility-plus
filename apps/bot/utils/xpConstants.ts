// apps/bot/utils/xpConstants.ts

/** Base XP required per level — adjust here to rebalance system */
export const BASE_XP = 100;

/**
 * XP required for a given level.
 * Example: level 0 → 100 XP, level 1 → 200 XP, etc.
 */
export function xpForLevel(level: number): number {
  return BASE_XP * (level + 1);
}

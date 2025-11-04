"use strict";
// apps/bot/utils/xpConstants.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_XP = void 0;
exports.xpForLevel = xpForLevel;
/** Base XP required per level — adjust here to rebalance system */
exports.BASE_XP = 100;
/**
 * XP required for a given level.
 * Example: level 0 → 100 XP, level 1 → 200 XP, etc.
 */
function xpForLevel(level) {
    return exports.BASE_XP * (level + 1);
}

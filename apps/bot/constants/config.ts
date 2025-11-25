// apps/bot/constants/config.ts

/**
 * Bot Configuration Constants
 */

// XP System
export const XP_CONFIG = {
  DEFAULT_MIN_XP: 5,
  DEFAULT_MAX_XP: 15,
  DEFAULT_COOLDOWN: 60, // seconds
  MAX_LEVEL: 100,
  MIN_LEVEL: 0,
} as const;

// Cooldown Management
export const COOLDOWN_CONFIG = {
  CLEANUP_INTERVAL: 5 * 60 * 1000, // 5 minutes
  EXPIRY_TIME: 10 * 60 * 1000, // 10 minutes
} as const;

// Nickname Management
export const NICKNAME_CONFIG = {
  MAX_LENGTH: 32,
  SEPARATOR: ' | ',
  MIN_USERNAME_LENGTH: 3,
} as const;

// Canvas/Rank Card
export const RANK_CARD_CONFIG = {
  DEFAULT_WIDTH: 800,
  DEFAULT_HEIGHT: 250,
  DEFAULT_BACKGROUND_COLOR: '#23272A',
  DEFAULT_TEXT_COLOR: '#FFFFFF',
} as const;

// Message Templates
export const DEFAULT_MESSAGES = {
  LEVEL_UP: '🎉 {user} leveled up to **Level {level}**!',
  XP_GAIN: '🎯 {user} gained **{xp} XP**! (Total: {total_xp} XP | Level {level})',
  REWARD_NOTIFICATION: '🎁 {user} reached **Level {level}** and earned the role(s): {roles}!',
} as const;

// Rate Limiting
export const RATE_LIMIT_CONFIG = {
  MAX_COMMANDS_PER_MINUTE: 10,
  MAX_COMMANDS_PER_HOUR: 50,
  CLEANUP_INTERVAL: 60 * 1000, // 1 minute
} as const;

// Validation
export const VALIDATION = {
  MAX_MESSAGE_LENGTH: 2000,
  MAX_USERNAME_LENGTH: 32,
  MAX_ROLE_NAME_LENGTH: 100,
  MIN_XP_VALUE: 1,
  MAX_XP_VALUE: 1000,
  MIN_COOLDOWN: 5, // seconds
  MAX_COOLDOWN: 3600, // 1 hour
} as const;

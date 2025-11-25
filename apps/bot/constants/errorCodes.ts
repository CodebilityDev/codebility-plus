// apps/bot/constants/errorCodes.ts

/**
 * PostgreSQL Error Codes
 * Reference: https://www.postgresql.org/docs/current/errcodes-appendix.html
 */
export const POSTGRES_ERROR_CODES = {
  // No data found
  NO_ROWS_FOUND: 'PGRST116',

  // Integrity constraint violations
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',

  // Data exceptions
  STRING_DATA_RIGHT_TRUNCATION: '22001',
  NUMERIC_VALUE_OUT_OF_RANGE: '22003',
  INVALID_TEXT_REPRESENTATION: '22P02',

  // Connection errors
  CONNECTION_EXCEPTION: '08000',
  CONNECTION_DOES_NOT_EXIST: '08003',
  CONNECTION_FAILURE: '08006',
} as const;

/**
 * Discord API Error Codes
 */
export const DISCORD_ERROR_CODES = {
  MISSING_PERMISSIONS: 50013,
  CANNOT_MESSAGE_USER: 50007,
  UNKNOWN_CHANNEL: 10003,
  UNKNOWN_GUILD: 10004,
  UNKNOWN_ROLE: 10011,
  UNKNOWN_USER: 10013,
  UNKNOWN_EMOJI: 10014,
  MAX_CHANNELS: 50035,
} as const;

/**
 * Custom Bot Error Codes
 */
export const BOT_ERROR_CODES = {
  INVALID_XP_CONFIG: 'BOT_001',
  USER_NOT_FOUND: 'BOT_002',
  GUILD_NOT_FOUND: 'BOT_003',
  REWARD_NOT_FOUND: 'BOT_004',
  INSUFFICIENT_PERMISSIONS: 'BOT_005',
  COOLDOWN_ACTIVE: 'BOT_006',
  INVALID_LEVEL: 'BOT_007',
  DATABASE_ERROR: 'BOT_008',
} as const;

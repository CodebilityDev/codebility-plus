// apps/bot/utils/validation.ts

import { VALIDATION } from "../constants/config";

/**
 * Validation utility functions for user-generated content
 */

/**
 * Sanitizes user input by removing potentially dangerous characters
 * while preserving Discord markdown and mentions
 */
export function sanitizeUserInput(input: string): string {
  // Remove null bytes and control characters (except newlines and tabs)
  let sanitized = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Limit length
  if (sanitized.length > VALIDATION.MAX_MESSAGE_LENGTH) {
    sanitized = sanitized.substring(0, VALIDATION.MAX_MESSAGE_LENGTH);
  }

  return sanitized.trim();
}

/**
 * Validates XP configuration values
 */
export function validateXPConfig(config: {
  minXP: number;
  maxXP: number;
  cooldown: number;
}): { valid: boolean; error?: string } {
  // Validate XP range
  if (config.minXP < VALIDATION.MIN_XP_VALUE) {
    return {
      valid: false,
      error: `Minimum XP must be at least ${VALIDATION.MIN_XP_VALUE}`,
    };
  }

  if (config.maxXP > VALIDATION.MAX_XP_VALUE) {
    return {
      valid: false,
      error: `Maximum XP cannot exceed ${VALIDATION.MAX_XP_VALUE}`,
    };
  }

  if (config.minXP > config.maxXP) {
    return {
      valid: false,
      error: "Minimum XP cannot be greater than maximum XP",
    };
  }

  // Validate cooldown
  if (config.cooldown < VALIDATION.MIN_COOLDOWN) {
    return {
      valid: false,
      error: `Cooldown must be at least ${VALIDATION.MIN_COOLDOWN} seconds`,
    };
  }

  if (config.cooldown > VALIDATION.MAX_COOLDOWN) {
    return {
      valid: false,
      error: `Cooldown cannot exceed ${VALIDATION.MAX_COOLDOWN} seconds (${VALIDATION.MAX_COOLDOWN / 60} minutes)`,
    };
  }

  return { valid: true };
}

/**
 * Validates message template contains required placeholders
 */
export function validateMessageTemplate(
  template: string,
  requiredPlaceholders: string[]
): { valid: boolean; error?: string } {
  // Sanitize the template
  const sanitized = sanitizeUserInput(template);

  // Check if template is empty after sanitization
  if (!sanitized || sanitized.length === 0) {
    return {
      valid: false,
      error: "Message template cannot be empty",
    };
  }

  // Check for required placeholders
  for (const placeholder of requiredPlaceholders) {
    if (!sanitized.includes(placeholder)) {
      return {
        valid: false,
        error: `Message template must include the ${placeholder} placeholder`,
      };
    }
  }

  // Check for balanced curly braces (basic validation)
  const openBraces = (sanitized.match(/{/g) || []).length;
  const closeBraces = (sanitized.match(/}/g) || []).length;

  if (openBraces !== closeBraces) {
    return {
      valid: false,
      error: "Message template has unbalanced curly braces",
    };
  }

  return { valid: true };
}

/**
 * Validates level number is within acceptable range
 */
export function validateLevel(level: number): { valid: boolean; error?: string } {
  if (!Number.isInteger(level)) {
    return {
      valid: false,
      error: "Level must be a whole number",
    };
  }

  if (level < 1) {
    return {
      valid: false,
      error: "Level must be at least 1",
    };
  }

  if (level > 100) {
    return {
      valid: false,
      error: "Level cannot exceed 100",
    };
  }

  return { valid: true };
}

/**
 * Validates username/nickname length and content
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeUserInput(username);

  if (!sanitized || sanitized.length === 0) {
    return {
      valid: false,
      error: "Username cannot be empty",
    };
  }

  if (sanitized.length > VALIDATION.MAX_USERNAME_LENGTH) {
    return {
      valid: false,
      error: `Username cannot exceed ${VALIDATION.MAX_USERNAME_LENGTH} characters`,
    };
  }

  // Check for Discord mention patterns that could be abused
  if (sanitized.includes("@everyone") || sanitized.includes("@here")) {
    return {
      valid: false,
      error: "Username cannot contain @everyone or @here",
    };
  }

  return { valid: true };
}

/**
 * Validates role name
 */
export function validateRoleName(roleName: string): { valid: boolean; error?: string } {
  const sanitized = sanitizeUserInput(roleName);

  if (!sanitized || sanitized.length === 0) {
    return {
      valid: false,
      error: "Role name cannot be empty",
    };
  }

  if (sanitized.length > VALIDATION.MAX_ROLE_NAME_LENGTH) {
    return {
      valid: false,
      error: `Role name cannot exceed ${VALIDATION.MAX_ROLE_NAME_LENGTH} characters`,
    };
  }

  return { valid: true };
}

/**
 * Validates Discord ID format (snowflake)
 */
export function validateDiscordId(id: string): boolean {
  // Discord IDs are snowflakes: 17-19 digit numbers
  return /^\d{17,19}$/.test(id);
}

/**
 * Escapes special regex characters in a string
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

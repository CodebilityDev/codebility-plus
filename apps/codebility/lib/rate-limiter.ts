import redis from "./server/redis";

interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function cleanupExpiredMemoryEntry(key: string, now: number): RateLimitEntry | null {
  const entry = rateLimitStore.get(key);
  if (!entry) return null;
  if (now > entry.resetAt) {
    rateLimitStore.delete(key);
    return null;
  }
  return entry;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Checks whether a given key has exceeded its maximum attempts within the time window.
 */
export async function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 5 * 60 * 1000
): Promise<RateLimitResult> {
  const normalizedKey = key.toLowerCase().trim();
  const redisKey = `ratelimit:${normalizedKey}`;

  if (redis) {
    try {
      const [countStr, ttlSeconds] = await Promise.all([
        redis.get(redisKey),
        redis.ttl(redisKey),
      ]);

      const attempts = countStr ? parseInt(countStr, 10) || 0 : 0;
      const ttl = ttlSeconds && ttlSeconds > 0 ? ttlSeconds : Math.ceil(windowMs / 1000);

      if (attempts >= maxAttempts) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.max(ttl, 1),
        };
      }

      return {
        allowed: true,
        remaining: Math.max(maxAttempts - attempts, 0),
        retryAfterSeconds: 0,
      };
    } catch (err) {
      console.warn(`Redis checkRateLimit error for key "${key}" - falling back to memory:`, err);
    }
  }

  // In-memory fallback
  const now = Date.now();
  const entry = cleanupExpiredMemoryEntry(normalizedKey, now);

  if (!entry) {
    return {
      allowed: true,
      remaining: maxAttempts,
      retryAfterSeconds: 0,
    };
  }

  if (entry.attempts >= maxAttempts) {
    const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(retryAfterSeconds, 1),
    };
  }

  return {
    allowed: true,
    remaining: Math.max(maxAttempts - entry.attempts, 0),
    retryAfterSeconds: 0,
  };
}

/**
 * Records a failed attempt for the given key, incrementing its attempt counter.
 */
export async function recordRateLimitAttempt(
  key: string,
  windowMs: number = 5 * 60 * 1000
): Promise<void> {
  const normalizedKey = key.toLowerCase().trim();
  const redisKey = `ratelimit:${normalizedKey}`;

  if (redis) {
    try {
      const attempts = await redis.incr(redisKey);
      if (attempts === 1) {
        await redis.pexpire(redisKey, windowMs);
      }
      return;
    } catch (err) {
      console.warn(`Redis recordRateLimitAttempt error for key "${key}" - falling back to memory:`, err);
    }
  }

  // In-memory fallback
  const now = Date.now();
  const entry = cleanupExpiredMemoryEntry(normalizedKey, now);

  if (!entry) {
    rateLimitStore.set(normalizedKey, {
      attempts: 1,
      resetAt: now + windowMs,
    });
  } else {
    entry.attempts += 1;
  }
}

/**
 * Resets the attempt counter for the given key (e.g. on successful login).
 */
export async function resetRateLimit(key: string): Promise<void> {
  const normalizedKey = key.toLowerCase().trim();
  const redisKey = `ratelimit:${normalizedKey}`;

  if (redis) {
    try {
      await redis.del(redisKey);
    } catch (err) {
      console.warn(`Redis resetRateLimit error for key "${key}":`, err);
    }
  }

  rateLimitStore.delete(normalizedKey);
}

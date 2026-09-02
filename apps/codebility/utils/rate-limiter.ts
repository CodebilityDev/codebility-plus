interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 5 * 60 * 1000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  cleanupExpiredEntries();

  const now = Date.now();
  const normalizedKey = key.toLowerCase().trim();
  const entry = rateLimitStore.get(normalizedKey);

  if (!entry || now > entry.resetAt) {
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
    remaining: maxAttempts - entry.attempts,
    retryAfterSeconds: 0,
  };
}

export function recordRateLimitAttempt(
  key: string,
  windowMs: number = 5 * 60 * 1000
): void {
  const now = Date.now();
  const normalizedKey = key.toLowerCase().trim();
  const entry = rateLimitStore.get(normalizedKey);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(normalizedKey, {
      attempts: 1,
      resetAt: now + windowMs,
    });
  } else {
    entry.attempts += 1;
  }
}

export function resetRateLimit(key: string): void {
  const normalizedKey = key.toLowerCase().trim();
  rateLimitStore.delete(normalizedKey);
}

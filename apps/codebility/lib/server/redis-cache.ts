import redis from './redis';

export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 3600
): Promise<T> {
  // If Redis is not configured, just fetch the data
  if (!redis) {
    return await fetcher();
  }

  let isRedisHealthy = true;

  // Try to get from cache first with timeout
  try {
    const cached = await Promise.race([
      redis.get(key),
      new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Redis GET timeout')), 1500)
      )
    ]);

    if (cached) {
      try {
        return JSON.parse(cached) as T;
      } catch (parseError) {
        console.warn(`Redis cache parse error for key "${key}"`, parseError);
        try {
          await redis.del(key);
        } catch (delError) {
          console.warn(`Redis DEL error for key "${key}"`, delError);
        }
      }
    }
  } catch (redisError) {
    console.warn(`Redis GET error for key "${key}"`, redisError);
    isRedisHealthy = false;
  }

  // Always fetch the data
  const data = await fetcher();

  // Try to cache the result only if Redis seems healthy (non-blocking)
  if (isRedisHealthy) {
    // Don't await this to avoid slowing down the response
    Promise.race([
      redis.set(key, JSON.stringify(data), 'EX', ttlSeconds),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Redis SET timeout')), 1000)
      )
    ]).catch(setError => {
      console.warn(`Redis SET error for key "${key}"`, setError);
    });
  }

  return data;
}

export async function testCache() {
  if (!redis) {
    return "Redis not configured - operating without cache";
  }
  
  try {
    await redis.set("test-key", "Hello from Redis!", "EX", 60);
    const result = await redis.get("test-key");
    return result || "Redis connection successful but no data";
  } catch (err) {
    console.warn("Redis testCache error:", err);
    return "Redis connection failed - operating without cache";
  }
}

// Optional: Add a health check function
export async function isRedisHealthy(): Promise<boolean> {
  if (!redis) {
    return false;
  }
  
  try {
    await redis.ping();
    return true;
  } catch (err) {
    console.warn("Redis health check failed:", err);
    return false;
  }
}
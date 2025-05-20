import redis from './redis';

export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 3600
): Promise<T> {
  try {
    const cached = await redis.get(key);
    if (cached) {
      try {
        // console.log(`Getting data from cache [${key}]`);
        return JSON.parse(cached) as T;
      } catch (e) {
        console.warn(`Redis cache parse error for key "${key}"`, e);
        await redis.del(key); // Clean up broken cache
      }
    }
  } catch (err) {
    console.warn(`Redis GET/DEL error for key "${key}"`, err);
  }

  // Fallback to fetcher
  const data = await fetcher();

  // Try to set the new cache value
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
    // console.log(`Setting new cache [${key}]`);
  } catch (err) {
    console.warn(`Redis SET error for key "${key}"`, err);
  }

  return data;
}

export async function testCache() {
  try {
    await redis.set("test-key", "Hello from Redis!", "EX", 60);
    return await redis.get("test-key");
  } catch (err) {
    console.warn("Redis testCache error:", err);
    return null; // or a fallback value
  }
}
import Redis from 'ioredis';

// Validate Redis configuration
if (!process.env.REDIS_URL || !process.env.REDIS_PASSWORD) {
  console.warn('Redis configuration missing - cache will be disabled');
}

const redis = process.env.REDIS_URL && process.env.REDIS_PASSWORD 
  ? new Redis(
      `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}`,
      {
        connectTimeout: 2000,        // 2 second connection timeout
        lazyConnect: true,           // Don't connect until first command
        maxRetriesPerRequest: 1,     // Only retry once per command
        enableReadyCheck: false,     // Skip ready check for faster startup
        retryStrategy: (times) => {
          console.warn(`Redis retry attempt #${times} — stopping retries`);
          return null;
        },
      }
    )
  : null;


// Catch connection/authentication errors
redis?.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redis;
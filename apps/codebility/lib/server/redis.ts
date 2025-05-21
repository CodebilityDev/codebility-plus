import Redis from 'ioredis';

const redis = new Redis(
  `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}`,
  {
    retryStrategy: (times) => {
      // Stop retrying after the first failure
      console.warn(`Redis retry attempt #${times} — stopping retries`);
      return null;
    },
  }
);


// Catch connection/authentication errors
redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redis;
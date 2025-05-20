import Redis from 'ioredis';

const redis = new Redis(`redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_URL}`);


export default redis;
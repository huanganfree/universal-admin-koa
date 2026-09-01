import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST as string,
  port: parseInt(process.env.REDIS_PORT as string),
  // password: 'your_password',
});

redis.on('connect', () => {
  console.log('Redis 连接成功！');
});

redis.on('error', (err: any) => {
  console.error('Redis 连接出错:', err);
});

export { redis };

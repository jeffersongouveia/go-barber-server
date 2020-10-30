import { RedisOptions } from 'ioredis'

interface ICacheConfig {
  driver: 'redis',
  redis: RedisOptions,
}

const cacheConfig: ICacheConfig = {
  driver: 'redis',

  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD || undefined,
  },
}

export default cacheConfig


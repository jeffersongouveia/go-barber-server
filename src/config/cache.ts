import { RedisOptions } from 'ioredis'

interface ICacheConfig {
  driver: 'redis',
  redis: RedisOptions,
}

const cacheConfig: ICacheConfig = {
  driver: 'redis',

  redis: {
    host: 'localhost',
    port: 6379,
    password: undefined,
  },
}

export default cacheConfig


import Redis, { Redis as RedisClient } from 'ioredis'

import cacheConfig from '@config/cache'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient

  constructor() {
    this.client = new Redis(cacheConfig.redis)
  }

  public async recover(key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  public async save(key: string, value: string): Promise<void> {
    await this.client.set(key, value)
  }

  public async invalidate(key: string): Promise<void> {
    return Promise.resolve(undefined)
  }
}

export default RedisCacheProvider

import Redis, { Redis as RedisClient } from 'ioredis'

import cacheConfig from '@config/cache'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'

class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient

  constructor() {
    this.client = new Redis(cacheConfig.redis)
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key)
    if (!data) {
      return null
    }

    return JSON.parse(data)
  }

  public async save(key: string, value: string): Promise<void> {
    await this.client.set(key, JSON.stringify(value))
  }

  public async invalidate(key: string): Promise<void> {
    return Promise.resolve(undefined)
  }
}

export default RedisCacheProvider

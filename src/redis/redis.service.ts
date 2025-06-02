import { Injectable, OnModuleInit } from '@nestjs/common';
import { assert } from 'console';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis: Redis;
  onModuleInit() {
    this.redis = new Redis(process.env.REDIS_URL as string);

    this.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });

    this.redis.on('error', (err) => {
      console.log('Redis connection error', err);
    });
  }

  async set(key: string, value: any) {
    return await this.redis.set(key, JSON.stringify(value));
  }

  async get(key: string) {
    return await this.redis.get(key);
  }
}

import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private redis: Redis;
  onModuleInit() {
    this.redis = new Redis({
      port: Number(process.env.REDIS_PORT),
      host: process.env.REDIS_HOST,
    });

    this.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });

    this.redis.on('error', (err) => {
      console.log('Redis connection error');
    });
  }

  async set(key: string, value: any) {
    return await this.redis.set(key, JSON.stringify(value));
  }

  async get(key: string) {
    return await this.redis.get(key);
  }
}

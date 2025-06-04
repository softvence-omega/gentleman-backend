// redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    constructor(private config: ConfigService) { }

    onModuleInit() {
        this.client = new Redis(this.config.get('redis_connection_url') as string);
        this.client.on('connect', () => console.log('Redis connected'));
        this.client.on('error', (err) => console.error('Redis error', err));
    }

    getClient(): Redis {
        return this.client;
    }

    onModuleDestroy() {
        this.client.quit();
    }
}

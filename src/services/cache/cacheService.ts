import Redis from "ioredis";
import dotenv from "dotenv";
import { DEFAULT_CACHE_TTL } from "../../constants";
dotenv.config();

interface ICacheService {
    set(key: string, value: any, ttl: number): Promise<any>;
    get(key: string): Promise<any>;
    del(key: string): Promise<any>;
    mget(keys: string[]): Promise<any>;
}

export class RedisCacheService implements ICacheService {
    private cache: Redis;
    constructor() {
        const url = process.env.REDIS_URL || "redis://localhost:6379";
        this.cache = new Redis(url);
    }

    disconnect() {
        this.cache.disconnect();
    }

    async set(key: string, value: any, ttl: number = DEFAULT_CACHE_TTL): Promise<any> {
        return this.cache.setex(key, ttl, JSON.stringify(value));
    }
    async get(key: string): Promise<any> {
        try {
            const value = await this.cache.get(key);
            return value ? JSON.parse(value) : null;
        } catch (err) {
            throw err;
        }
    }
    async del(key: string): Promise<any> {
        return this.cache.del(key);
    }
    async mget(keys: string[]): Promise<any> {
        return this.cache.mget(keys);
    }
}

const cacheService = new RedisCacheService();

export default cacheService;

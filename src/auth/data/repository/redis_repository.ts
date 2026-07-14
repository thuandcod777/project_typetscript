import { RedisClientType } from "redis";
import { IRedisService } from "../../domain/services/iredis_service";

export class RedisRepository implements IRedisService {

    constructor(private redisClient: RedisClientType) { }


    private async ensureConnection(): Promise<void> {
        if (!this.redisClient.isOpen) {
            await this.redisClient.connect();
        }
    }

    private getKeyRefresh(id: string, token: string): string {
        return `auth_refresh:${id}:${token}`;
    }

    private getKeyAccess(id: string, token: string): string {
        return `auth_access:${id}:${token}`;
    }

    async saveRefreshToken(id: string, token: string, ttlSeconds: number): Promise<boolean> {
        const result = await this.redisClient.set(this.getKeyRefresh(id, token), id, { EX: ttlSeconds });
        return result === 'OK';
    }

    async saveAccessToken(id: string, token: string, ttlSeconds: number): Promise<boolean> {
        const result = await this.redisClient.set(this.getKeyAccess(id, token), id, { EX: ttlSeconds });
        return result === 'OK';
    }

    async getUserIdByRefreshToken(id: string, token: string): Promise<string | null> {
        /*   await this.ensureConnection(); */
        return await this.redisClient.get(this.getKeyRefresh(id, token));
    }

    async invalidDateRefreshToken(id: string, token: string): Promise<void> {
        await this.redisClient.del(this.getKeyRefresh(id, token));
    }

    async getUserIdByAccessToken(id: string, token: string): Promise<string | null> {
        return await this.redisClient.get(this.getKeyAccess(id, token));
    }

    async invalidDateAccessToken(id: string, token: string) {
        await this.redisClient.del(this.getKeyAccess(id, token));
    }

    async saveTokenFromGracePeriod(id: string, token: string, ttlSeconds: number): Promise<string> {
        const key = `grace:${token}`
        const result = await this.redisClient.set(key, id, { EX: ttlSeconds });
        return result ? result.toString() : '';;
    }

    // Kiểm tra xem token cũ có đang nằm trong thời gian ân hạn 
    async getNewTokenFromGracePeriod(oldtoken: string): Promise<string | null> {
        const key = `grace:${oldtoken}`;
        return this.redisClient.get(key);
    }

    // Đưa token cũ vào danh sách chờ với thời gian sống ngắn (30 giây)
    async enterGracePeriod(oldtoken: string, newtoken: string, ttlSeconds: number): Promise<void> {
        const key = `grace:${oldtoken}`;
        await this.redisClient.set(key, newtoken, { EX: ttlSeconds });
    }

    async getRemainingTTL(id: string, oldToken: string): Promise<number | null> {
        const key = this.getKeyRefresh(id, oldToken);
        const remainingTTL = await this.redisClient.ttl(key);

        if (remainingTTL <= 0) return null;

        console.log(`TTL còn lại của key ${key}:`, remainingTTL);
        return remainingTTL;
    }
}
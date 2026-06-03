import { RedisClientType } from "redis";
import { IRedisService } from "../../services/iredis_service";

export class RedisRepository implements IRedisService {

    constructor(private redisClient: RedisClientType) { }

    private getKey(token: string): string {
        return `auth:refresh_token:${token}`;
    }

    private async ensureConnection(): Promise<void> {
        if (!this.redisClient.isOpen) {
            await this.redisClient.connect();
        }
    }

    async saveRefreshToken(id: string, token: string, ttlSeconds: number): Promise<boolean> {
        /*  await this.ensureConnection(); */
        const result = await this.redisClient.set(this.getKey(token), id, { EX: ttlSeconds });
        return result === 'OK';
    }

    async getUserIdByRefreshToken(token: string): Promise<string | null> {
        /*   await this.ensureConnection(); */
        return await this.redisClient.get(this.getKey(token));
    }

    async invalidDateRefreshToken(token: string): Promise<void> {
        /*   await this.ensureConnection(); */
        await this.redisClient.del(this.getKey(token));
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

}
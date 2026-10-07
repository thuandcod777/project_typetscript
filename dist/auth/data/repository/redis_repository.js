"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisRepository = void 0;
class RedisRepository {
    redisClient;
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async ensureConnection() {
        if (!this.redisClient.isOpen) {
            await this.redisClient.connect();
        }
    }
    getKeyRefresh(id, token) {
        return `auth_refresh:${id}:${token}`;
    }
    getKeyAccess(id, token) {
        return `auth_access:${id}:${token}`;
    }
    async saveRefreshToken(id, token, ttlSeconds) {
        const result = await this.redisClient.set(this.getKeyRefresh(id, token), id, { EX: ttlSeconds });
        return result === 'OK';
    }
    async saveAccessToken(id, token, ttlSeconds) {
        const result = await this.redisClient.set(this.getKeyAccess(id, token), id, { EX: ttlSeconds });
        return result === 'OK';
    }
    async getUserIdByRefreshToken(id, token) {
        /*   await this.ensureConnection(); */
        return await this.redisClient.get(this.getKeyRefresh(id, token));
    }
    async invalidDateRefreshToken(id, token) {
        await this.redisClient.del(this.getKeyRefresh(id, token));
    }
    async getUserIdByAccessToken(id, token) {
        return await this.redisClient.get(this.getKeyAccess(id, token));
    }
    async invalidDateAccessToken(id, token) {
        await this.redisClient.del(this.getKeyAccess(id, token));
    }
    async saveTokenFromGracePeriod(id, token, ttlSeconds) {
        const key = `grace:${token}`;
        const result = await this.redisClient.set(key, id, { EX: ttlSeconds });
        return result ? result.toString() : '';
        ;
    }
    // Kiểm tra xem token cũ có đang nằm trong thời gian ân hạn 
    async getNewTokenFromGracePeriod(oldtoken) {
        const key = `grace:${oldtoken}`;
        return this.redisClient.get(key);
    }
    // Đưa token cũ vào danh sách chờ với thời gian sống ngắn (30 giây)
    async enterGracePeriod(oldtoken, newtoken, ttlSeconds) {
        const key = `grace:${oldtoken}`;
        await this.redisClient.set(key, newtoken, { EX: ttlSeconds });
    }
    async getRemainingTTL(id, oldToken) {
        const key = this.getKeyRefresh(id, oldToken);
        const remainingTTL = await this.redisClient.ttl(key);
        if (remainingTTL <= 0)
            return null;
        console.log(`TTL còn lại của key ${key}:`, remainingTTL);
        return remainingTTL;
    }
}
exports.RedisRepository = RedisRepository;

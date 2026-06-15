export interface IRedisService {
    saveRefreshToken(id: string, token: string, ttlSeconds: number): Promise<boolean>;
    getUserIdByRefreshToken(id: string, token: string): Promise<string | null>;
    invalidDateRefreshToken(id: string, token: string): Promise<void>;
    saveTokenFromGracePeriod(id: string, token: string, ttlSeconds: number): Promise<string>;
    getNewTokenFromGracePeriod(oldtoken: string): Promise<string | null>;
    enterGracePeriod(oldtoken: string, newtoken: string, ttlSeconds: number): Promise<void>;
}
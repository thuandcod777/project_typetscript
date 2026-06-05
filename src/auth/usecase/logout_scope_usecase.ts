import IAuthRepository from "../domain/iauth_repository";
import { IRedisService } from "../services/iredis_service";

export default class LogOutScopeUseCase {
    constructor(private authRepository: IAuthRepository, private redisTokenService: IRedisService) { }
    public async execute(email: string): Promise<boolean> {

        const userSession = await this.authRepository.signInScope(email);

        await this.redisTokenService.invalidDateRefreshToken(userSession.token);

        const isLogout = await this.authRepository.logOutScope(userSession.user.email);

        console.log(`[Logout] Tài khoản ${userSession.user.email} đã đăng xuất`);

        return isLogout;
    }
}
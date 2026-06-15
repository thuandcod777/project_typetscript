import IAuthRepository from "../domain/services/iauth_repository";
import { IRedisService } from "../domain/services/iredis_service";

export default class LogOutScopeUseCase {
    constructor(private authRepository: IAuthRepository, private redisTokenService: IRedisService) { }
    public async execute(email: string): Promise<boolean> {

        const userSession = await this.authRepository.signIn(email);


        const isLogout = await this.authRepository.logOut(userSession.email);

        await this.redisTokenService.invalidDateRefreshToken(userSession.id, userSession.session.token);

        console.log(`[Logout] Tài khoản ${userSession.email} đã đăng xuất`);

        return isLogout;
    }
}
import IAuthRepository from "../domain/iauth_repository";
import { AuthSessionModel } from "../domain/auth";
import IPasswordService from "../services/ipassword_service";
import { IRedisService } from "../services/iredis_service";

export default class SignUpUsecase {
    constructor(private authRepository: IAuthRepository, private redisService: IRedisService) { }

    public async execute(authData: AuthSessionModel): Promise<boolean> {

        const auth = await this.authRepository.register(authData);

        const daysToSeconds = 5 * 24 * 60 * 60;

        const isSaveRefreshToken = await this.redisService.saveRefreshToken(auth.id, auth.token, daysToSeconds);

        if (!isSaveRefreshToken) {
            throw new Error("Đăng ký thành công nhưng hệ thống lưu trữ token gặp sự cố.");
        }

        console.log(`[Redis] Lưu Refresh Token thành công cho User ID: ${auth.id}`);

        return true;
    }

}
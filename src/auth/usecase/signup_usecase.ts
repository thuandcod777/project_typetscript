import IAuthRepository from "../domain/services/iauth_repository";
import { IRedisService } from "../domain/services/iredis_service";
import { IUser } from "../data/model/auth_model";
import JwtTokenService from "../data/services/jwt_token_service";
import ITokenService from "../domain/services/itoken_service";
import { IRegisterInputDTO } from "../domain/dtos/register_input.dto";
import User from "../domain/entities/user.entity";


export default class SignUpUsecase {
    constructor(private authRepository: IAuthRepository, private tokenService: ITokenService, private redisService: IRedisService) { }

    public async execute(userData: IRegisterInputDTO): Promise<boolean> {

        const userEntity = new User({
            id: null,
            name: userData.name,
            email: userData.email,
            nameCompany: userData.nameCompany,
            numberPhone: userData.numberPhone,
            type: userData.type,
            role: userData.role,
            contract: null,
            session: null
        });

        const user = await this.authRepository.register(userEntity);

        if (!user || !user.id) {
            throw new Error("Đăng ký tài khoản thất bại.");
        }

        const token = this.tokenService.generateRefreshToken({ user_id: user.id });

        const daysToSeconds = 10 * 24 * 60 * 60;

        const isSaveRefreshToken = await this.redisService.saveRefreshToken(user.id, token.toString(), daysToSeconds);

        await this.authRepository.updateSession(user.id, token.toString(), false);

        if (!isSaveRefreshToken) {
            throw new Error("Hệ thống lưu trữ Token tạm thời (Redis) gặp sự cố.");
        }

        console.log(`[Redis] Lưu Refresh Token thành công cho User ID: ${user.id}`);

        return true;
    }

}
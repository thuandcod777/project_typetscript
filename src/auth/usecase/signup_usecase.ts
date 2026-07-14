import IAuthRepository from "../domain/services/iauth_repository";
import { IRedisService } from "../domain/services/iredis_service";
import { IUser } from "../data/model/auth_model";
import JwtTokenService from "../data/services/jwt_token_service";
import ITokenService from "../domain/services/itoken_service";
import { IRegisterInputDTO } from "../domain/dtos/register_input.dto";
import User from "../domain/entities/user.entity";
import { ResponseDto } from "../domain/entities/response.entity";


export default class SignUpUsecase {
    constructor(private authRepository: IAuthRepository, private tokenService: ITokenService, private redisService: IRedisService) { }

    public async execute(userData: IRegisterInputDTO): Promise<ResponseDto> {

        try {
            const userEntity = new User({
                id: null,
                name: userData.name,
                email: userData.email,
                name_company: userData.name_company,
                number_phone: userData.number_phone,
                type: userData.type,
                role: userData.role,
                session: null,
                otp: null,
                contract: null
            });

            const user = await this.authRepository.register(userEntity);

            if (!user || !user.id) {
                return ResponseDto.failure('Đăng ký tài khoản thất bại', 500);
            }

            switch (user.role) {

                case 'cooperative': {
                    const refreshToken = this.tokenService.generateRefreshToken({ auth_refresh: user.id });

                    const tendaysToSeconds = 10 * 24 * 60 * 60;
                    const expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

                    const isDbUpdated = await this.authRepository.updateSession(user.id, refreshToken.toString(), null, expiresAt, false, false);

                    if (!isDbUpdated) {
                        return ResponseDto.failure("Cập nhật thông tin phiên đăng ký nhà hợp tác thất bại.", 500);
                    }

                    const isSaveRefreshToken = await this.redisService.saveRefreshToken(user.id, refreshToken.toString(), tendaysToSeconds);

                    if (!isSaveRefreshToken) {
                        return ResponseDto.failure('Hệ thống lưu trữ Token tạm thời gặp sự cố', 500);
                    }

                    break;
                }

                case 'client': {
                    const accessToken = this.tokenService.generateAccessToken({ auth_access: user.id });
                    const fiveminuteToSeconds = 30 * 60;
                    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

                    const isDbUpdated = await this.authRepository.updateSession(user.id, null, accessToken.toString(), expiresAt, false, false);

                    if (!isDbUpdated) {
                        return ResponseDto.failure("Cập nhật thông tin phiên đăng ký khách hàng thất bại.", 500);
                    }

                    const isSaveAccessToken = await this.redisService.saveAccessToken(user.id, accessToken.toString(), fiveminuteToSeconds);

                    if (!isSaveAccessToken) {
                        return ResponseDto.failure('Hệ thống lưu trữ Token tạm thời gặp sự cố', 500);
                    }

                    break;
                }

                default:
                    return ResponseDto.failure(`Vai trò tài khoản không được hệ thống hỗ trợ.`, 400);
            }

            return ResponseDto.success('Đăng ký tài khoản thành công');
        } catch (error: any) {
            if (error.code === 11000 || error.message?.includes('E11000')) {
                return ResponseDto.failure('Email này đã được sử dụng trên hệ thống', 400);
            }

            return ResponseDto.failure('Đã xảy ra lỗi hệ thống: ' + error.message, 500);
        }
    }

}
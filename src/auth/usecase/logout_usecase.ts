import { ResponseDto } from "../domain/entities/response.entity";
import IAuthRepository from "../domain/services/iauth_repository";
import { IRedisService } from "../domain/services/iredis_service";

export default class LogOutUseCase {

    constructor(private authRepository: IAuthRepository, private redisTokenService: IRedisService) { }

    public async execute(email: string, statusLogin: string): Promise<ResponseDto> {
        try {
            const result = await this.authRepository.logOut(email, statusLogin);

            if (!result) {
                return ResponseDto.failure(`Không tìm thấy thông tin phiên đăng nhập hợp lệ.`, 500);
            }


            if (statusLogin === 'contract') {
                const tokenExists = await this.redisTokenService.getUserIdByRefreshToken(result.userId, result.token);

                if (tokenExists) {
                    await this.redisTokenService.invalidDateRefreshToken(result.userId, result.token);
                    return ResponseDto.success(`Tài khoản ${email} đã đăng xuất thành công`);

                } else {
                    return ResponseDto.failure(`Tài khoản ${email} đã đăng xuất`);

                }

            }

            if (statusLogin === 'booking') {
                const tokenExists = await this.redisTokenService.getUserIdByAccessToken(result.userId, result.token);

                if (tokenExists) {
                    await this.redisTokenService.invalidDateAccessToken(result.userId, result.token);
                    return ResponseDto.success(`Tài khoản ${email} đã đăng xuất thành công`);

                } else {
                    return ResponseDto.failure(`Tài khoản ${email} đã đăng xuất`);

                }
            }
            return ResponseDto.failure(`Phương thức đăng xuất không hợp lệ .`, 400);

        } catch (error) {
            return ResponseDto.failure(`Hệ thống đang bận, vui lòng thử lại sau.`, 500);
        }

    }
}
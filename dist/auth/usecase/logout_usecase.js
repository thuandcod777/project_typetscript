"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
class LogOutUseCase {
    authRepository;
    redisTokenService;
    constructor(authRepository, redisTokenService) {
        this.authRepository = authRepository;
        this.redisTokenService = redisTokenService;
    }
    async execute(email, statusLogin) {
        try {
            const result = await this.authRepository.logOut(email, statusLogin);
            if (!result) {
                return response_entity_1.ResponseDto.failure(`Không tìm thấy thông tin phiên đăng nhập hợp lệ.`, 500);
            }
            if (statusLogin === 'contract') {
                const tokenExists = await this.redisTokenService.getUserIdByRefreshToken(result.userId, result.token);
                if (tokenExists) {
                    await this.redisTokenService.invalidDateRefreshToken(result.userId, result.token);
                    return response_entity_1.ResponseDto.success(`Tài khoản ${email} đã đăng xuất thành công`);
                }
                else {
                    return response_entity_1.ResponseDto.failure(`Tài khoản ${email} đã đăng xuất`);
                }
            }
            if (statusLogin === 'booking') {
                const tokenExists = await this.redisTokenService.getUserIdByAccessToken(result.userId, result.token);
                if (tokenExists) {
                    await this.redisTokenService.invalidDateAccessToken(result.userId, result.token);
                    return response_entity_1.ResponseDto.success(`Tài khoản ${email} đã đăng xuất thành công`);
                }
                else {
                    return response_entity_1.ResponseDto.failure(`Tài khoản ${email} đã đăng xuất`);
                }
            }
            return response_entity_1.ResponseDto.failure(`Phương thức đăng xuất không hợp lệ .`, 400);
        }
        catch (error) {
            return response_entity_1.ResponseDto.failure(`Hệ thống đang bận, vui lòng thử lại sau.`, 500);
        }
    }
}
exports.default = LogOutUseCase;

import JwtTokenService from "../data/services/jwt_token_service";
import { AuthSessionModel } from "../domain/auth";
import IAuthRepository from "../domain/iauth_repository";
import { IRedisService } from "../services/iredis_service";
import ITokenService from "../services/itoken_service";

export default class SignInScopeUsecase {
    constructor(private authRepository: IAuthRepository, private redisTokenService: IRedisService, private tokenService: ITokenService) { }
    public async execute(email: string): Promise<boolean> {
        // Lấy phiên đăng nhập hiện tại từ DB
        const userSession = await this.authRepository.signInScope(email);

        if (!userSession) {
            throw new Error('Phiên đăng nhập không tồn tại trên hệ thống');
        }

        // Luu token grace period 
        const gracePeriodSeconds = 30;
        const tokenFromGrace = await this.redisTokenService.saveTokenFromGracePeriod(userSession.id, userSession.token, gracePeriodSeconds);

        // KIỂM TRA GRACE PERIOD TRƯỚC (Trường hợp Client thử lại do mất mạng)
        const activeNewTokenFromGrace = await this.redisTokenService.getNewTokenFromGracePeriod(tokenFromGrace)

        if (activeNewTokenFromGrace) {
            console.log(`[Grace Period Hit] Client gửi lại token cũ do mất mạng. Trả lại token mới đã sinh trước đó.`)
            return true;
        }

        // Tra cứu chủ sở hữu của Token Client gửi lên trong Redis
        let redisUserId = await this.redisTokenService.getUserIdByRefreshToken(userSession.token);

        // XỬ LÝ TỰ PHỤC HỒI KHI REDIS BỊ ĐẦY / EVACUATED (CACHE MISS DO MAXMEMORY)
        if (!redisUserId) {
            console.warn(`[Eviction Detected] Redis trống nhưng Mongoose vẫn còn token!`);
            console.log(`[Self-Healing] Tiến hành xác thực chữ ký để phục hồi phiên đăng nhập...`)

            // Kiểm tra tính toàn vẹn chữ ký JWT của mã lấy từ MongoDB
            const payload = this.tokenService.verifyRefreshToken(userSession.token);
            if (!payload || payload !== userSession.id) {
                throw new Error('Token trong DB không khớp chữ ký bảo mật hoặc đã hết hạn hoàn toàn');
            }

            // Token MongoDB hợp lệ -> Khôi phục ngược lại (Reconstruct) vào Redis
            console.log(`[Self-Healing] Token hợp lệ! Đang nạp ngược lại vào Redis...`);
            const daysToSeconds = 5 * 24 * 60 * 60;
            await this.redisTokenService.saveRefreshToken(userSession.id, userSession.token, daysToSeconds);

            // Gán lại kết quả đối soát thành công để đi tiếp luồng xử lý
            redisUserId = userSession.id;
        }

        // Xác thực chéo sau khi qua bộ lọc tự phục hồi
        if (redisUserId !== userSession.id) {
            throw new Error('Cảnh báo bảo mật: Token không trùng khớp chủ sở hữu giữa 2 hệ thống');
        }

        console.log(`=> [Success] Đồng bộ & Đối soát thành công cho tài khoản: ${userSession.user.email}`);

        // Cấp phát bộ đôi token mới dài hạn & ngắn hạn
        const newPayload = { id: userSession.id };
        const newRefreshToken = this.tokenService.generateRefreshToken(newPayload);

        const daysToSeconds = 5 * 24 * 60 * 60;

        // KÍCH HOẠT GRACE PERIOD CHO TOKEN CŨ
        await this.redisTokenService.enterGracePeriod(userSession.token, newRefreshToken.toString(), gracePeriodSeconds)

        // Token Rotation (Hủy bỏ mã token cũ tránh Replay Attack)
        await this.redisTokenService.invalidDateRefreshToken(userSession.token);

        await this.redisTokenService.saveRefreshToken(userSession.id, newRefreshToken.toString(), daysToSeconds);

        const isUpdated = await this.authRepository.updateActivceAndRefreshToken(userSession.id, newRefreshToken.toString(), true);

        return isUpdated;
    }
}
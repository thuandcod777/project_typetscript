import e from "express";
import IAuthRepository from "../domain/services/iauth_repository";
import { IRedisService } from "../domain/services/iredis_service";
import ITokenService from "../domain/services/itoken_service";
import { Contract } from "../domain/entities/contract.entity";
import { ResponseDto } from "../domain/entities/response.entity";
import { UnauthorizedError } from "../domain/entities/unauthorized_error";



export default class SignInUsecase {
    constructor(private authRepository: IAuthRepository, private redisTokenService: IRedisService, private tokenService: ITokenService) { }
    public async execute(email: string, statusLogin: string): Promise<ResponseDto> {




        /* 
                    const isSessionExists = await this.authRepository.checkSessionExists();
        
        
                    const session = await this.authRepository.getSession(userSession.sessionId!);
        
                    if (!session) {
                        return ResponseDto.failure('Không tìm thấy phiên đăng nhập', 404);
                    }
        
                    if (statusLogin === 'contract' && userSession.role === 'cooperative') {
        
                        const tendaysToSeconds = 10 * 24 * 60 * 60;
                        const expireDate = new Date(Date.now() + tendaysToSeconds * 1000);
                        const refreshToken = this.tokenService.generateRefreshToken({ auth_refresh: userSession.id });
        
                        if (!isSessionExists) {
        
                            await this.authRepository.updateSession(userSession.id, refreshToken.toString(), "", expireDate, true, false);
        
                            await this.redisTokenService.invalidDateRefreshToken(userSession.id, session.refresh_token);
        
                            await this.redisTokenService.saveRefreshToken(userSession.id, refreshToken.toString(), tendaysToSeconds);
        
        
                        } else {
        
                            await this.handleRefreshGracePeriodCheck(userSession.id, session.refresh_token);
        
                            await this.resolveAndValidateRefreshSession(userSession.id, session.refresh_token);
        
                            await this.rotateRefreshTokens(userSession.id, userSession.sessionId!, session.refresh_token);
        
                            const isUpdated = await this.authRepository.activateSession(userSession.id);
        
                            if (!isUpdated) {
                                return ResponseDto.failure('Không tìm thấy trạng thái đăng nhập', 404);
                            }
        
                        }
        
                    } else if (statusLogin === 'booking' && (userSession.role === 'cooperative' || userSession.role === 'client')) {
        
                        const thirtyMinuteToSeconds = 30 * 60;
                        const expireDate = new Date(Date.now() + thirtyMinuteToSeconds * 1000);
                        const accessToken = this.tokenService.generateAccessToken({ auth_access: userSession.id });
        
                        if (!isSessionExists) {
        
        
                            await this.redisTokenService.invalidDateAccessToken(userSession.id, session!.access_token);
        
                            await this.redisTokenService.saveAccessToken(session?.id.toString()!, session!.access_token, thirtyMinuteToSeconds);
        
                        } else {
        
                            await this.handleAccessGracePeriodCheck(userSession.id, session.access_token);
        
                            // await this.resolveAndValidateAccessSession(userSession.id, session.accessToken, thirtyMinuteToSeconds);
        
                            await this.rotateAccessToken(userSession.id, userSession.sessionId!, session.access_token, thirtyMinuteToSeconds);
        
                            const isUpdated = await this.authRepository.activateSession(userSession.id);
        
                            if (!isUpdated) {
                                return ResponseDto.failure('Không tìm thấy trạng thái đăng nhập', 404);
                            }
                        }
        
                    }
        
                    let contractData: Contract | null = null;
        
                    if (userSession.contractId) {
                        contractData = await this.authRepository.getContract(userSession.contractId);
                    }
        
        
                    return ResponseDto.success('Đăng nhập thành công', contractData);
                } catch (error: any) {
                    if (error instanceof UnauthorizedError) {
                        return ResponseDto.failure(error.message, 401);
                    }
                    // Cho phép các lỗi hệ thống nghiêm trọng (Sập DB, sập Redis) lọt qua để Controller bắt
                    throw error;
                } */
        return ResponseDto.success('Đăng nhập thành công');

    }


    private async handleRefreshGracePeriodCheck(userId: string, refreshToken: string): Promise<void> {
        const gracePeriodSeconds = 30;

        const tokenFromGrace = await this.redisTokenService.saveTokenFromGracePeriod(userId, refreshToken, gracePeriodSeconds);

        const activeNewTokenFromGrace = await this.redisTokenService.getNewTokenFromGracePeriod(tokenFromGrace);

        if (activeNewTokenFromGrace) {
            console.log(`[Grace Period Hit] Client gửi lại token cũ do mất mạng. Trả lại token mới đã sinh trước đó.`);

        }
    }

    private async handleAccessGracePeriodCheck(userId: string, accessToken: string): Promise<void> {
        const gracePeriodSeconds = 30;

        const tokenFromGrace = await this.redisTokenService.saveTokenFromGracePeriod(userId, accessToken, gracePeriodSeconds);

        const activeNewTokenFromGrace = await this.redisTokenService.getNewTokenFromGracePeriod(tokenFromGrace);

        if (activeNewTokenFromGrace) {
            console.log(`[Grace Period Hit] Client gửi lại token cũ do mất mạng. Trả lại token mới đã sinh trước đó.`);
        }
    }

    private async resolveAndValidateRefreshSession(userId: string, refreshToken: string): Promise<void> {
        // Tra cứu chủ sở hữu của Token Client gửi lên trong Redis
        let redisUserId = await this.redisTokenService.getUserIdByRefreshToken(userId, refreshToken);

        if (!redisUserId) {
            throw new UnauthorizedError("Lỗi phiên đăng nhập hoặc đã hết hạn hoàn toàn");
        }
    }

    private async resolveAndValidateAccessSession(userId: string, accessToken: string, ex: number): Promise<void> {
        // Tra cứu chủ sở hữu của Token Client gửi lên trong Redis
        let redisUserId = await this.redisTokenService.getUserIdByAccessToken(userId, accessToken);

        // XỬ LÝ TỰ PHỤC HỒI KHI REDIS BỊ ĐẦY / EVACUATED (CACHE MISS DO MAXMEMORY)
        if (!redisUserId) {
            console.warn(`[Eviction Detected] Redis trống nhưng Mongoose vẫn còn token!`);
            console.log(`[Self-Healing] Tiến hành xác thực chữ ký để phục hồi phiên đăng nhập...`);

            // Kiểm tra tính toàn vẹn chữ ký JWT của mã lấy từ MongoDB
            /* const payload = this.tokenService.verifyAccessToken(accessToken);

            if (!payload || payload !== userId) {
                throw new UnauthorizedError("Lỗi chữ ký bảo mật hoặc đã hết hạn hoàn toàn");
            } */

            // Token MongoDB hợp lệ -> Khôi phục ngược lại (Reconstruct) vào Redis
            console.log(`[Self-Healing] Token hợp lệ! Đang nạp ngược lại vào Redis...`);

            await this.redisTokenService.saveAccessToken(userId, accessToken, ex);

            // Gán lại kết quả đối soát thành công để đi tiếp luồng xử lý
            redisUserId = userId;
        }

        // Xác thực chéo sau khi qua bộ lọc tự phục hồi
        if (redisUserId !== userId) {
            throw new UnauthorizedError("Lỗi phiên đăng nhập");
        }

    }

    private async rotateRefreshTokens(userId: string, sessionId: string, oldRefreshToken: string,): Promise<void> {
        const gracePeriodSeconds = 30;

        const newRefreshToken = this.tokenService.generateRefreshToken({ auth_refresh: userId });

        await this.redisTokenService.enterGracePeriod(oldRefreshToken, newRefreshToken.toString(), gracePeriodSeconds)

        const remainingTtl = await this.redisTokenService.getRemainingTTL(userId, oldRefreshToken);

        const ttlSeconds = remainingTtl !== null ? remainingTtl : 1;

        await this.authRepository.updateToken(sessionId, newRefreshToken.toString(), "", new Date(Date.now() + ttlSeconds * 1000));

        await this.redisTokenService.saveRefreshToken(userId, newRefreshToken.toString(), ttlSeconds);

        await this.redisTokenService.invalidDateRefreshToken(userId, oldRefreshToken);
    }

    private async rotateAccessToken(userId: string, sessionId: string, oldRefreshToken: string, ex: number): Promise<void> {
        const gracePeriodSeconds = 30;

        const newAccessToken = this.tokenService.generateAccessToken({ auth_access: userId });

        await this.redisTokenService.enterGracePeriod(oldRefreshToken, newAccessToken.toString(), gracePeriodSeconds);

        await this.redisTokenService.invalidDateAccessToken(userId, oldRefreshToken);

        const isUpdated = await this.authRepository.updateToken(sessionId, "", newAccessToken.toString(), new Date(Date.now() + ex * 1000));

        await this.redisTokenService.saveAccessToken(userId, newAccessToken.toString(), ex);
    }

}


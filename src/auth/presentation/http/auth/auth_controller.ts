import { Request, Response } from 'express'
import { z } from 'zod';
import { IUserSessionInputDTO } from '../../../domain/dtos/register_input.dto';
import GetUserProfileUsecase from '../../../usecase/get_user_profile_usecase';

export const UserSessionSchema: z.ZodType<IUserSessionInputDTO> = z.object({
    token: z.string(),
    roles: z.string(),
}).strict();

export default class AuthController {
    private readonly getUserProfileUsecase: GetUserProfileUsecase;

    constructor(getUserProfileUsecase: GetUserProfileUsecase) {
        this.getUserProfileUsecase = getUserProfileUsecase
    }

    public async getUserProfile(req: Request, res: Response) {
        try {
            const safeUserSession = UserSessionSchema.parse(req.body);
            const result = await this.getUserProfileUsecase.execute(safeUserSession);

            return res.status(result.status).json({
                data: {
                    success: result.success, user: result.data ? result.data.user : null,
                    contract: result.data ? result.data.contract : null, message: result.message
                }
            });
        } catch (error: any) {
            return res.status(500).json({ error: "Lỗi hệ thống nghiêm trọng." });
        }
    }
}

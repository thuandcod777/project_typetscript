import { Request, Response } from 'express'
import SignUpUsecase from "../../../usecase/signup_usecase";
import SignInScopeUsecase from '../../../usecase/signin_usecase';
import LogOutScopeUseCase from '../../../usecase/logout_usecase';
import ITokenService from '../../../domain/services/itoken_service';
import { z } from 'zod';
import { IRegisterInputDTO } from '../../../domain/dtos/register_input.dto';
import LogOutUseCase from '../../../usecase/logout_usecase';
import SignInUsecase from '../../../usecase/signin_usecase';

export const UserModelSchema: z.ZodType<IRegisterInputDTO> = z.object({
    name: z.string(),
    email: z.string(),
    name_company: z.string(),
    number_phone: z.string(),
    type: z.string(),
    role: z.string()
}).strict();

export default class AuthController {
    private readonly signinUseCase: SignInUsecase;
    private readonly signupUseCase: SignUpUsecase;
    private readonly logoutUsecase: LogOutUseCase;
    private readonly tokenService: ITokenService;

    constructor(signinScopeUseCase: SignInUsecase, signupUseCase: SignUpUsecase, logoutUseCase: LogOutUseCase, tokenService: ITokenService) {
        this.signinUseCase = signinScopeUseCase
        this.signupUseCase = signupUseCase
        this.logoutUsecase = logoutUseCase
        this.tokenService = tokenService
    }

    public async signin(req: Request, res: Response) {
        try {
            const { email, statusLogin } = req.body;

            const result = await this.signinUseCase.execute(email, statusLogin);

            return res.status(result.status).json({
                data: {
                    success: result.success, message: result.message
                }
            });
        } catch (error: any) {
            return res.status(500).json({ error: "Lỗi hệ thống nghiêm trọng." });
        }
    }

    public async signup(req: Request, res: Response) {
        try {
            const safeAuthData = UserModelSchema.parse(req.body);

            const result = await this.signupUseCase.execute(safeAuthData);

            return res.status(result.status).json({
                data: {
                    success: result.success, message: result.message
                }
            });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error });
        }
    }

    public async logout(req: Request, res: Response) {
        try {
            const { email, statusLogin } = req.body;

            const result = await this.logoutUsecase.execute(email, statusLogin);

            return res.status(result.status).json({
                data: {
                    success: result.success, message: result.message
                }
            });
        } catch (error: any) {
            return res.status(400).json({ error: error.message || error });
        }
    }
}

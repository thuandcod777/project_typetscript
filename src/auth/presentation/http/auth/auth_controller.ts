import { Request, Response } from 'express'
import SignUpUsecase from "../../../usecase/signup_usecase";
import SignInScopeUsecase from '../../../usecase/signin_scope_usecase';
import LogOutScopeUseCase from '../../../usecase/logout_scope_usecase';
import ITokenService from '../../../domain/services/itoken_service';
import { z } from 'zod';
import { IRegisterInputDTO } from '../../../domain/dtos/register_input.dto';

export const UserModelSchema: z.ZodType<IRegisterInputDTO> = z.object({
    name: z.string(),
    email: z.string(),
    nameCompany: z.string(),
    numberPhone: z.string(),
    type: z.string(),
    role: z.string()
}).strict();

export default class AuthController {
    private readonly signinScopeUseCase: SignInScopeUsecase;
    private readonly signupUseCase: SignUpUsecase;
    private readonly logoutScopeUsecase: LogOutScopeUseCase;
    private readonly tokenService: ITokenService;

    constructor(signinScopeUseCase: SignInScopeUsecase, signupUseCase: SignUpUsecase, logoutScopeUseCase: LogOutScopeUseCase, tokenService: ITokenService) {
        this.signinScopeUseCase = signinScopeUseCase
        this.signupUseCase = signupUseCase
        this.logoutScopeUsecase = logoutScopeUseCase
        this.tokenService = tokenService
    }

    public async signinScope(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const isLogin = await this.signinScopeUseCase.execute(email);

            return res.status(200).json({ data: isLogin });

        } catch (error: any) {
            console.error("Controller Caught Error:", error);
            return res.status(400).json({ error: error.message || error });
        }
    }

    public async signup(req: Request, res: Response) {
        try {
            const safeAuthData = UserModelSchema.parse(req.body);

            const isSuccess = await this.signupUseCase.execute(safeAuthData);

            return res.status(200).json({ isSuccess: isSuccess, message: "Đăng ký thương hiệu thành công" });
        } catch (error: any) {
            console.error("Controller Caught Error:", error);
            return res.status(400).json({ error: error.message || error });
        }
    }

    public async logoutScope(req: Request, res: Response) {
        try {
            const { email } = req.body;
            const isLogout = await this.logoutScopeUsecase.execute(email);
            return res.status(200).json({ isLogout: isLogout });
        } catch (error: any) {
            console.error("Controller Caught Error:", error);
            return res.status(400).json({ error: error.message || error });
        }
    }

}
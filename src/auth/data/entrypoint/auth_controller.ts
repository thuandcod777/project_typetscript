import { Request, Response } from 'express'
import SignUpUsecase from "../../usecase/signup_usecase";
import ITokenService from "../../services/itoken_service";
import IAuthRepository from '../../domain/iauth_repository';
import { z } from 'zod';
import UserModel, { AuthSessionModel } from '../../domain/auth';
import SignInScopeUsecase from '../../usecase/signin_scope_usecase';


const AuthModelSchema = z.object({
    name: z.string(),
    email: z.string(),
    nameCompany: z.string(),
    numberPhone: z.number(),
    type: z.string()
}).strict();

type IAuthModel = z.infer<typeof AuthModelSchema>;

export default class AuthController {
    private readonly signinScopeUsecase: SignInScopeUsecase;
    private readonly signupUseCase: SignUpUsecase;
    private readonly tokenService: ITokenService;

    constructor(signinScopeUsecase: SignInScopeUsecase, signupUseCase: SignUpUsecase, tokenService: ITokenService) {
        this.signinScopeUsecase = signinScopeUsecase
        this.signupUseCase = signupUseCase
        this.tokenService = tokenService
    }

    public async signinScope(req: Request, res: Response) {
        try {
            const { emai } = req.body;

            const isLogin = await this.signinScopeUsecase.execute(emai);

            return res.status(200).json({ isLogin: isLogin });

        } catch (error: any) {
            console.error("Controller Caught Error:", error);
            return res.status(400).json({ error: error.message || error });
        }
    }

    public async signup(req: Request, res: Response) {
        try {
            const safeAuthData: IAuthModel = AuthModelSchema.parse(req.body);

            const userModelData = new UserModel({
                name: safeAuthData.name,
                email: safeAuthData.email,
                nameCompany: safeAuthData.nameCompany,
                numberPhone: safeAuthData.numberPhone,
                type: safeAuthData.type
            });

            // 2. Tính toán thời gian hết hạn (ví dụ: 5 ngày từ hiện tại)
            const daysToSeconds = 5 * 24 * 60 * 60;
            const expiresAtDate = new Date(Date.now() + daysToSeconds * 1000);

            const authModelData = new AuthSessionModel({
                token: this.tokenService.generateRefreshToken({ email: userModelData.email, type: userModelData.type }) as string,
                expiresAt: expiresAtDate,
                isActive: false,
                isBlocked: false,
                user: userModelData
            });


            const user = await this.signupUseCase.execute(authModelData);

            return res.status(200).json({ user: user, message: "User created successfully" });
        } catch (error: any) {
            console.error("Controller Caught Error:", error);
            return res.status(400).json({ error: error.message || error });
        }
    }

}
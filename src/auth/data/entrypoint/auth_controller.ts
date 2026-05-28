import { Request, Response } from 'express'
import SignUpUsecase from "../../usecase/signup_usecase";
import OrderUsecase from "../../usecase/order_usercase";
import ITokenService from "../../services/itoken_service";
import SignInUseCase from "../../usecase/signin_usecase";
import IAuthRepository from '../../domain/iauth_repository';

export default class AuthController {
    private readonly signinUseCase: SignInUseCase
    private readonly signupUseCase: SignUpUsecase
    private readonly tokenService: ITokenService

    constructor(signinUseCase: SignInUseCase, signupUseCase: SignUpUsecase, tokenService: ITokenService) {
        this.signinUseCase = signinUseCase
        this.signupUseCase = signupUseCase
        this.tokenService = tokenService

    }

    public async signin(req: Request, res: Response) {
        try {
            const { name, email, auth_type, password } = req.body
            return this.signinUseCase
                .execute(name, email, auth_type, password)
                .then((id: string) => res.status(200).json({ auth_token: this.tokenService.encode(id) }))
                .catch((err: Error) => res.status(404).json({ error: err.message }))
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    }

    public async signup(req: Request, res: Response) {
        /* try {
            const { email, name, auth_type, password } = req.body
            return this.signupUseCase
                .execute(email, name, auth_type, password)
                .then((id: string) => res.status(200).json({ auth_token: this.tokenService.encode(id) }))
                .catch((err: Error) => res.status(404).json({ error: err.message }))
        } catch (err) {
            return res.status(400).json({ error: err })
        } */
        try {
            const { email, name, auth_type, password } = req.body;
            const userId = await this.signupUseCase.execute(email, name, auth_type, password);

            // CRITICAL: If you miss this line, Express returns a 404!
            return res.status(201).json({ id: userId, message: "User created successfully" });
        } catch (error: any) {
            /*  return res.status(400).json({ error: error.message }); */
            console.error("🔴 Controller Caught Error:", error);
            return res.status(400).json({ error: error.message || error });
        }
    }



}
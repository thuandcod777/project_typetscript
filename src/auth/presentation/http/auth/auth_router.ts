import { Router, Request, Response } from "express";
import IAuthRepository from "../../../domain/services/iauth_repository";
import SignUpUsecase from "../../../usecase/signup_usecase";
import { signinValidatorRules, signupValidatorRules, validate } from "../../../data/helper/validator";
import AuthController from "./auth_controller";
import SignInScopeUsecase from "../../../usecase/signin_scope_usecase";
import JwtTokenService from "../../../data/services/jwt_token_service";
import LogOutScopeUseCase from "../../../usecase/logout_scope_usecase";
import { IRedisService } from "../../../domain/services/iredis_service";
import ITokenService from "../../../domain/services/itoken_service";



export default class AuthRouter {
    public static configure(authRepository: IAuthRepository,
        redisService: IRedisService,
        tokenService: ITokenService,
    ): Router {
        const router = Router();

        let controller = AuthRouter.composeController(
            authRepository,
            redisService,
            tokenService,
        );

        router.get("/", (req, res) => {
            res.send({
                message: "API IS WORKING!!"
            })
        });

        router.post('/signin', (req: Request, res: Response) => controller.signinScope(req, res));
        router.post('/signup', /* signupValidatorRules(), validate, */(req: Request, res: Response) => controller.signup(req, res));
        router.post('/logout', (req: Request, res: Response) => controller.logoutScope(req, res));

        return router;
    }


    private static composeController(authRepository: IAuthRepository,
        redisService: IRedisService,
        tokenService: ITokenService,
    ): AuthController {
        const signupUserCase = new SignUpUsecase(authRepository, tokenService, redisService)
        const signinScope = new SignInScopeUsecase(authRepository, redisService, tokenService);
        const logoutScope = new LogOutScopeUseCase(authRepository, redisService);
        const controller = new AuthController(signinScope, signupUserCase, logoutScope, tokenService)

        return controller
    }
}



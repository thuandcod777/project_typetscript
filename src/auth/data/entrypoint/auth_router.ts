import { Router, Request, Response } from "express";
import IAuthRepository from "../../domain/iauth_repository";
import IOrderRepository from "../../domain/iorder_repository";
import IPasswordService from "../../services/ipassword_service";
import ITokenService from "../../services/itoken_service";
import OrderUsecase from "../../usecase/order_usercase";
import SignInUseCase from "../../usecase/signin_usecase";
import SignUpUsecase from "../../usecase/signup_usecase";
import { signinValidatorRules, signupValidatorRules, validate } from "../helper/validator";
import AuthController from "./auth_controller";



export default class AuthRouter {
    public static configure(authRepository: IAuthRepository,
        tokenService: ITokenService,
        passwordService: IPasswordService, orderRepository: IOrderRepository): Router {
        const router = Router()

        let controller = AuthRouter.composeController(
            authRepository,
            tokenService,
            passwordService,
            orderRepository
        )

        router.post('/signin', signinValidatorRules(), validate, (req: Request, res: Response) => controller.signin(req, res))
        router.post('/signup', signupValidatorRules(), validate, (req: Request, res: Response) => controller.signup(req, res))
        router.post('/order', (req: Request, res: Response) => controller.saveorder(req, res))

        return router
    }


    private static composeController(authRepository: IAuthRepository,
        tokenService: ITokenService,
        passwordService: IPasswordService, orderRepository: IOrderRepository): AuthController {
        const signinUserCase = new SignInUseCase(authRepository, passwordService)
        const signupUserCase = new SignUpUsecase(authRepository, passwordService)
        const saveorderUserCase = new OrderUsecase(orderRepository)
        const controller = new AuthController(signinUserCase, signupUserCase, tokenService, saveorderUserCase)
        return controller
    }


}



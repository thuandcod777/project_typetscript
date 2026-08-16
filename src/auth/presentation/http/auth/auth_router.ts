import { Router, Request, Response } from "express";
import IAuthRepository from "../../../domain/services/iauth_repository";
import AuthController from "./auth_controller";
import SignInScopeUsecase from "../../../usecase/signin_usecase";
import LogOutScopeUseCase from "../../../usecase/logout_usecase";
import { IRedisService } from "../../../domain/services/iredis_service";
import ITokenService from "../../../domain/services/itoken_service";
import GetContractUsecase from "../../../usecase/get_contract_usecase";
import GetUserProfileUsecase from "../../../usecase/get_user_profile_usecase";
import IContractRepository from "../../../domain/services/icontract_repository";



export default class AuthRouter {
    public static configure(authRepository: IAuthRepository, contractRepository: IContractRepository): Router {
        const router = Router();

        let controller = AuthRouter.composeController(
            authRepository,
            contractRepository
        );

        /* router.get("/", (req, res) => {
            res.send({
                message: "API IS WORKING!!"
            })
        }); */

        router.post('/getuser', (req: Request, res: Response) => controller.getUserProfile(req, res));

        return router;
    }


    private static composeController(authRepository: IAuthRepository, contractRepository: IContractRepository): AuthController {
        const getContractUsecase = new GetUserProfileUsecase(authRepository, contractRepository);
        const controller = new AuthController(getContractUsecase);

        return controller
    }
}



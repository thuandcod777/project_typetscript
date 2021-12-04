import { Request, Response } from 'express'
import SignUpUsecase from "../../usecase/signup_usecase";
import OrderUsecase from "../../usecase/order_usercase";
import ITokenService from "../../services/itoken_service";
import SignInUseCase from "../../usecase/signin_usecase";

export default class AuthController {
    private readonly signinUseCase: SignInUseCase
    private readonly signupUseCase: SignUpUsecase
    private readonly tokenService: ITokenService
    private readonly orderUseCase: OrderUsecase


    constructor(signinUseCase: SignInUseCase, signupUseCase: SignUpUsecase, tokenService: ITokenService, orderUseCase: OrderUsecase) {
        this.signinUseCase = signinUseCase
        this.signupUseCase = signupUseCase
        this.tokenService = tokenService
        this.orderUseCase = orderUseCase

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
        try {
            const { email, name, auth_type, password } = req.body
            return this.signupUseCase
                .execute(email, name, auth_type, password)
                .then((id: string) => res.status(200).json({ auth_token: this.tokenService.encode(id) }))
                .catch((err: Error) => res.status(404).json({ error: err.message }))
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    }



    public async saveorder(req: Request, res: Response) {
        try {
            const { namePerson, nameProduct, numberProduct, orderDate } = req.body
            return this.orderUseCase
                .execute(namePerson, nameProduct, numberProduct, orderDate)
                .then((id: string) => res.status(200).json({ save: id, }))
                .catch((err: Error) => res.status(404).json({ error: err.message }))
        } catch (err) {
            return res.status(400).json({ error: err })
        }
    }
}
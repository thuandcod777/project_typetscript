import IGetuserRepository from "../../domain/igetuser_repository";
import { Router } from "express"
import UsersController from "./users_controller";


export default class UsersRouter {
    public static configure(
        repository: IGetuserRepository
    ): Router {
        const router = Router()
        let controller = new UsersController(repository)

        router.get(
            '/getuser',
            (req, res) => controller.getUsers(req, res)
        )


        return router
    }
}
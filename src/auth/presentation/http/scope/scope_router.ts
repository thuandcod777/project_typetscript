import ScopeController from "./scope_controller";
import ScopeUsecase from "../../../usecase/scope_usecase";
import { Router, Request, Response } from "express";
import IScopeRepository from "../../../domain/services/iscope_repository";

export default class ScopeRouter {
    public static configure(scopeRepository: IScopeRepository): Router {
        const router = Router();

        let controller = ScopeRouter.composeController(scopeRepository);

        router.post('/location', (req: Request, res: Response) => controller.saveScope(req, res));

        return router;
    }

    private static composeController(scopeRepository: IScopeRepository): ScopeController {
        const scopeUsecase = new ScopeUsecase(scopeRepository);
        const controller = new ScopeController(scopeUsecase);
        return controller;
    }
}
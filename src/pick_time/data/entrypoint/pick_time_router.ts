import { Router, type Request, type Response } from "express";
import type IPickTimeRepository from "../../domain/ipicktime_repository";
import PickTimeUsecase from "../../usecase/pick_time_use_case";
import type PickTimeRepository from "../repository/pick_time_repository";
import PickTimeController from "./pick_time_controller";
import UpdatePickTimeUsecase from "../../usecase/update_pick_time";

export default class PickTimeRouter {

    public static configure(picktimeRepository: IPickTimeRepository): Router {
        const router = Router();

        let controller = PickTimeRouter.composeController(picktimeRepository);

        router.get('/getpicktime', (req: Request, res: Response) => controller.get_pick_time(req, res));
        router.post('/updatepicktime', (req: Request, res: Response) => controller.update_pick_time(req, res));
        return router;
    }

    private static composeController(picktimeRepository: IPickTimeRepository): PickTimeController {
        const pickTimeUsecase = new PickTimeUsecase(picktimeRepository)
        const updatePickTimeUsecase = new UpdatePickTimeUsecase(picktimeRepository);
        const controller = new PickTimeController(pickTimeUsecase, updatePickTimeUsecase)
        return controller;
    }
}
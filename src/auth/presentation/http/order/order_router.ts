import { Router, Request, Response } from "express";
import IOrderRepository from "../../../domain/services/iorder_repository";
import OrderController from "./order_controller";
import OrderUsecase from "../../../usecase/order_usercase";
import FindOrderUsecase from "../../../usecase/find_order_usecase";
import VerifyOrderCodeUsecase from "../../../usecase/verify_order_code_usecase";
import IAuthRepository from "../../../domain/services/iauth_repository";

export default class OrderRouter {
    public static configure(authRepository: IAuthRepository, orderRepository: IOrderRepository): Router {
        const router = Router();

        let controller = OrderRouter.composeController(authRepository, orderRepository);

        router.post('/order', (req: Request, res: Response) => controller.saveOrder(req, res));
        router.post('/findorder', (req: Request, res: Response) => controller.findOrder(req, res));
        router.post('/verifyordercode', (req: Request, res: Response) => controller.verifyOrderCode(req, res));

        return router;
    }

    private static composeController(authRepository: IAuthRepository, orderRepository: IOrderRepository): OrderController {

        const orderUsecase = new OrderUsecase(authRepository, orderRepository);
        const findOrderUsecase = new FindOrderUsecase(orderRepository);
        const verifyOrderCodeUsecase = new VerifyOrderCodeUsecase(orderRepository);
        const controller = new OrderController(orderUsecase, findOrderUsecase, verifyOrderCodeUsecase);

        return controller;
    }


}
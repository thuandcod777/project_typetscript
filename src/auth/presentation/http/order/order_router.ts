import { Router, Request, Response } from "express";
import IOrderRepository from "../../../domain/services/iorder_repository";
import OrderController from "./order_controller";
import OrderUsecase from "../../../usecase/order_usercase";
import FindOrderUsecase from "../../../usecase/find_order_usecase";

export default class OrderRouter {
    public static configure(orderRepository: IOrderRepository): Router {
        const router = Router();

        let controller = OrderRouter.composeController(orderRepository);

        router.post('/order', (req: Request, res: Response) => controller.saveOrder(req, res));
        router.post('/findorder', (req: Request, res: Response) => controller.findOrder(req, res));

        return router;
    }

    private static composeController(orderRepository: IOrderRepository): OrderController {

        const orderUsecase = new OrderUsecase(orderRepository);
        const findOrderUsecase = new FindOrderUsecase(orderRepository);
        const controller = new OrderController(orderUsecase, findOrderUsecase);

        return controller;
    }
}
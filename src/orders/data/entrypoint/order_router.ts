import { Router, Request, Response } from "express";
import IOrderRepository from "../../domain/iorder_repository";
import OrderController from "./order_controller";
import OrderUsecase from "../../usecase/order_usercase";

export default class OrderRouter {
    public static configure(orderRepository: IOrderRepository): Router {
        const router = Router()

        let controller = OrderRouter.composeController(orderRepository)

        router.post('/order', (req: Request, res: Response) => controller.saveOrder(req, res))

        return router
    }

    private static composeController(orderRepository: IOrderRepository): OrderController {

        const orderUseCase = new OrderUsecase(orderRepository);

        const controller = new OrderController(orderUseCase);

        return controller
    }
}
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = __importDefault(require("./order_controller"));
const order_usercase_1 = __importDefault(require("../../../usecase/order_usercase"));
const find_order_usecase_1 = __importDefault(require("../../../usecase/find_order_usecase"));
const verify_order_code_usecase_1 = __importDefault(require("../../../usecase/verify_order_code_usecase"));
class OrderRouter {
    static configure(authRepository, orderRepository) {
        const router = (0, express_1.Router)();
        let controller = OrderRouter.composeController(authRepository, orderRepository);
        router.post('/order', (req, res) => controller.saveOrder(req, res));
        router.post('/findorder', (req, res) => controller.findOrder(req, res));
        router.post('/verifyordercode', (req, res) => controller.verifyOrderCode(req, res));
        return router;
    }
    static composeController(authRepository, orderRepository) {
        const orderUsecase = new order_usercase_1.default(authRepository, orderRepository);
        const findOrderUsecase = new find_order_usecase_1.default(orderRepository);
        const verifyOrderCodeUsecase = new verify_order_code_usecase_1.default(orderRepository);
        const controller = new order_controller_1.default(orderUsecase, findOrderUsecase, verifyOrderCodeUsecase);
        return controller;
    }
}
exports.default = OrderRouter;

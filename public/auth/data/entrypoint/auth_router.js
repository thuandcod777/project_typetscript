"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_usercase_1 = __importDefault(require("../../usecase/order_usercase"));
const signin_usecase_1 = __importDefault(require("../../usecase/signin_usecase"));
const signup_usecase_1 = __importDefault(require("../../usecase/signup_usecase"));
const validator_1 = require("../helper/validator");
const auth_controller_1 = __importDefault(require("./auth_controller"));
class AuthRouter {
    static configure(authRepository, tokenService, passwordService, orderRepository) {
        const router = (0, express_1.Router)();
        let controller = AuthRouter.composeController(authRepository, tokenService, passwordService, orderRepository);
        router.get("/", (req, res) => {
            res.send({
                message: "API IS WORKING!!"
            });
        });
        router.post('/signin', (0, validator_1.signinValidatorRules)(), validator_1.validate, (req, res) => controller.signin(req, res));
        router.post('/signup', (0, validator_1.signupValidatorRules)(), validator_1.validate, (req, res) => controller.signup(req, res));
        router.post('/order', (req, res) => controller.saveorder(req, res));
        return router;
    }
    static composeController(authRepository, tokenService, passwordService, orderRepository) {
        const signinUserCase = new signin_usecase_1.default(authRepository, passwordService);
        const signupUserCase = new signup_usecase_1.default(authRepository, passwordService);
        const saveorderUserCase = new order_usercase_1.default(orderRepository);
        const controller = new auth_controller_1.default(signinUserCase, signupUserCase, tokenService, saveorderUserCase);
        return controller;
    }
}
exports.default = AuthRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./auth_controller"));
const get_user_profile_usecase_1 = __importDefault(require("../../../usecase/get_user_profile_usecase"));
class AuthRouter {
    static configure(authRepository, contractRepository) {
        const router = (0, express_1.Router)();
        let controller = AuthRouter.composeController(authRepository, contractRepository);
        /* router.get("/", (req, res) => {
            res.send({
                message: "API IS WORKING!!"
            })
        }); */
        router.post('/getuser', (req, res) => controller.getUserProfile(req, res));
        return router;
    }
    static composeController(authRepository, contractRepository) {
        const getContractUsecase = new get_user_profile_usecase_1.default(authRepository, contractRepository);
        const controller = new auth_controller_1.default(getContractUsecase);
        return controller;
    }
}
exports.default = AuthRouter;

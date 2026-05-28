"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = __importDefault(require("./users_controller"));
class UsersRouter {
    static configure(repository) {
        const router = (0, express_1.Router)();
        let controller = new users_controller_1.default(repository);
        router.get('/getuser', (req, res) => controller.getUsers(req, res));
        return router;
    }
}
exports.default = UsersRouter;

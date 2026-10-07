"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scope_controller_1 = __importDefault(require("./scope_controller"));
const scope_usecase_1 = __importDefault(require("../../../usecase/scope_usecase"));
const express_1 = require("express");
class ScopeRouter {
    static configure(scopeRepository) {
        const router = (0, express_1.Router)();
        let controller = ScopeRouter.composeController(scopeRepository);
        router.post('/location', (req, res) => controller.saveScope(req, res));
        return router;
    }
    static composeController(scopeRepository) {
        const scopeUsecase = new scope_usecase_1.default(scopeRepository);
        const controller = new scope_controller_1.default(scopeUsecase);
        return controller;
    }
}
exports.default = ScopeRouter;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pick_time_use_case_1 = __importDefault(require("../../../usecase/pick_time_use_case"));
const pick_time_controller_1 = __importDefault(require("./pick_time_controller"));
const update_pick_time_1 = __importDefault(require("../../../usecase/update_pick_time"));
class PickTimeRouter {
    static configure(picktimeRepository) {
        const router = (0, express_1.Router)();
        let controller = PickTimeRouter.composeController(picktimeRepository);
        router.get('/getpicktime', (req, res) => controller.get_pick_time(req, res));
        router.post('/createpicktime', (req, res) => controller.update_pick_time(req, res));
        return router;
    }
    static composeController(picktimeRepository) {
        const pickTimeUsecase = new pick_time_use_case_1.default(picktimeRepository);
        const updatePickTimeUsecase = new update_pick_time_1.default(picktimeRepository);
        const controller = new pick_time_controller_1.default(pickTimeUsecase, updatePickTimeUsecase);
        return controller;
    }
}
exports.default = PickTimeRouter;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const PickTimeSchema = zod_1.z.object({
    order_code: zod_1.z.string(),
    name_sender: zod_1.z.string(),
    number_phone: zod_1.z.string(),
    license: zod_1.z.string(),
    pick_time: zod_1.z.string(),
    status_pick_time: zod_1.z.string()
}).strict();
class PickTimeController {
    pickTimeUsecase;
    updatePickTimeUsecase;
    constructor(pickTimeUsecase, updatePickTimeUsecase) {
        this.pickTimeUsecase = pickTimeUsecase;
        this.updatePickTimeUsecase = updatePickTimeUsecase;
    }
    async get_pick_time(req, res) {
        const result = await this.pickTimeUsecase.execute();
        return res.status(result.status).json({ data: { picktime: result.data, success: result.success, message: result.message } });
    }
    async update_pick_time(req, res) {
        const safePickTimeData = PickTimeSchema.parse(req.body);
        const result = await this.updatePickTimeUsecase.execute(safePickTimeData);
        return res.status(result.status).json({ data: { success: result.success, message: result.message } });
    }
}
exports.default = PickTimeController;

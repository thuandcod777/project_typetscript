import { type Request, type Response } from "express";
import UpdatePickTimeUsecase from "../../../usecase/update_pick_time.js";
import PickTimeUsecase from "../../../usecase/pick_time_use_case.js";
import { z } from "zod";
import { IPickTimeInputDTO } from "../../../domain/dtos/pick-time.dto.js";

const PickTimeSchema: z.ZodType<IPickTimeInputDTO> = z.object({
    order_code: z.string(),
    name_sender: z.string(),
    number_phone: z.string(),
    license: z.string(),
    pick_time: z.string(),
    status_pick_time: z.string()
}).strict();

export default class PickTimeController {
    private readonly pickTimeUsecase: PickTimeUsecase;
    private readonly updatePickTimeUsecase: UpdatePickTimeUsecase;

    constructor(pickTimeUsecase: PickTimeUsecase, updatePickTimeUsecase: UpdatePickTimeUsecase) {
        this.pickTimeUsecase = pickTimeUsecase;
        this.updatePickTimeUsecase = updatePickTimeUsecase;
    }

    public async get_pick_time(req: Request, res: Response) {
        const result = await this.pickTimeUsecase.execute();
        return res.status(result.status).json({ data: { picktime: result.data, success: result.success, message: result.message } });
    }

    public async update_pick_time(req: Request, res: Response) {
        const safePickTimeData = PickTimeSchema.parse(req.body);
        const result = await this.updatePickTimeUsecase.execute(safePickTimeData);
        return res.status(result.status).json({ data: { success: result.success, message: result.message } });
    }
}
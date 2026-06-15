import { type Request, type Response } from "express";
import UpdatePickTimeUsecase from "../../../usecase/update_pick_time.js";
import PickTimeUsecase from "../../../usecase/pick_time_use_case.js";

export default class PickTimeController {
    private readonly pickTimeUsecase: PickTimeUsecase;
    private readonly updatePickTimeUsecase: UpdatePickTimeUsecase;

    constructor(pickTimeUsecase: PickTimeUsecase, updatePickTimeUsecase: UpdatePickTimeUsecase) {
        this.pickTimeUsecase = pickTimeUsecase;
        this.updatePickTimeUsecase = updatePickTimeUsecase;
    }

    public async get_pick_time(req: Request, res: Response) {
        await this.pickTimeUsecase.execute();
        return res.status(200).json({ data: { isSuccess: true, status: "Lấy danh sách đặt lịch trong ngày hôm thành công" } });
    }

    public async update_pick_time(req: Request, res: Response) {
        const { orderCode, pick_time, status_pick_time } = req.body;
        const isSuccess = await this.updatePickTimeUsecase.execute(orderCode, pick_time, status_pick_time);
        return res.status(200).json({ data: { isSuccess: isSuccess, status: "Cập nhật trạng thái gửi đơn hàng thành công" } });
    }
}
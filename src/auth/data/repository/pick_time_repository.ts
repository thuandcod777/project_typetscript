import type IPickTimeRepository from "../../domain/services/ipicktime_repository";
import type { Mongoose } from "mongoose";
import { IOrder, OrderSchema } from "../model/order_model";
import { IListPickTime, } from "../../domain/entities/pick-time.entity";
import { IPickTimeInputDTO } from "../../domain/dtos/pick-time.dto";

export default class PickTimeRepository implements IPickTimeRepository {

    constructor(private readonly client: Mongoose) { }

    public async get_pick_time(): Promise<{ success: boolean, message: string, data: IListPickTime }> {
        const orderModel = this.client.model<IOrder>('Order', OrderSchema);
        const startOfToDay = new Date();
        startOfToDay.setHours(0, 0, 0, 0);

        const endOfToDay = new Date();
        endOfToDay.setHours(23, 59, 59, 999);

        const dataPickTime = await orderModel.find({
            "status_pick_time.createdAt": {
                $gte: startOfToDay,
                $lte: endOfToDay
            }
        }).select('status_pick_time.pick_time').lean<IListPickTime>();

        console.log(`Data Pick Time ${dataPickTime}`);

        if (!dataPickTime || dataPickTime.length === 0) {
            return { success: false, message: "Không tìm thấy danh sách lịch hẹn trong ngày", data: [] };
        }

        return { success: true, message: "Lấy danh sách đặt lịch thành công", data: dataPickTime };
    }

    public async update_status_pick_time(pickTimeData: IPickTimeInputDTO): Promise<{ success: boolean, message: string }> {
        const orderModel = this.client.model<IOrder>('Order', OrderSchema);

        try {

            const order = await orderModel.findOne({ order_code: pickTimeData.order_code });

            if (!order) {
                return { success: false, message: 'Đơn hàng không tồn tại.' };
            }
            const pick_time = order.status_schedule;

            if (pick_time) {
                return { success: false, message: 'Đơn hàng đã tồn tại lịch hẹn vận chuyển.' };
            }

            const result = await orderModel.findOneAndUpdate({ order_code: pickTimeData.order_code }, {
                $set: {
                    status_schedule: {
                        name_sender: pickTimeData.name_sender,
                        number_phone: pickTimeData.number_phone,
                        license: pickTimeData.license,
                        pick_time: pickTimeData.pick_time,
                        status_pick_time: pickTimeData.status_pick_time
                    }
                }
            }, { new: true });

            if (!result) {
                return {
                    success: false, message: `Không tìm thấy đơn hàng với mã: ${pickTimeData.order_code}`
                };
            }

            return { success: true, message: `Đăng ký lịch hẹn gửi hàng thành công với mã: ${pickTimeData.order_code}` };

        } catch (error) {
            return { success: false, message: `Lỗi` };
        }
    }

}
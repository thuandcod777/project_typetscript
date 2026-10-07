"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = require("../model/order_model");
class PickTimeRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async get_pick_time() {
        const orderModel = this.client.model('Order', order_model_1.OrderSchema);
        const startOfToDay = new Date();
        startOfToDay.setHours(0, 0, 0, 0);
        const endOfToDay = new Date();
        endOfToDay.setHours(23, 59, 59, 999);
        const dataPickTime = await orderModel.find({
            "status_schedule.createdAt": {
                $gte: startOfToDay,
                $lte: endOfToDay
            }
        }).select('status_schedule.pick_time').lean();
        return { success: true, data: dataPickTime || [], message: "Lấy danh sách đặt lịch thành công", };
    }
    async update_status_pick_time(pickTimeData) {
        const orderModel = this.client.model('Order', order_model_1.OrderSchema);
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
        }
        catch (error) {
            return { success: false, message: `Lỗi` };
        }
    }
}
exports.default = PickTimeRepository;

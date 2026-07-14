import type IPickTimeRepository from "../../domain/services/ipicktime_repository";
import type { Mongoose } from "mongoose";
import { PickTimeSchema, type IPickTime } from "../model/pick_time_model";
import { IOrder, OrderSchema } from "../model/order_model";
import { IGroupPickTime, IPickTimeJSON, PickTime } from "../../domain/entities/pick-time.entity";
import { IPickTimeInputDTO } from "../../domain/dtos/pick-time.dto";

export default class PickTimeRepository implements IPickTimeRepository {

    constructor(private readonly client: Mongoose) { }

    public async get_pick_time(): Promise<IGroupPickTime | []> {


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
        }).select('status_pick_time.pick_time');

        if (!dataPickTime || dataPickTime.length === 0) {
            return [];
        }

        const defaultTimes = [
            '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
            '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
            '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
            '12:00 PM', '12:30 PM', '13:00 PM', '13:30 PM',
            '14:00 PM', '14:30 PM', '15:00 PM', '15:30 PM',
            '16:00 PM', '16:30 PM', '17:00 PM', '17:30 PM'
        ];


        // const groupData = dataPickTime.reduce((acc: IGroupPickTime, current: any) => {
        //     const timeKey = "15:30 PM";
        //     if (!acc[timeKey]) {
        //         acc[timeKey] = {
        //             count: 0,
        //             items: []
        //         }
        //     }

        //     console.log(acc);

        //     if (acc[timeKey].items.length < 5) {
        //         acc[timeKey].count += 1;
        //         acc[timeKey].items.push(PickTimeModel.fromJson(current));
        //     }


        //     return acc;

        // }, {});

        const groupData: IGroupPickTime = {};

        defaultTimes.forEach(time => {
            groupData[time] = {
                count: 0,
                items: []
            }
        });

        dataPickTime.forEach((current: any) => {
            const dbTime = current.status_pick_time?.pick_time;
            if (groupData[dbTime]) {
                // Giới hạn tối đa 5 items cho mỗi khung giờ theo logic trước đó của bạn
                if (groupData[dbTime].items.length < 5) {
                    groupData[dbTime].count += 1;
                    groupData[dbTime].items.push(PickTime.fromJson(current));
                }
            }
        });

        console.log(groupData);

        return groupData;
    }

    public async update_status_pick_time(pickTimeData: IPickTimeInputDTO): Promise<boolean> {
        const orderModel = this.client.model<IOrder>('Order', OrderSchema);

        try {
            const result = await orderModel.findOneAndUpdate({ order_code: pickTimeData.order_code }, {
                $set: {
                    status_pick_time: {
                        pick_time: pickTimeData.pick_time,
                        statusPickTime: pickTimeData.status_pick_time
                    }
                }
            }, { new: true });

            if (!result) {
                console.warn(`[DB Warn] Không tìm thấy đơn hàng với mã: ${pickTimeData.order_code}`);
                return false;
            }

            return true;

        } catch (error) {
            console.error(`[DB Error] Lỗi cập nhật session:`, error);
            return false;
        }
    }

}
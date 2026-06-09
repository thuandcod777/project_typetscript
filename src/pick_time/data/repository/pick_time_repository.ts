import type IPickTimeRepository from "../../domain/ipicktime_repository";
import { PickTimeModel, type IGroupPickTime } from "../../domain/pick_time";
import type { Mongoose } from "mongoose";
import { PickTimeSchema, type IPickTime } from "../model/pick_time_model";
import { IOrder, OrderSchema } from "../../../orders/data/models/order_model";

export default class PickTimeRepository implements IPickTimeRepository {

    constructor(private readonly client: Mongoose) { }



    public async get_pick_time(): Promise<IGroupPickTime | []> {

        const doc = this.client.model<IPickTime>('PickTime', PickTimeSchema);

        const startOfToDay = new Date();
        startOfToDay.setHours(0, 0, 0, 0);

        const endOfToDay = new Date();
        endOfToDay.setHours(23, 59, 59, 999);

        const dataPickTime = await doc.find({
            createdAt: {
                $gte: startOfToDay,
                $lte: endOfToDay
            }
        }).lean();

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
            const dbTime = current.pick_time;
            if (groupData[dbTime]) {
                // Giới hạn tối đa 5 items cho mỗi khung giờ theo logic trước đó của bạn
                if (groupData[dbTime].items.length < 5) {
                    groupData[dbTime].count += 1;
                    groupData[dbTime].items.push(PickTimeModel.fromJson(current));
                }
            }
        });

        return groupData;
    }

    public async update_status_pick_time(orderCode: string, statusPickTime: boolean): Promise<boolean> {
        const doc = this.client.model<IOrder>('Order', OrderSchema);

        const isUpdated = await doc.updateOne({ orderCode: orderCode }, { $set: { statusPickTime: statusPickTime } });

        return isUpdated.matchedCount > 0;
    }

    public async save_pick_time(orderCode: string, pick_time: string, status_pick_time: string): Promise<boolean> {
        const doc = this.client.model<IPickTime>('PickTime', PickTimeSchema);

        const isUpdated = await doc.create({ orderCode: orderCode, pick_time: pick_time, status_pick_time: status_pick_time });

        return !!isUpdated;

    }

}
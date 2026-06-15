import type IPickTimeRepository from "../../domain/services/ipicktime_repository";
import type { Mongoose } from "mongoose";
import { PickTimeSchema, type IPickTime } from "../model/pick_time_model";
import { IOrder, OrderSchema } from "../model/order_model";
import { IGroupPickTime, PickTime } from "../../domain/entities/pick_time.entity";

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
                    groupData[dbTime].items.push(PickTime.fromJson(current));
                }
            }
        });

        return groupData;
    }

    public async update_status_pick_time(orderCode: string, pickTime: string, statusPickTime: string): Promise<boolean> {
        const orderModel = this.client.model<IOrder>('Order', OrderSchema);

        const pickTimeModel = this.client.model<IPickTime>('PickTime', PickTimeSchema);


        const order = await orderModel.findOne({ orderCode: orderCode });

        if (!order) {
            console.error(`=> [DB Error] Không tìm thấy đơn hàng với mã: ${orderCode}`);
            return false;
        }

        const dbSession = await this.client.startSession();
        dbSession.startTransaction();

        const pickTimeId = order?.statusPickTime;
        const validPickTime = pickTime || new Date().toISOString();
        if (!pickTimeId) {
            const sessionData = await pickTimeModel.create([{ pickTime: validPickTime, statusPickTime: statusPickTime }], { session: dbSession });

            order.statusPickTime = sessionData[0]._id as any;
        }

        await order.save({ session: dbSession });

        await dbSession.commitTransaction();
        console.log(`=> [DB Success] Đã tạo mới Session cho User ID: ${order}`);
        return true;


    }



}
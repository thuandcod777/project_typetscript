import { Mongoose } from "mongoose";
import IOrderRepository from "../../domain/iorder_repository";
import OrderModel from "../../domain/order";
import { IOrder, OrderSchema } from "../models/order_model";
/**
 * Lưu đơn hàng mới và trả về danh sách toàn bộ đơn hàng hiện có dưới dạng Class OrderModel[]
 * @param orderData Dữ liệu đơn hàng mới cần lưu
 */
export default class OrderRepository implements IOrderRepository {
    constructor(private readonly client: Mongoose) { }

    public async saveOrder(orderData: OrderModel /* Partial<IOrder> */): Promise<OrderModel> {
        // 1. Khởi tạo Mongoose Model từ Schema
        const doc = this.client.model<IOrder>('Order', OrderSchema);
        // 2. Lưu đơn hàng mới vào cơ sở dữ liệu
        const saveOrder = await doc.create(orderData);
        // 3. Chuyển sang JSON thuần (thay thế cho .lean() của find)
        const rawOrder = saveOrder.toObject();
        // 4 & 5 Trả về một Entity duy nhất
        return OrderModel.fromJson(rawOrder);
    }


    public async findOrder(orderCode: string): Promise<boolean> {
        const doc = this.client.model<IOrder>('Order', OrderSchema);
        const isSuccess = await doc.findOne({ orderCode: orderCode });
        console.log("find data", isSuccess?.toObject());
        return true;
    }
}
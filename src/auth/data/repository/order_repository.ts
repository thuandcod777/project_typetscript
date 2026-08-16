import { type ClientSession, Mongoose } from "mongoose";
import IOrderRepository from "../../domain/services/iorder_repository";
import { IOrderJSON } from "../../domain/entities/order.entity";
import { IOrderInputDTO } from "../../domain/dtos/order_input.dto";
import { IOrder, OrderSchema } from "../model/order_model";
import Order from "../../domain/entities/order.entity";

export default class OrderRepository implements IOrderRepository {
    constructor(private readonly client: Mongoose) { }

    public async saveOrder(userId: string, orderData: IOrderInputDTO, session?: ClientSession): Promise<{ success: boolean, message: string }> {

        const orderModel = this.client.model<IOrder>('Order', OrderSchema);

        const orderQuery = new orderModel({
            user_id: userId,
            order_code: orderData.order_code,
            status_delivery: orderData.status_delivery,
            status_pick_time: null,
            product: orderData.product,
            address_take_goods: orderData.address_take_goods,
            address_delivery: orderData.address_delivery,
            payment: orderData.payment,
        });

        await orderQuery.save({ session: session ? session : null });

        if (!orderQuery) {
            return { success: false, message: "Đăng ký đơn hàng không thành công." };

        }
        return { success: true, message: "Đăng ký đơn hàng thành công." };
    }

    public async findOrder(orderData: string): Promise<Order> {
        const orderModel = this.client.model<IOrder>('Order', OrderSchema);

        const order = await orderModel.findOne({ order_code: orderData }).lean();

        if (!order) {
            throw new Error(`Không tìm thấy đơn hàng với mã: ${orderData}`);
        }

        const orderJson: IOrderJSON = {
            user_id: order.user_id.toString() ?? null, // Chuyển ObjectId sang string
            order_code: order.order_code,
            status_delivery: order.status_delivery,
            status_pick_time: order.status_schedule,
            product: {
                name_product: order.product!.name_product,
                type_product: order.product!.type_product,
                amount: order.product!.amount,
                width: order.product!.width,
                height: order.product!.height,
                weight: order.product!.weight,
                length: order.product!.length,
            },
            address_take_goods: {
                method: order.address_take_goods!.method,
                address: order.address_take_goods!.address,
                scope: order.address_take_goods!.scope,
            },
            address_delivery: {
                method: order.address_delivery!.method,
                address: order.address_delivery!.address,
                scope: order.address_delivery!.scope,
            },
            payment: {
                type_payment: order.payment!.type_payment,
                step_payment: order.payment!.step_payment,
            },
        };

        return Order.fromJson(orderJson);

    }

    public async verifyOrderCode(orderCode: string): Promise<{ success: boolean, message: string }> {
        const orderModel = this.client.model<IOrder>('Order', OrderSchema);
        const order = await orderModel.findOne({ order_code: orderCode }).lean();

        if (!order) {
            return { success: false, message: 'Đơn hàng không tồn tại.' };
        }

        return { success: true, message: 'Xác thực mã đơn hàng thành công.' };
    }
}
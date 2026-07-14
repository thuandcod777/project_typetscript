import { Mongoose } from "mongoose";
import IOrderRepository from "../../domain/services/iorder_repository";
import OrderModel, { IOrderJSON } from "../../domain/entities/order.entity";
import { IUser, UserSchema } from "../model/auth_model";
import { IOrderInputDTO } from "../../domain/dtos/order_input.dto";
import { IOrder, OrderSchema } from "../model/order_model";
import Order from "../../domain/entities/order.entity";

export default class OrderRepository implements IOrderRepository {
    constructor(private readonly client: Mongoose) { }

    public async saveOrder(orderData: IOrderInputDTO): Promise<Order> {

        const userModel = this.client.model<IUser>('User', UserSchema);

        const orderModel = this.client.model<IOrder>('Order', OrderSchema);

        const user = await userModel.findOne({ email: orderData.email });

        if (!user) {
            throw new Error('User not found');
        }

        const saveOrder = await orderModel.create({
            user_id: user._id,
            order_code: orderData.order_code,
            status_delivery: orderData.status_delivery,
            status_pick_time: null,
            product: orderData.product,
            address_take_goods: orderData.address_take_goods,
            address_delivery: orderData.address_delivery,
            payment: orderData.payment,
        });

        const rawOrder = saveOrder.toObject();

        const orderJson: IOrderJSON = {
            user_id: rawOrder.user_id.toString(), // Đảm bảo chuyển ObjectId thành string
            order_code: rawOrder.order_code,
            status_delivery: rawOrder.status_delivery,
            status_pick_time: rawOrder.status_pick_time,
            product: rawOrder.product,
            address_take_goods: rawOrder.address_take_goods,
            address_delivery: rawOrder.address_delivery,
            payment: rawOrder.payment,
        };

        return Order.fromJson(orderJson);
    }


    public async findOrder(orderData: string): Promise<Order> {
        const orderModel = this.client.model<IOrder>('Order', OrderSchema);

        const order = await orderModel.findOne({ orderCode: orderData }).lean();

        if (!order) {
            throw new Error(`Không tìm thấy đơn hàng với mã: ${orderData}`);
        }

        const orderJson: IOrderJSON = {
            user_id: order.user_id.toString(), // Chuyển ObjectId sang string
            order_code: order.order_code,
            status_delivery: order.status_delivery,
            status_pick_time: order.status_pick_time,
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
}
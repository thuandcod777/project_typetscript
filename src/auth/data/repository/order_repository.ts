import { Mongoose } from "mongoose";
import IOrderRepository from "../../domain/services/iorder_repository";
import OrderModel from "../../domain/entities/order.entity";
import { IUser, UserSchema } from "../model/auth_model";
import { IOrderInputDTO } from "../../domain/dtos/order_input.dto";
import { IEmailInputDTO } from "../../domain/dtos/email_input.dto";
import { IOrder, OrderSchema } from "../model/order_model";
import { IOrderCodeInputDTO } from "../../domain/dtos/order_code_input.dto";

export default class OrderRepository implements IOrderRepository {
    constructor(private readonly client: Mongoose) { }

    public async saveOrder(email: IEmailInputDTO, orderData: IOrderInputDTO): Promise<OrderModel> {

        const userModel = this.client.model<IUser>('User', UserSchema);

        const orderModel = this.client.model<IOrder>('Order', OrderSchema);

        const user = await userModel.findOne({ email: email });
        if (!user) {
            throw new Error('User not found');
        }

        const saveOrder = await orderModel.create({
            userId: user._id,
            orderCode: orderData.orderCode,
            statusDelivery: orderData.statusDelivery,
            statusPickTime: null,
            product: orderData.product,
            addressTakeGoods: orderData.addressTakeGoods,
            addressDelivery: orderData.addressDelivery,
            payment: orderData.payment,
        });

        const rawOrder = saveOrder.toObject();

        return OrderModel.fromJson(rawOrder);
    }


    public async findOrder(orderCode: IOrderCodeInputDTO): Promise<boolean> {
        const doc = this.client.model<IOrder>('Order', OrderSchema);
        const isSuccess = await doc.findOne({ orderCode: orderCode });
        console.log("find data", isSuccess?.toObject());
        return true;
    }
}
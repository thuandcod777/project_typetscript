import { type ClientSession, Mongoose } from "mongoose";
import IOrderRepository from "../../domain/services/iorder_repository";
import { IOrderJSON } from "../../domain/entities/order.entity";
import { IOrderInputDTO } from "../../domain/dtos/order_input.dto";
import { IOrder, OrderSchema } from "../model/order_model";
import Order from "../../domain/entities/order.entity";
import { IUser, UserSchema } from "../model/auth_model";
import User from "../../domain/entities/user.entity";

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

    public async findOrder(orderCode: string): Promise<{ success: boolean, userData: User | null, orderData: Order | null, message: string }> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const orderModel = this.client.model<IOrder>('Order', OrderSchema);

        const order = await orderModel.findOne({ order_code: orderCode }).lean();

        if (!order) {
            return { success: false, userData: null, orderData: null, message: "Không tìm thấy mã đơn hàng." };
        }

        const orderData = Order.fromJson({
            user_id: order.user_id.toString() ?? null, // Chuyển ObjectId sang string
            order_code: order.order_code,
            status_delivery: order.status_delivery,
            status_schedule: order.status_schedule,
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
        });

        const user = await userModel.findOne({ user_id: orderData.user_id?.toString() ?? null }).lean();

        if (!user) {
            return { success: false, userData: null, orderData: null, message: "Không tìm thấy thông tin người dùng tương ứng." };
        }

        const userData = User.fromJson({
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            name_company: user.name_company,
            number_phone: user.number_phone,
            type: user.type,
            role: user.role,
        });

        return { success: true, userData: userData, orderData: orderData, message: "Tìm kiếm đơn hàng thành công" };
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
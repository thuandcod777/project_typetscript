"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_model_1 = require("../model/order_model");
const order_entity_1 = __importDefault(require("../../domain/entities/order.entity"));
const auth_model_1 = require("../model/auth_model");
const user_entity_1 = __importDefault(require("../../domain/entities/user.entity"));
class OrderRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async saveOrder(userId, orderData, session) {
        const orderModel = this.client.model('Order', order_model_1.OrderSchema);
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
    async findOrder(orderCode) {
        const userModel = this.client.model('User', auth_model_1.UserSchema);
        const orderModel = this.client.model('Order', order_model_1.OrderSchema);
        const order = await orderModel.findOne({ order_code: orderCode }).lean();
        if (!order) {
            return { success: false, userData: null, orderData: null, message: "Không tìm thấy mã đơn hàng." };
        }
        const orderData = order_entity_1.default.fromJson({
            user_id: order.user_id.toString() ?? null, // Chuyển ObjectId sang string
            order_code: order.order_code,
            status_delivery: order.status_delivery,
            status_schedule: order.status_schedule,
            product: {
                name_product: order.product.name_product,
                type_product: order.product.type_product,
                amount: order.product.amount,
                width: order.product.width,
                height: order.product.height,
                weight: order.product.weight,
                length: order.product.length,
            },
            address_take_goods: {
                method: order.address_take_goods.method,
                address: order.address_take_goods.address,
                scope: order.address_take_goods.scope,
            },
            address_delivery: {
                method: order.address_delivery.method,
                address: order.address_delivery.address,
                scope: order.address_delivery.scope,
            },
            payment: {
                type_payment: order.payment.type_payment,
                step_payment: order.payment.step_payment,
            },
        });
        const user = await userModel.findOne({ user_id: orderData.user_id?.toString() ?? null }).lean();
        if (!user) {
            return { success: false, userData: null, orderData: null, message: "Không tìm thấy thông tin người dùng tương ứng." };
        }
        const userData = user_entity_1.default.fromJson({
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
    async verifyOrderCode(orderCode) {
        const orderModel = this.client.model('Order', order_model_1.OrderSchema);
        const order = await orderModel.findOne({ order_code: orderCode }).lean();
        if (!order) {
            return { success: false, message: 'Đơn hàng không tồn tại.' };
        }
        return { success: true, message: 'Xác thực mã đơn hàng thành công.' };
    }
}
exports.default = OrderRepository;

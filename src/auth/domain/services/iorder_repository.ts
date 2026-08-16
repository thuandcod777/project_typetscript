import { IOrderInputDTO } from "../dtos/order_input.dto";
import Order from "../entities/order.entity";
import { type ClientSession } from "mongoose";

export default interface IOrderRepository {
    saveOrder(userId: string, orderData: IOrderInputDTO, session?: ClientSession): Promise<{ success: boolean, message: string }>;
    findOrder(orderData: string): Promise<Order>;
    verifyOrderCode(orderCode: string): Promise<{ success: boolean, message: string }>;
}
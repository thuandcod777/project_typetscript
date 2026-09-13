import { IOrderInputDTO } from "../dtos/order_input.dto";
import Order from "../entities/order.entity";
import { type ClientSession } from "mongoose";
import User from "../entities/user.entity";

export default interface IOrderRepository {
    saveOrder(userId: string, orderData: IOrderInputDTO, session?: ClientSession): Promise<{ success: boolean, message: string }>;
    findOrder(orderCode: string): Promise<{ success: boolean, userData: User | null, orderData: Order | null, message: string }>;
    verifyOrderCode(orderCode: string): Promise<{ success: boolean, message: string }>;
}
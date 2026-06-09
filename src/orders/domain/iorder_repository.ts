import { IOrder } from "../data/models/order_model";
import OrderModel from "./order";

export default interface IOrderRepository {
    saveOrder(orderData: OrderModel/* Partial<IOrder> */): Promise<OrderModel>;
    findOrder(orderCode: string): Promise<boolean>;
}
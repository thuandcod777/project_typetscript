import { IOrderInputDTO } from "../dtos/order_input.dto";
import Order from "../entities/order.entity";

export default interface IOrderRepository {
    saveOrder(orderData: IOrderInputDTO): Promise<Order>;
    findOrder(orderData: string): Promise<Order>;
}
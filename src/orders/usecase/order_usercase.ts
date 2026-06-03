import { IOrder } from "../data/models/order_model";
import IOrderRepository from "../domain/iorder_repository";
import OrderModel from "../domain/order";

export default class OrderUsecase {
    constructor(private orderRepository: IOrderRepository) { }
    public async execute(orderData: /* Partial<IOrder> */OrderModel): Promise<OrderModel> {

        const order = await this.orderRepository.saveOrder(orderData);

        return order;
    }
}
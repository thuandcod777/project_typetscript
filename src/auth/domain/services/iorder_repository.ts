import { IEmailInputDTO } from "../dtos/email_input.dto";
import { IOrderCodeInputDTO } from "../dtos/order_code_input.dto";
import { IOrderInputDTO } from "../dtos/order_input.dto";
import Order from "../entities/order.entity";

export default interface IOrderRepository {
    saveOrder(email: IEmailInputDTO, orderData: IOrderInputDTO): Promise<Order>;
    findOrder(orderCode: IOrderCodeInputDTO): Promise<boolean>;
}
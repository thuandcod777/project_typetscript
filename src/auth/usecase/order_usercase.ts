import { IEmailInputDTO } from "../domain/dtos/email_input.dto";
import { IOrderInputDTO } from "../domain/dtos/order_input.dto";
import IOrderRepository from "../domain/services/iorder_repository";

export default class OrderUsecase {
    constructor(private orderRepository: IOrderRepository) { }
    public async execute(email: IEmailInputDTO, orderData: IOrderInputDTO): Promise<boolean> {

        const order = await this.orderRepository.saveOrder(email, orderData);

        return true;
    }
}
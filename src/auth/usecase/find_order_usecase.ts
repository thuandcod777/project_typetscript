import { IOrderCodeInputDTO } from "../domain/dtos/order_code_input.dto";
import IOrderRepository from "../domain/services/iorder_repository";

export default class FindOrderUsecase {
    constructor(private orderRepository: IOrderRepository) { }
    public async execute(orderCode: IOrderCodeInputDTO): Promise<boolean> {

        const order = await this.orderRepository.findOrder(orderCode);

        return true;
    }
}
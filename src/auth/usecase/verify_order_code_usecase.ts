import { ResponseDto } from "../domain/entities/response.entity";
import IOrderRepository from "../domain/services/iorder_repository";

export default class VerifyOrderCodeUsecase {
    constructor(private orderRepository: IOrderRepository) { }

    public async execute(orderCode: string): Promise<ResponseDto> {

        const order = await this.orderRepository.verifyOrderCode(orderCode);
        console.log(order);
        if (!order.success) {
            return ResponseDto.failure(order.message);
        }

        return ResponseDto.success(order.message);
    }
}
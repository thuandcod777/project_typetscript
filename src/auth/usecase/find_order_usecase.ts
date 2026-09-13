import Order from "../domain/entities/order.entity";
import { ResponseDto } from "../domain/entities/response.entity";
import IOrderRepository from "../domain/services/iorder_repository";
import ObjectData from "../domain/entities/object_data.entity";

export default class FindOrderUsecase {
    constructor(private orderRepository: IOrderRepository) { }
    public async execute(orderCode: string): Promise<ResponseDto<ObjectData>> {

        const result = await this.orderRepository.findOrder(orderCode);

        if (!result.success) {
            return ResponseDto.failure(result.message);
        }

        const userOrder = new ObjectData({ user: result.userData!, order: result.orderData });

        return ResponseDto.success(result.message, userOrder);
    }
}
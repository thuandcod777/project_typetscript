import Order from "../domain/entities/order.entity";
import { ResponseDto } from "../domain/entities/response.entity";
import IOrderRepository from "../domain/services/iorder_repository";

export default class FindOrderUsecase {
    constructor(private orderRepository: IOrderRepository) { }
    public async execute(orderData: string): Promise<ResponseDto> {

        const data = await this.orderRepository.findOrder(orderData);

        if (!data) {
            return ResponseDto.failure('Tìm kiếm đơn hàng thất bại');
        }

        return ResponseDto.success('Tìm kiếm đơn hàng thành công', data);
    }
}
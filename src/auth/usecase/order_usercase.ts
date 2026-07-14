import { IOrderInputDTO } from "../domain/dtos/order_input.dto";
import { ResponseDto } from "../domain/entities/response.entity";
import IOrderRepository from "../domain/services/iorder_repository";

export default class OrderUsecase {
    constructor(private orderRepository: IOrderRepository) { }
    public async execute(orderData: IOrderInputDTO): Promise<ResponseDto> {

        const order = await this.orderRepository.saveOrder(orderData);

        if (!order) {
            ResponseDto.failure('Đăng ký đơn hàng thất bại');
        }

        return ResponseDto.success('Đăng ký đơn hàng thành công');
    }
}
import IOrderRepository from "../domain/iorder_repository";

export default class FindOrderUsecase {
    constructor(private orderRepository: IOrderRepository) { }
    public async execute(orderCode: string): Promise<boolean> {

        const order = await this.orderRepository.findOrder(orderCode);

        return true;
    }
}
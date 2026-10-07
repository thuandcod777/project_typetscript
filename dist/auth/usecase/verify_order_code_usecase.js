"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
class VerifyOrderCodeUsecase {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(orderCode) {
        const order = await this.orderRepository.verifyOrderCode(orderCode);
        console.log(order);
        if (!order.success) {
            return response_entity_1.ResponseDto.failure(order.message);
        }
        return response_entity_1.ResponseDto.success(order.message);
    }
}
exports.default = VerifyOrderCodeUsecase;

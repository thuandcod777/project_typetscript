"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
const object_data_entity_1 = __importDefault(require("../domain/entities/object_data.entity"));
class FindOrderUsecase {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async execute(orderCode) {
        const result = await this.orderRepository.findOrder(orderCode);
        if (!result.success) {
            return response_entity_1.ResponseDto.failure(result.message);
        }
        const userOrder = new object_data_entity_1.default({ user: result.userData, order: result.orderData });
        return response_entity_1.ResponseDto.success(result.message, userOrder);
    }
}
exports.default = FindOrderUsecase;

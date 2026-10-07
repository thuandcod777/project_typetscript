"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
class PickTimeUsecase {
    picktimeRepository;
    constructor(picktimeRepository) {
        this.picktimeRepository = picktimeRepository;
    }
    async execute() {
        const data = await this.picktimeRepository.get_pick_time();
        return response_entity_1.ResponseDto.success(data.message, data.data);
    }
}
exports.default = PickTimeUsecase;

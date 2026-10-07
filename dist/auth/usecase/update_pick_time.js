"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
class UpdatePickTimeUsecase {
    pickTimeRepository;
    constructor(pickTimeRepository) {
        this.pickTimeRepository = pickTimeRepository;
    }
    async execute(pickTimeData) {
        /*   const dataPickTime = await this.pickTimeRepository.get_pick_time();
  
          if (!dataPickTime.success) {
              return ResponseDto.failure(dataPickTime.message);
          }
   */
        const isSaved = await this.pickTimeRepository.update_status_pick_time(pickTimeData);
        if (!isSaved.success) {
            return response_entity_1.ResponseDto.failure(isSaved.message);
        }
        return response_entity_1.ResponseDto.success(isSaved.message);
    }
}
exports.default = UpdatePickTimeUsecase;

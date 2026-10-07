"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
class ScopeUsecase {
    scopeRepository;
    constructor(scopeRepository) {
        this.scopeRepository = scopeRepository;
    }
    async execute(scopeDataInput) {
        const scope = await this.scopeRepository.saveScopeList(scopeDataInput);
        if (!scope.success) {
            console.log(scope.message);
            return response_entity_1.ResponseDto.failure(scope.message);
        }
        return response_entity_1.ResponseDto.success(scope.message);
    }
}
exports.default = ScopeUsecase;

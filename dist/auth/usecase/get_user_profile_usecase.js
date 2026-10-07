"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
const object_data_entity_1 = __importDefault(require("../domain/entities/object_data.entity"));
class GetUserProfileUsecase {
    authRepository;
    contractRepository;
    constructor(authRepository, contractRepository) {
        this.authRepository = authRepository;
        this.contractRepository = contractRepository;
    }
    async execute(userSession) {
        const isUserProfile = await this.authRepository.getUserProfileFromSession(userSession.token, userSession.role);
        if (!isUserProfile.success) {
            return response_entity_1.ResponseDto.failure(isUserProfile.message);
        }
        let contractData = null;
        if (userSession.role === 'cooperative') {
            const isContract = await this.contractRepository.getContract(isUserProfile.userData._id.toString());
            if (!isContract.success) {
                return response_entity_1.ResponseDto.failure(isContract.message);
            }
            contractData = isContract.contractData;
        }
        const userContract = new object_data_entity_1.default({ user: isUserProfile.userData, contract: contractData });
        return response_entity_1.ResponseDto.success(isUserProfile.message, userContract);
    }
}
exports.default = GetUserProfileUsecase;

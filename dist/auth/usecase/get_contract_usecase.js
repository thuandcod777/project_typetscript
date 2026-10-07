"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
class GetContractUsecase {
    authRepository;
    contractRepository;
    constructor(authRepository, contractRepository) {
        this.authRepository = authRepository;
        this.contractRepository = contractRepository;
    }
    async execute(email) {
        const session = await this.authRepository.startSession();
        session.startTransaction();
        try {
            const isUserChecked = await this.authRepository.checkUser(email, session);
            const result = await this.contractRepository.getContract(isUserChecked.userData?._id, session);
            if (!result) {
                return response_entity_1.ResponseDto.failure('Không tìm thấy hợp đồng cho địa chỉ email đã cung cấp.');
            }
            await session.commitTransaction();
            return response_entity_1.ResponseDto.success('Tìm thấy hợp đồng cho địa chỉ email đã cung cấp.', result.contractData);
        }
        catch (error) {
            await session.abortTransaction();
            return response_entity_1.ResponseDto.failure("Đã có lỗi xảy ra hệ thống. Vui lòng thử lại sau.");
        }
        finally {
            await session.endSession();
        }
    }
}
exports.default = GetContractUsecase;

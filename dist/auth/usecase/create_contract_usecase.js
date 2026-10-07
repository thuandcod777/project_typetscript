"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
const transaction_failure_1 = require("../domain/error/transaction-failure");
class CreateContractUsecase {
    authRepository;
    contractRepository;
    constructor(authRepository, contractRepository) {
        this.authRepository = authRepository;
        this.contractRepository = contractRepository;
    }
    async execute(email, contract_code, step_contract) {
        const session = await this.authRepository.startSession();
        session.startTransaction();
        try {
            const checkUser = await this.authRepository.checkUser(email, session);
            if (!checkUser.success) {
                return response_entity_1.ResponseDto.failure(checkUser.message);
            }
            const result = await this.contractRepository.createContract(checkUser.userData._id.toString(), contract_code, step_contract, session);
            if (!result.success) {
                return response_entity_1.ResponseDto.failure(result.message);
            }
            await session.commitTransaction();
            return response_entity_1.ResponseDto.success(result.message);
        }
        catch (error) {
            await session.abortTransaction();
            if (error instanceof transaction_failure_1.TransactionFailure) {
                return error.response;
            }
            console.error("Lỗi:", error);
            return response_entity_1.ResponseDto.failure("Đã có lỗi xảy ra hệ thống. Vui lòng thử lại sau.");
        }
        finally {
            await session.endSession();
        }
    }
}
exports.default = CreateContractUsecase;

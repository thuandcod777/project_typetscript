import { ICreateContractInputDTO } from "../domain/dtos/verify_contract_input";
import { ResponseDto } from "../domain/entities/response.entity";
import { TransactionFailure } from "../domain/error/transaction-failure";
import IAuthRepository from "../domain/services/iauth_repository";
import IContractRepository from "../domain/services/icontract_repository";

export default class CreateContractUsecase {
    constructor(private authRepository: IAuthRepository, private contractRepository: IContractRepository) { }

    public async execute(email: string, contract_code: string, step_contract: number): Promise<ResponseDto> {

        const session = await this.authRepository.startSession();
        session.startTransaction();
        try {
            const checkUser = await this.authRepository.checkUser(email, session);

            if (!checkUser.success) {
                return ResponseDto.failure(checkUser.message);
            }

            const result = await this.contractRepository.createContract(checkUser.userData!._id!.toString(), contract_code, step_contract, session);

            if (!result.success) {
                return ResponseDto.failure(result.message);
            }

            await session.commitTransaction();

            return ResponseDto.success(result.message);
        } catch (error) {
            await session.abortTransaction();
            if (error instanceof TransactionFailure) {
                return error.response;
            }
            console.error("Lỗi:", error);
            return ResponseDto.failure("Đã có lỗi xảy ra hệ thống. Vui lòng thử lại sau.");
        } finally {
            await session.endSession();
        }
    }
}
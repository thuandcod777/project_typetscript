import { ResponseDto } from "../domain/entities/response.entity";
import { TransactionFailure } from "../domain/error/transaction-failure";
import IAuthRepository from "../domain/services/iauth_repository";
import IContractRepository from "../domain/services/icontract_repository";

export default class GetContractUsecase {
    constructor(private authRepository: IAuthRepository, private contractRepository: IContractRepository) { }

    public async execute(email: string): Promise<ResponseDto> {
        const session = await this.authRepository.startSession();
        session.startTransaction();
        try {
            const isUserChecked = await this.authRepository.checkUser(email, session);

            const result = await this.contractRepository.getContract(isUserChecked.userData?._id!, session);

            if (!result) {
                return ResponseDto.failure('Không tìm thấy hợp đồng cho địa chỉ email đã cung cấp.');
            }
            await session.commitTransaction();
            return ResponseDto.success('Tìm thấy hợp đồng cho địa chỉ email đã cung cấp.', result.contractData);
        } catch (error) {
            await session.abortTransaction();

            return ResponseDto.failure("Đã có lỗi xảy ra hệ thống. Vui lòng thử lại sau.");

        } finally {
            await session.endSession();
        }

    }
}
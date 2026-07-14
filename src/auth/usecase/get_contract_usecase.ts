import { ResponseDto } from "../domain/entities/response.entity";
import IContractRepository from "../domain/services/icontract_repository";

export default class GetContractUsecase {
    constructor(private contractRepository: IContractRepository) { }

    public async execute(email: string): Promise<ResponseDto> {

        const result = await this.contractRepository.getContract(email);

        if (!result) {
            return ResponseDto.failure('Không tìm thấy hợp đồng cho địa chỉ email đã cung cấp.');
        }

        return ResponseDto.success('Tìm thấy hợp đồng cho địa chỉ email đã cung cấp.', result);
    }
}
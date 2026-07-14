import fa from "zod/v4/locales/fa.cjs";
import IContractRepository from "../domain/services/icontract_repository";
import { IContractDetailsInputDTO } from "../domain/dtos/contract_details_input.dto";
import { ResponseDto } from "../domain/entities/response.entity";

export default class CreateContractUsecase {
    constructor(private contractRepository: IContractRepository) { }

    public async execute(contractDetailDataInput: IContractDetailsInputDTO): Promise<ResponseDto> {
        const data = await this.contractRepository.verifycontract(contractDetailDataInput);

        if (!data) {
            ResponseDto.failure('Đăng ký hợp đồng thất bại');
        }

        return ResponseDto.success('Đăng ký hợp đồng thành công');
    }
}
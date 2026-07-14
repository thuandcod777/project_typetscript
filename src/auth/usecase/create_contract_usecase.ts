import { ICreateContractInputDTO } from "../domain/dtos/verify_contract_input";
import { ResponseDto } from "../domain/entities/response.entity";
import IContractRepository from "../domain/services/icontract_repository";

export default class CreateContractUsecase {
    constructor(private contractRepository: IContractRepository) { }

    public async execute(createContract: ICreateContractInputDTO): Promise<ResponseDto> {
        const result = await this.contractRepository.createContract(createContract);
        if (!result) {
            throw new Error('Xác thực hợp đồng thành công');
        }
        return ResponseDto.success('Đã tạo mã hợp đồng thành công');
    }
}
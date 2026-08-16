import { IContractCodeInputDTO } from "../domain/dtos/contract-code-input.dto";
import { IUploadPdfDTO } from "../domain/dtos/pdf-input.dto";
import { ResponseDto } from "../domain/entities/response.entity";
import IContractRepository from "../domain/services/icontract_repository";

export default class UploadPdfUsecase {
    constructor(private contractRepository: IContractRepository) { }

    public async execute(uploadPdfData: IUploadPdfDTO): Promise<ResponseDto> {

        const data = await this.contractRepository.uploadPdf(uploadPdfData);
        if (!data) {
            return ResponseDto.failure('Tải file pdf không thành công');
        }
        return ResponseDto.success('Đăng tải thành công');
    }
}
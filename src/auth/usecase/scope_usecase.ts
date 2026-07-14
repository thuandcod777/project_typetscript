import { IScopeInputDTO } from "../domain/dtos/scope_input.dto";
import { ResponseDto } from "../domain/entities/response.entity";
import IScopeRepository from "../domain/services/iscope_repository";

export default class ScopeUsecase {
    constructor(private scopeRepository: IScopeRepository) { }
    public async execute(scopeDataInput: IScopeInputDTO): Promise<ResponseDto> {
        const scope = await this.scopeRepository.saveScopeList(scopeDataInput);

        if (!scope) {
            return ResponseDto.failure('Lưu danh sách phạm vi thất bại');
        }

        return ResponseDto.success('Lưu danh sách phạm vi thành công');
    }
}
import { IScopeInputDTO } from "../domain/dtos/scope_input.dto";
import { ResponseDto } from "../domain/entities/response.entity";
import IScopeRepository from "../domain/services/iscope_repository";

export default class ScopeUsecase {
    constructor(private scopeRepository: IScopeRepository) { }
    public async execute(scopeDataInput: IScopeInputDTO): Promise<ResponseDto> {
        const scope = await this.scopeRepository.saveScopeList(scopeDataInput);

        if (!scope.success) {
            console.log(scope.message);
            return ResponseDto.failure(scope.message);
        }

        return ResponseDto.success(scope.message);
    }
}
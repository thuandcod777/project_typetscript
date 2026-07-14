import { IScopeInputDTO } from "../dtos/scope_input.dto";

export default interface IScopeRepository {
    saveScopeList(scopeDataInput: IScopeInputDTO): Promise<boolean>;
}
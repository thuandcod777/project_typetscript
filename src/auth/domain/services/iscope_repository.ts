import { IScopeInputDTO } from "../dtos/scope_input.dto";
import { type ClientSession } from "mongoose";

export default interface IScopeRepository {
    saveScopeList(scopeDataInput: IScopeInputDTO, session?: ClientSession): Promise<{ success: boolean, message: string }>;
}
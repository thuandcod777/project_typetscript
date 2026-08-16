import { type QueryOptions, type ClientSession, Mongoose } from "mongoose";
import IScopeRepository from "../../domain/services/iscope_repository";
import { IScopeInputDTO } from "../../domain/dtos/scope_input.dto";
import { ContractSchema, IContract } from "../model/contract_model";

export default class ScopeRepository implements IScopeRepository {
    constructor(private readonly client: Mongoose) { }

    public async saveScopeList(scopeDataInput: IScopeInputDTO, session?: ClientSession): Promise<{ success: boolean, message: string }> {
        const contractModel = this.client.model<IContract>('Contract', ContractSchema);

        /*  if (!scopeList) {
             throw new Error("Scope list cannot be null");
         } */

        const formattedScopes = scopeDataInput.scopes.map(scope => ({
            is_scope: scope.is_scope,
            address: scope.address,
            location: scope.location
        }));


        const updateOptions: QueryOptions & { returnDocument: 'after' | 'before' } = { returnDocument: 'after' };

        if (session) {
            updateOptions.session = session;
        }

        const scope = await contractModel.findOneAndUpdate(
            { user_id: scopeDataInput.user_id },
            {
                $set: {
                    step_contract: scopeDataInput.step_contract,
                    scope: {
                        is_success: scopeDataInput.is_success,
                        scopes: formattedScopes
                    }
                }
            }, updateOptions
        ).lean();


        return { success: true, message: "Đăng ký định tuyến thành công." };


    }
}
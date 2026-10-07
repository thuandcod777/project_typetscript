"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_model_1 = require("../model/contract_model");
class ScopeRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async saveScopeList(scopeDataInput, session) {
        const contractModel = this.client.model('Contract', contract_model_1.ContractSchema);
        /*  if (!scopeList) {
             throw new Error("Scope list cannot be null");
         } */
        const formattedScopes = scopeDataInput.scopes.map(scope => ({
            is_scope: scope.is_scope,
            address: scope.address,
            location: scope.location
        }));
        const updateOptions = { returnDocument: 'after' };
        if (session) {
            updateOptions.session = session;
        }
        const scope = await contractModel.findOneAndUpdate({ user_id: scopeDataInput.user_id }, {
            $set: {
                step_contract: scopeDataInput.step_contract,
                scope: {
                    is_success: scopeDataInput.is_success,
                    scopes: formattedScopes
                }
            }
        }, updateOptions).lean();
        return { success: true, message: "Đăng ký định tuyến thành công." };
    }
}
exports.default = ScopeRepository;

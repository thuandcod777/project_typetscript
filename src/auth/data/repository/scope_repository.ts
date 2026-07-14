import { Mongoose } from "mongoose";
import IScopeRepository from "../../domain/services/iscope_repository";
import { IUser, UserSchema } from "../model/auth_model";
import { IStepContract, StepContractSchema } from "../model/contract_model";
import { ScopeCollection } from "../../domain/entities/scope.entity";
import { IScopeInputDTO } from "../../domain/dtos/scope_input.dto";

export default class ScopeRepository implements IScopeRepository {
    constructor(private readonly client: Mongoose) { }

    public async saveScopeList(scopeDataInput: IScopeInputDTO): Promise<boolean> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const contractModel = this.client.model<IStepContract>('Contract', StepContractSchema);

        /*   if (!scopeList) {
              throw new Error("Scope list cannot be null");
          } */

        const formattedScopes = scopeDataInput.scopes.map(scope => ({
            is_scope: true,
            address: scope.address,
            location: scope.location
        }));

        const dbSession = await this.client.startSession();


        try {
            await dbSession.withTransaction(async () => {
                const user = await userModel.findOne({ email: scopeDataInput.email }).session(dbSession);

                if (!user) {
                    throw new Error(`User with email ${scopeDataInput.email} not found`);
                }

                const contractId = user.contract;

                if (!contractId) {
                    throw new Error("User does not have a contract assigned");
                }

                const contract = await contractModel.findById(contractId).session(dbSession);

                if (!contract) {
                    throw new Error("Contract not found");
                }

                if (!contract.scope) {
                    await contractModel.findByIdAndUpdate(
                        contractId,
                        {
                            $set: {
                                step_contract: scopeDataInput.step_contract,
                                scope: {
                                    is_success: true,
                                    scopes: formattedScopes
                                }
                            }
                        },
                        { new: true, runValidators: true, session: dbSession }
                    );
                } else {
                    await contractModel.findByIdAndUpdate(
                        contractId,
                        {
                            $set: {
                                scope: {
                                    is_success: true,
                                    scopes: formattedScopes
                                }
                            }
                        },
                        { new: true, runValidators: true, session: dbSession }
                    );
                }


            });

            return true;

        } catch (error) {
            console.error(`[DB Error] Lỗi xử lý lưu danh sách Scope:`, error);
            throw error;
        } finally {
            await dbSession.endSession();
        }
    }
}
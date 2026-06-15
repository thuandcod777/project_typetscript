import { Mongoose } from "mongoose";
import { ScopeCollection } from "../../domain/entities/scope-collection.entity";
import IScopeRepository from "../../domain/services/iscope_repository";
import { IUser, UserSchema } from "../model/auth_model";
import { IStepContract, StepContractSchema } from "../model/contract_model";

export default class ScopeRepository implements IScopeRepository {
    constructor(private readonly client: Mongoose) { }

    public async saveScopeList(email: string, scopeList: ScopeCollection[]): Promise<ScopeCollection> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const contractModel = this.client.model<IStepContract>('Contract', StepContractSchema);

        if (!scopeList) {
            throw new Error("Scope list cannot be null");
        }

        const formattedScopes = scopeList.map(scope => ({
            is_scope: true,
            address: scope.address,
            location: scope.latlng.toGeoJson()
        }));

        const dbSession = await this.client.startSession();
        dbSession.startTransaction();
        try {
            // 1. Tìm user bằng email
            const user = await userModel.findOne({ email: email }).session(dbSession);
            if (!user) {
                throw new Error(`User with email ${email} not found`);
            }

            const contractId = user.contract;

            if (!contractId) {
                throw new Error("User does not have a contract assigned");
            }

            // 2. Lấy thông tin contract hiện tại để kiểm tra trường scope
            const contract = await contractModel.findById(contractId).session(dbSession);
            if (!contract) {
                throw new Error("Contract not found");
            }

            let updatedContract;

            // 3. Xử lý cập nhật dựa trên trạng thái của trường scope (null hoặc đã có dữ liệu)
            if (!contract.scope) {
                // Nếu scope đang null -> Dùng $set để khởi tạo mới toàn bộ Object, tránh lỗi PathNotViable
                updatedContract = await contractModel.findByIdAndUpdate(
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
            } else {
                updatedContract = await contractModel.findByIdAndUpdate(
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

            // ĐÃ XÓA: bỏ dòng await user?.save() dư thừa gây lỗi Validation Role

            await dbSession.commitTransaction();

            // Trả về dữ liệu scope đã được cập nhật từ contract
            const finalScopeData = updatedContract?.scope;
            return finalScopeData as unknown as ScopeCollection;

        } catch (error) {
            await dbSession.abortTransaction();
            console.error(`[DB Error] Lỗi xử lý lưu danh sách Scope:`, error);
            throw error;
        } finally {
            await dbSession.endSession();
        }
    }
}
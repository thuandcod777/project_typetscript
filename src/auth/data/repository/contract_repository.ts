import { Mongoose } from "mongoose";
import IContractRepository from "../../domain/services/icontract_repository";
import { IContract, IStepContract, StepContractSchema } from "../model/contract_model";
import { IUser, UserSchema } from "../model/auth_model";
import { IContractDetailsInputDTO } from "../../domain/dtos/contract_details_input.dto";
import { IUploadPdfDTO } from "../../domain/dtos/pdf-input.dto";
import { ICreateContractInputDTO } from "../../domain/dtos/verify_contract_input";
import { Contract, IContractJSON } from "../../domain/entities/contract.entity";

export default class ContractRepository implements IContractRepository {
    constructor(private readonly client: Mongoose) { }

    public async createContract(createContract: ICreateContractInputDTO): Promise<boolean> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const stepContractModel = this.client.model<IStepContract>('Contract', StepContractSchema);

        const dbSession = await this.client.startSession();

        let isSuccess = false;

        try {
            await dbSession.withTransaction(async () => {
                const user = await userModel.findOne({ email: createContract.email }).session(dbSession);

                if (!user) {
                    console.error(`[DB Error] Không tìm thấy User ID: ${user!._id}`);

                    return isSuccess;
                }

                const contractId = user.contract;

                if (!contractId) {
                    const stepContractData = await stepContractModel.create([{
                        contract_code: createContract.contract_code,
                        step_contract: createContract.step_contract,
                        contract_details: null,
                        scope: null,
                        contract_pdf: null,
                        is_success: false
                    }], { session: dbSession });

                    user.contract = stepContractData[0]._id as any;
                    await user.save({ session: dbSession });

                    isSuccess = true;
                }

            });

            return isSuccess;

        } catch (error) {
            console.error(`[DB Error] Lỗi cập nhật session:`, error);
            return false;
        } finally {
            await dbSession.endSession();
        }
    }

    public async verifycontract(contractDetailDataInput: IContractDetailsInputDTO): Promise<boolean> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const contractModel = this.client.model<IStepContract>('Contract', StepContractSchema);

        const dbSession = await this.client.startSession();

        try {
            await dbSession.withTransaction(async () => {
                const user = await userModel.findOne({ email: contractDetailDataInput.email }).session(dbSession);

                if (!user) {
                    throw new Error(`User with email ${user} not found`);
                }

                const contractId = user.contract;

                if (!contractId) {
                    throw new Error("User does not have a contract assigned");
                }

                const contract = await contractModel.findById(contractId).session(dbSession);

                if (!contract) {
                    throw new Error("Contract not found");
                }

                const payload: IContract = {
                    number_contract: contractDetailDataInput.number_contract,
                    name_client_a: contractDetailDataInput.name_client_a,
                    name_business_owner_b: contractDetailDataInput.name_business_owner_b,
                    name_enterprise_a: contractDetailDataInput.name_enterprise_a,
                    name_enterprise_b: contractDetailDataInput.name_enterprise_b,
                    business_register_number_a: contractDetailDataInput.business_register_number_a,
                    business_register_number_b: contractDetailDataInput.business_register_number_b,
                    name_product: contractDetailDataInput.name_product,
                    type_weight: contractDetailDataInput.type_weight,
                    type_product: contractDetailDataInput.type_product,
                    pickup_location: contractDetailDataInput.pickup_location,
                    delivery_location: contractDetailDataInput.delivery_location,
                    method_contract: contractDetailDataInput.method_contract,
                    method_delivery: contractDetailDataInput.method_delivery,
                    method_payment: contractDetailDataInput.method_payment,
                };


                if (!contract.contract_details) {
                    await contractModel.findByIdAndUpdate(
                        contractId,
                        {
                            $set: {
                                step_contract: contractDetailDataInput.step_contract,
                                contract_details: payload,
                            }
                        },
                        { session: dbSession }
                    );
                }
            });
            return true;
        } catch (error) {
            console.error(`[DB Error] Lỗi cập nhật session:`, error);
            return false;
        } finally {
            await dbSession.endSession();
        }
    }

    public async uploadPdf(uploadPdfData: IUploadPdfDTO): Promise<boolean> {
        const stepContractModel = this.client.model<IStepContract>('Contract', StepContractSchema);

        try {

            const contractPdf = await stepContractModel.findOneAndUpdate(
                { contract_code: uploadPdfData.contract_code },
                {
                    step_contract: uploadPdfData.step_contract,
                    contract_pdf: {
                        name: uploadPdfData.contract_pdf.originalname,
                        buffer: uploadPdfData.contract_pdf.buffer,
                        mime_type: uploadPdfData.contract_pdf.mimetype
                    }
                }
            );

            if (!contractPdf || !contractPdf.contract_code) {
                return false;
            }

            return true;
        } catch (error) {
            console.error(`[DB Error] Lỗi cập nhật session:`, error);
            return false;
        }
    }

    public async getContract(email: string): Promise<Contract | null> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        this.client.model<IStepContract>('Contract', StepContractSchema);
        const user = await userModel.findOne({ email: email }).select('contract').populate({ path: 'contract', match: { contract: { $exists: true } } }).lean();

        if (!user || !user.contract || typeof user.contract === 'string') {
            return null;
        }

        const contractJson = user.contract as unknown as IContractJSON;


        return Contract.fromJson(contractJson);

    }

}


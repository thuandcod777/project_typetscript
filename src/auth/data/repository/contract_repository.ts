import { type QueryOptions, type ClientSession, Mongoose } from "mongoose";
import IContractRepository from "../../domain/services/icontract_repository";
import { ContractSchema, IContract } from "../model/contract_model";
import { IUploadPdfDTO } from "../../domain/dtos/pdf-input.dto";
import { ICreateContractInputDTO } from "../../domain/dtos/verify_contract_input";
import { Contract } from "../../domain/entities/contract.entity";

export default class ContractRepository implements IContractRepository {
    constructor(private readonly client: Mongoose) { }

    public async createContract(userId: string, contract_code: string, step_contract: number, session?: ClientSession): Promise<{ success: boolean, message: string }> {
        const contractModel = this.client.model<IContract>('Contract', ContractSchema);

        const updateOptions: QueryOptions & { returnDocument: 'after' | 'before' } = { returnDocument: 'after' };

        if (session) {
            updateOptions.session = session;
        }

        const contractQuery = new contractModel({
            user_id: userId.toString(),
            contract_code: contract_code,
            step_contract: step_contract,
            contract_details: null,
            scope: null,
            contract_pdf: null,
            is_success: false
        });

        await contractQuery.save({ session: session ? session : null });

        return { success: true, message: "Đăng ký hợp đồng thành công." };
    }


    public async uploadPdf(uploadPdfData: IUploadPdfDTO, session?: ClientSession): Promise<{ success: boolean, message: string }> {
        const contractModel = this.client.model<IContract>('Contract', ContractSchema);

        const updateOptions: QueryOptions & { returnDocument: 'after' | 'before' } = {
            returnDocument: 'after'
        }
        if (session) {
            updateOptions.session = session;
        }
        const contractPdf = await contractModel.findOneAndUpdate(
            { user_id: uploadPdfData.user_id },
            {
                $set: {
                    step_contract: uploadPdfData.step_contract,
                    contract_details: uploadPdfData.contract_details,
                    contract_pdf: {
                        name: uploadPdfData.contract_pdf.originalname,
                        buffer: uploadPdfData.contract_pdf.buffer,
                        mime_type: uploadPdfData.contract_pdf.mimetype
                    }
                }
            }, updateOptions
        ).lean();

        return { success: true, message: "Đăng ký thông tin hợp đồng thành công." };
    }

    public async getContract(userId: string, session?: ClientSession): Promise<{ success: boolean, contractData: Contract | null, message: string }> {

        const contractModel = this.client.model<IContract>('Contract', ContractSchema);

        const contractQuery = contractModel.findOne({ user_id: userId });

        if (session) {
            contractQuery.session(session);
        } else {
            contractQuery.readConcern('majority');
        }

        const contract = await contractQuery.lean();


        const contractData = contract ? Contract.fromJson({
            user_id: contract.user_id.toString(),
            contract_code: contract.contract_code,
            step_contract: contract.step_contract,
            contract_details: contract.contract_details,
            scope: contract.scope,
            contract_pdf: contract.contract_pdf,
            is_success: contract.is_success
        }) : null;

        return { success: true, contractData: contractData, message: "Tìm thấy thông tin hợp đồng thành công." };

    }

}


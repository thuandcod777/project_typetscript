import { IContractDetailsInputDTO } from "../dtos/contract_details_input.dto";
import { IUploadPdfDTO } from "../dtos/pdf-input.dto";
import { ICreateContractInputDTO } from "../dtos/verify_contract_input";
import { Contract } from "../entities/contract.entity";
import { type ClientSession } from "mongoose";

export default interface IContractRepository {
    createContract(userId: string, contract_code: string, step_contract: number, session?: ClientSession): Promise<{ success: boolean, message: string }>;
    uploadPdf(uploadPdfData: IUploadPdfDTO, session?: ClientSession): Promise<{ success: boolean, message: string }>;
    getContract(userId: string, session?: ClientSession): Promise<{ success: boolean, contractData: Contract | null, message: string }>;
}
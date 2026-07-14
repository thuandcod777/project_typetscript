import { IContractCodeInputDTO } from "../dtos/contract-code-input.dto";
import { IContractDetailsInputDTO } from "../dtos/contract_details_input.dto";
import { IUploadPdfDTO } from "../dtos/pdf-input.dto";
import { ICreateContractInputDTO } from "../dtos/verify_contract_input";
import { Contract } from "../entities/contract.entity";

export default interface IContractRepository {
    createContract(verifyContract: ICreateContractInputDTO): Promise<boolean>;
    getContract(email: string): Promise<Contract | null>;
    verifycontract(contractDetailDataInput: IContractDetailsInputDTO): Promise<boolean>;
    uploadPdf(uploadPdfData: IUploadPdfDTO): Promise<boolean>;
}
import { IContractDetailsInputDTO } from "./contract_details_input.dto";


export interface IMulterFileDTO {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    size: number;
    buffer?: Buffer;
    path?: string;
}

export interface IUploadPdfDTO {
    user_id: string;
    step_contract: number;
    contract_details: IContractDetailsInputDTO;
    contract_pdf: IMulterFileDTO;
    // contract_image: IMulterFileDTO;
}



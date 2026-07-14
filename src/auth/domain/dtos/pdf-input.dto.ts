

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
    contract_code: string;
    step_contract: number;
    contract_pdf: IMulterFileDTO;
    // contract_image: IMulterFileDTO;
}



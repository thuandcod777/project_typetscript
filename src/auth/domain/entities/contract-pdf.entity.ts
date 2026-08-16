
export interface IContractPdfJSON {
    name: string;
    buffer: Buffer;
    mime_type: string;
}


export class ContractPdf {
    name: string;
    buffer: Buffer;
    mime_type: string;

    constructor({
        name = "untitled.pdf",
        buffer = Buffer.alloc(0), // Khởi tạo buffer rỗng
        mime_type = "application/pdf"
    }: Partial<IContractPdfJSON> = {}) {
        this.name = name;
        this.buffer = buffer;
        this.mime_type = mime_type;
    }

    static fromJson(json: IContractPdfJSON): ContractPdf {
        return new ContractPdf(json)
    }
}
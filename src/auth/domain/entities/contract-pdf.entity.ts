
export interface IContractPdfJSON {
    id: string;
    name: string;
    buffer: Buffer;
    mime_type: string;
}


export class ContractPdf {
    id: string;
    name: string;
    buffer: Buffer;
    mime_type: string;

    constructor({
        id = "",
        name = "untitled.pdf",
        buffer = Buffer.alloc(0), // Khởi tạo buffer rỗng
        mime_type = "application/pdf"
    }: {
        id?: string;
        name?: string;
        buffer?: Buffer;
        mime_type?: string;
    } = {}) {
        this.id = id;
        this.name = name;
        this.buffer = buffer;
        this.mime_type = mime_type;
    }

    static fromJson(json: IContractPdfJSON): ContractPdf {
        return new ContractPdf({
            id: json.id,
            name: json.name,
            buffer: json.buffer,
            mime_type: json.mime_type
        })
    }
}
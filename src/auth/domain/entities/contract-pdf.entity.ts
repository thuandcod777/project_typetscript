
export interface IContractPdfJSON {
    id: string;
    name: string;
    data: Buffer;
    contentType: string;
}


export class ContractPdf {
    id: string;
    name: string;
    data: Buffer;
    contentType: string;

    constructor({
        id = "",
        name = "untitled.pdf",
        data = Buffer.alloc(0), // Khởi tạo buffer rỗng
        contentType = "application/pdf"
    }: {
        id?: string;
        name?: string;
        data?: Buffer;
        contentType?: string;
    } = {}) {
        this.id = id;
        this.name = name;
        this.data = data;
        this.contentType = contentType;
    }

    static fromJson(json: IContractPdfJSON): ContractPdf {
        return new ContractPdf({
            id: json.id,
            name: json.name,
            data: json.data,
            contentType: json.contentType
        })
    }
}
import { z } from "zod";
import CreateContractUsecase from "../../../usecase/create_contract_usecase";
import { Request, Response } from 'express';
import { body } from "express-validator";
import fs from 'fs/promises';
import VerifyContractUsecase from "../../../usecase/verify_contract_usecase";
import { Contract } from "../../../domain/entities/contract.entity";
import { ContractDetails } from "../../../domain/entities/contract-details.entity";
import { IOrderInputDTO } from "../../../domain/dtos/order_input.dto";
import { IContractDetailsInputDTO } from "../../../domain/dtos/contract_details_input.dto";
import { IEmailInputDTO } from "../../../domain/dtos/email_input.dto";


const CONTRACT_STATUSES = ['registered', 'note scope', 'agree', 'finished'] as const;

const flexibleNumberSchema = z.number().or(z.string()).transform((val) => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.trim() === '') return 0;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 0 : parsed;
});

// Tự động chuyển đổi từ String/Boolean về Boolean (Ví dụ: "true" -> true)
const flexibleBooleanSchema = z.boolean().or(z.string()).transform((val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'string') return val.toLowerCase() === 'true';
    return false;
});

// 1. Zod Schema để validate cấu trúc TEXT nhận từ Flutter
const ContractSchema: z.ZodType<IContractDetailsInputDTO> = z.object({
    email: z.string(),
    nameBrandA: z.string(), // Cập nhật lại theo tên biến mới của bạn
    nameBrandB: z.string(),
    numberPhone: flexibleNumberSchema.default(0),
    businessRegisterNumber: flexibleNumberSchema.default(0),
    numberContract: flexibleNumberSchema.default(0),
    nameProduct: z.string(),
    typeWeight: z.string(),
    typeProduct: z.string(),
    addressStart: z.string(),
    addressEnd: z.string(),
    methodContract: z.string(),
    methodDelivery: z.string(),
    methodPayment: z.string(),
}).strict();


const EmailSchema: z.ZodType<IEmailInputDTO> = z.object({
    email: z.string()
}).strict();


export default class ContractController {
    private readonly createContractUsecase: CreateContractUsecase;
    private readonly verifyContractUsecase: VerifyContractUsecase;
    constructor(createContractUsecase: CreateContractUsecase, verifyContractUsecase: VerifyContractUsecase) {
        this.createContractUsecase = createContractUsecase,
            this.verifyContractUsecase = verifyContractUsecase
    }

    public async verifyContract(req: Request, res: Response) {
        const safeEmailData = EmailSchema.parse(req.body);
        await this.verifyContractUsecase.execute(safeEmailData);
        return res.status(200).json({ isSuccess: true, message: "Đăng ký thành công" });
    }

    public async createContract(req: Request, res: Response) {
        // const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        // // 1. Kiểm tra file hợp lệ
        // // if (!files || !files['contract_pdf'] || !files['contract_image']) {
        // //     return res.status(400).json({ isSuccess: false, message: "Thiếu file PDF hoặc file Ảnh!" });
        // // }
        // if (!req.body.contractData) {
        //     return res.status(400).json({ isSuccess: false, message: "Thiếu thông tin contractData!" });
        // }

        // const pdfFile = files!['contract_pdf'][0];

        // // 2. Lấy dữ liệu Bytes (Buffer) của file PDF
        // let pdfBuffer: Buffer;

        // if (pdfFile.buffer) {
        //     // Nếu cấu hình Multer dùng memoryStorage()
        //     pdfBuffer = pdfFile.buffer;
        // } else {
        //     // Nếu cấu hình Multer dùng diskStorage() -> Phải đọc file vừa lưu từ ổ cứng lên thành Bytes
        //     pdfBuffer = await fs.readFile(pdfFile.path);
        // }

        const safeEmailData = EmailSchema.parse(req.body);

        const safeStepContractData = ContractSchema.parse(req.body);


        // const preparePdfData = {
        //     name: files!.name[0].originalname,
        //     data: files!.data[0].buffer,
        //     contentType: files!.contentType[0].mimetype
        // };

        // const stepContractModel = new StepContract({
        //     contractDetails: contractModel,
        //     contractPdf: preparePdfData
        // });

        await this.createContractUsecase.execute(safeEmailData, safeStepContractData);
        return res.status(200).json({ isSuccess: true, message: "Đăng ký thành công" });
    }
}
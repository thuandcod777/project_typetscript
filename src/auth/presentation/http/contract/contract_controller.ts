import { z } from "zod";
import { Request, Response } from 'express';
import { IContractDetailsInputDTO } from "../../../domain/dtos/contract_details_input.dto";
import UploadPdfUsecase from "../../../usecase/upload_pdf_usecase";
import { IMulterFileDTO, IUploadPdfDTO } from "../../../domain/dtos/pdf-input.dto";
import { ICreateContractInputDTO } from "../../../domain/dtos/verify_contract_input";
import GetContractUsecase from "../../../usecase/get_contract_usecase";
import CreateContractUsecase from "../../../usecase/create_contract_usecase";

const ContractDetailsSchema: z.ZodType<IContractDetailsInputDTO> = z.object({
    number_contract: z.string(),
    name_client_a: z.string(),
    name_business_owner_b: z.string(),
    name_enterprise_a: z.string(),
    name_enterprise_b: z.string(),
    business_register_number_a: z.string(),
    business_register_number_b: z.string(),
    name_product: z.string(),
    type_weight: z.string(),
    type_product: z.string(),
    pickup_location: z.string(),
    delivery_location: z.string(),
    method_contract: z.string(),
    method_delivery: z.string(),
    method_payment: z.string(),
}).strict();

const contractSchema: z.ZodType<ICreateContractInputDTO> = z.object({
    email: z.string(),
    contract_code: z.string(),
    step_contract: z.number()
}).strict();

const MulterFileSchema: z.ZodType<IMulterFileDTO> = z.object({
    fieldname: z.string(),
    originalname: z.string(),
    encoding: z.string(),
    mimetype: z.string().refine((val) => val === 'application/pdf', {
        message: "Chỉ chấp nhận file định dạng PDF",
    }),
    size: z.number().max(10 * 1024 * 1024, "File không được quá 10MB"),
    buffer: z.any().optional(),
    path: z.string().optional(),
});

const UploadPdfSchema: z.ZodType<IUploadPdfDTO> = z.object({
    contract_data: z.preprocess((val) => {
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            } catch {
                return val;
            }
        }
        return val;
    }, z.object({
        user_id: z.string().min(1, "Mã hợp đồng không được để trống")
    })),
    step_contract: z.coerce.number({ message: "Vui lòng nhập một số hợp lệ" }),
    contract_details: z.preprocess((val) => {
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return val; }
        } return val;
    }, ContractDetailsSchema),
    contract_pdf: MulterFileSchema
}).transform((data) => ({
    user_id: data.contract_data.user_id,
    step_contract: data.step_contract,
    contract_details: data.contract_details,
    contract_pdf: data.contract_pdf as IMulterFileDTO
}));


export default class ContractController {
    private readonly createContractUsecase: CreateContractUsecase;
    private readonly getContractUsecase: GetContractUsecase;
    private readonly uploadContractUsecase: UploadPdfUsecase;
    constructor(createContractUsecase: CreateContractUsecase, getContractUsecase: GetContractUsecase, uploadContractUsecase: UploadPdfUsecase) {
        this.createContractUsecase = createContractUsecase,
            this.getContractUsecase = getContractUsecase,
            this.uploadContractUsecase = uploadContractUsecase
    }

    public async createContract(req: Request, res: Response) {
        const safeContractDetailsData = contractSchema.parse(req.body);

        const result = await this.createContractUsecase.execute(safeContractDetailsData.email, safeContractDetailsData.contract_code, safeContractDetailsData.step_contract);
        return res.status(result.status).json({ data: { success: result.success, message: result.message } });
    }

    public async getContract(req: Request, res: Response) {
        const { email } = req.body;
        const result = await this.getContractUsecase.execute(email);
        return res.status(result.status).json({ data: { success: result.success, contract: result.data, message: result.message } });
    }

    public async uploadPdf(req: Request, res: Response) {
        try {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

            // Lấy file đầu tiên trong mảng contract_pdf (nếu có)
            const contractPdfFile = files?.['contract_pdf']?.[0];

            const formData = {
                contract_data: req.body.contract_data,
                step_contract: req.body.step_contract,
                contract_details: req.body.contract_details,
                contract_pdf: contractPdfFile
            };

            const safeDataPdf = UploadPdfSchema.parse(formData);

            const result = await this.uploadContractUsecase.execute(safeDataPdf);

            return res.status(result.status).json({ data: { success: result.success, message: result.message } });
        } catch (error: any) {
            console.error(">>> REAL ERROR STACK:", error);
            if (error.errors) {
                return res.status(400).json({ success: false, message: error.errors[0]?.message });
            }
            return res.status(500).json({ success: false, message: "Lỗi xử lý file" });
        }

    }
}
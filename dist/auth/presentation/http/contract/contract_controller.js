"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const ContractDetailsSchema = zod_1.z.object({
    number_contract: zod_1.z.string(),
    name_client_a: zod_1.z.string(),
    name_business_owner_b: zod_1.z.string(),
    name_enterprise_a: zod_1.z.string(),
    name_enterprise_b: zod_1.z.string(),
    business_register_number_a: zod_1.z.string(),
    business_register_number_b: zod_1.z.string(),
    name_product: zod_1.z.string(),
    type_weight: zod_1.z.string(),
    type_product: zod_1.z.string(),
    pickup_location: zod_1.z.string(),
    delivery_location: zod_1.z.string(),
    method_contract: zod_1.z.string(),
    method_delivery: zod_1.z.string(),
    method_payment: zod_1.z.string(),
}).strict();
const contractSchema = zod_1.z.object({
    email: zod_1.z.string(),
    contract_code: zod_1.z.string(),
    step_contract: zod_1.z.number()
}).strict();
const MulterFileSchema = zod_1.z.object({
    fieldname: zod_1.z.string(),
    originalname: zod_1.z.string(),
    encoding: zod_1.z.string(),
    mimetype: zod_1.z.string().refine((val) => val === 'application/pdf', {
        message: "Chỉ chấp nhận file định dạng PDF",
    }),
    size: zod_1.z.number().max(10 * 1024 * 1024, "File không được quá 10MB"),
    buffer: zod_1.z.any().optional(),
    path: zod_1.z.string().optional(),
});
const UploadPdfSchema = zod_1.z.object({
    contract_data: zod_1.z.preprocess((val) => {
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            }
            catch {
                return val;
            }
        }
        return val;
    }, zod_1.z.object({
        user_id: zod_1.z.string().min(1, "Mã hợp đồng không được để trống")
    })),
    step_contract: zod_1.z.coerce.number({ message: "Vui lòng nhập một số hợp lệ" }),
    contract_details: zod_1.z.preprocess((val) => {
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            }
            catch {
                return val;
            }
        }
        return val;
    }, ContractDetailsSchema),
    contract_pdf: MulterFileSchema
}).transform((data) => ({
    user_id: data.contract_data.user_id,
    step_contract: data.step_contract,
    contract_details: data.contract_details,
    contract_pdf: data.contract_pdf
}));
class ContractController {
    createContractUsecase;
    getContractUsecase;
    uploadContractUsecase;
    constructor(createContractUsecase, getContractUsecase, uploadContractUsecase) {
        this.createContractUsecase = createContractUsecase,
            this.getContractUsecase = getContractUsecase,
            this.uploadContractUsecase = uploadContractUsecase;
    }
    async createContract(req, res) {
        const safeContractDetailsData = contractSchema.parse(req.body);
        const result = await this.createContractUsecase.execute(safeContractDetailsData.email, safeContractDetailsData.contract_code, safeContractDetailsData.step_contract);
        return res.status(result.status).json({ data: { success: result.success, message: result.message } });
    }
    async getContract(req, res) {
        const { email } = req.body;
        const result = await this.getContractUsecase.execute(email);
        return res.status(result.status).json({ data: { success: result.success, contract: result.data, message: result.message } });
    }
    async uploadPdf(req, res) {
        try {
            const files = req.files;
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
        }
        catch (error) {
            console.error(">>> REAL ERROR STACK:", error);
            if (error.errors) {
                return res.status(400).json({ success: false, message: error.errors[0]?.message });
            }
            return res.status(500).json({ success: false, message: "Lỗi xử lý file" });
        }
    }
}
exports.default = ContractController;

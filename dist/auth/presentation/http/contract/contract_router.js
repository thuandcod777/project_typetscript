"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractUploadMiddleware = void 0;
const express_1 = require("express");
const contract_controller_1 = __importDefault(require("./contract_controller"));
const multer_1 = __importDefault(require("multer"));
const upload_pdf_usecase_1 = __importDefault(require("../../../usecase/upload_pdf_usecase"));
const get_contract_usecase_1 = __importDefault(require("../../../usecase/get_contract_usecase"));
const create_contract_usecase_1 = __importDefault(require("../../../usecase/create_contract_usecase"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 16 * 1024 * 1024 // Giới hạn tối đa 16MB
    },
    fileFilter: (req, file, cb) => {
        // 1. Kiểm tra filter riêng cho từng trường fieldname
        if (file.fieldname === 'contract_pdf') {
            if (file.mimetype === 'application/pdf') {
                return cb(null, true);
            }
            return cb(new Error('File hợp đồng bắt buộc phải là định dạng PDF!'));
        }
        // if (file.fieldname === 'contract_image') {
        //     const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        //     if (allowedImageTypes.includes(file.mimetype)) {
        //         return cb(null, true);
        //     }
        //     return cb(new Error('File ảnh hợp đồng phải thuộc định dạng JPG, PNG hoặc WEBP!'));
        // }
        // 2. Từ chối nếu client gửi lên một fieldname lạ không định nghĩa
        return cb(new Error('Trường tải lên không hợp lệ!'));
    }
});
// Khai báo chính xác middleware nhận diện đa trường (fields)
exports.contractUploadMiddleware = upload.fields([
    { name: 'contract_pdf', maxCount: 1 },
    // { name: 'contract_image', maxCount: 1 }
]);
class ContractRouter {
    static configure(authRepository, contractRepository) {
        const router = (0, express_1.Router)();
        let controller = ContractRouter.composeController(authRepository, contractRepository);
        router.post('/createcontract', (req, res) => controller.createContract(req, res));
        router.post('/getcontract', (req, res) => controller.getContract(req, res));
        router.post('/upload', exports.contractUploadMiddleware, (req, res) => controller.uploadPdf(req, res));
        return router;
    }
    static composeController(authRepository, contractRepository) {
        const createContractUsecase = new create_contract_usecase_1.default(authRepository, contractRepository);
        const getContractUsecase = new get_contract_usecase_1.default(authRepository, contractRepository);
        const uploadPdfUsecase = new upload_pdf_usecase_1.default(contractRepository);
        const controller = new contract_controller_1.default(createContractUsecase, getContractUsecase, uploadPdfUsecase);
        return controller;
    }
}
exports.default = ContractRouter;

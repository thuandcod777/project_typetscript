import { Router, Request, Response } from "express";
import IAuthRepository from "../../../domain/services/iauth_repository";
import IContractRepository from "../../../domain/services/icontract_repository";
import CreateContractUsecase from "../../../usecase/verify_contract_usecase";
import ContractController from "./contract_controller";
import ContractRepository from "../../../data/repository/contract_repository";
import { uploadFieldsMiddleware } from "../../middleware/upload_middleware";
import multer from "multer";
import VerifyContractUsecase from "../../../usecase/create_contract_usecase";
import UploadPdfUsecase from "../../../usecase/upload_pdf_usecase";
import GetContractUsecase from "../../../usecase/get_contract_usecase";

const storage = multer.memoryStorage();

const upload = multer({
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
export const contractUploadMiddleware = upload.fields([
    { name: 'contract_pdf', maxCount: 1 },
    // { name: 'contract_image', maxCount: 1 }
]);
export default class ContractRouter {
    public static configure(contractRepository: ContractRepository): Router {
        const router = Router();

        let controller = ContractRouter.composeController(
            contractRepository
        )

        router.post('/createcontract', (req: Request, res: Response) => controller.createContract(req, res));
        router.post('/getcontract', (req: Request, res: Response) => controller.getContract(req, res));
        router.post('/verifycontract', (req: Request, res: Response) => controller.verifyContract(req, res));
        router.post('/upload', contractUploadMiddleware, (req: Request, res: Response) => controller.uploadPdf(req, res));

        return router;
    }

    private static composeController(contractRepository: IContractRepository) {
        const createContractUsecase = new CreateContractUsecase(contractRepository);
        const getContractUsecase = new GetContractUsecase(contractRepository);
        const verifyContractUsecase = new VerifyContractUsecase(contractRepository);
        const uploadPdfUsecase = new UploadPdfUsecase(contractRepository);
        const controller = new ContractController(createContractUsecase, getContractUsecase, verifyContractUsecase, uploadPdfUsecase);

        return controller;
    }
}
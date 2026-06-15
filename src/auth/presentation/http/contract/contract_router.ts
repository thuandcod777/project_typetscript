import { Router, Request, Response } from "express";
import IAuthRepository from "../../../domain/services/iauth_repository";
import IContractRepository from "../../../domain/services/icontract_repository";
import CreateContractUsecase from "../../../usecase/create_contract_usecase";
import ContractController from "./contract_controller";
import ContractRepository from "../../../data/repository/contract_repository";
import { uploadFieldsMiddleware } from "../../middleware/upload_middleware";
import multer from "multer";
import VerifyContractUsecase from "../../../usecase/verify_contract_usecase";

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage, limits: {
        fileSize: 16 * 1024 * 1024 // Giới hạn tối đa 16MB theo cấu trúc document của MongoDB
    }, fileFilter: (req, file, cb) => {
        // Kiểm tra định dạng file gửi lên có phải là PDF hay không
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận định dạng tệp tin .pdf!'));
        }
    }
})

export default class ContractRouter {
    public static configure(contractRepository: ContractRepository): Router {
        const router = Router();

        let controller = ContractRouter.composeController(
            contractRepository
        )

        router.post('/createcontract', upload.single('pdf'), (req: Request, res: Response) => controller.createContract(req, res));
        router.post('/verifycontract', (req: Request, res: Response) => controller.verifyContract(req, res));
        return router;
    }

    private static composeController(contractRepository: IContractRepository) {
        const createContractUsecase = new CreateContractUsecase(contractRepository);
        const verifyContractUsecase = new VerifyContractUsecase(contractRepository);
        const controller = new ContractController(createContractUsecase, verifyContractUsecase);

        return controller;
    }
}
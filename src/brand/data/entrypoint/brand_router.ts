import { Router, Request, Response } from "express";
import IBrandRepository from "../../domain/ibrand_repository";
import BrandController from "./brand_controller";
import BrandUsecase from "../../usecase/brand_use_case";
import BookBrandUsecase from "../../usecase/book_brand_usecase";
import SaveBrandUsecase from "../../usecase/save_brand_usecase";

export default class BrandRouter {
    public static configure(brandRepository: IBrandRepository): Router {
        const router = Router();

        let controller = BrandRouter.composeController(brandRepository);

        router.get('/getbrand', (req: Request, res: Response) => controller.get_brand(req, res));
        router.post('/bookbrand', (req: Request, res: Response) => controller.book_brand(req, res));
        router.post('/savebrand', (req: Request, res: Response) => controller.save_brand(req, res));

        return router;
    }

    private static composeController(brandRepository: IBrandRepository): BrandController {
        const brand = new BrandUsecase(brandRepository);
        const bookBrand = new BookBrandUsecase(brandRepository);
        const saveBrand = new SaveBrandUsecase(brandRepository);
        const controller = new BrandController(brand, bookBrand, saveBrand)
        return controller;
    }

}
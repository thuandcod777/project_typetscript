"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brand_controller_1 = __importDefault(require("./brand_controller"));
const brand_use_case_1 = __importDefault(require("../../../usecase/brand_use_case"));
const book_brand_usecase_1 = __importDefault(require("../../../usecase/book_brand_usecase"));
const save_brand_usecase_1 = __importDefault(require("../../../usecase/save_brand_usecase"));
class BrandRouter {
    static configure(brandRepository) {
        const router = (0, express_1.Router)();
        let controller = BrandRouter.composeController(brandRepository);
        router.get('/getallbrand', (req, res) => controller.get_brand(req, res));
        router.post('/booking', (req, res) => controller.booking(req, res));
        router.post('/savebrand', (req, res) => controller.save_brand(req, res));
        return router;
    }
    static composeController(brandRepository) {
        const brand = new brand_use_case_1.default(brandRepository);
        const bookBrand = new book_brand_usecase_1.default(brandRepository);
        const saveBrand = new save_brand_usecase_1.default(brandRepository);
        const controller = new brand_controller_1.default(brand, bookBrand, saveBrand);
        return controller;
    }
}
exports.default = BrandRouter;

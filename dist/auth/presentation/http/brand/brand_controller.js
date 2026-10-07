"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandSchema = exports.ProductBrandSchema = void 0;
const zod_1 = require("zod");
const BookBrandSchema = zod_1.z.object({
    nameBrand: zod_1.z.string(),
    bookCode: zod_1.z.string(),
    name: zod_1.z.string(),
    numberPhone: zod_1.z.string(),
    address: zod_1.z.string(),
    nameProduct: zod_1.z.string(),
    amount: zod_1.z.number(),
    type: zod_1.z.string(),
    status: zod_1.z.string(),
}).strict();
exports.ProductBrandSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(1, "Tên sản phẩm không được để trống"),
    amount: zod_1.z.number().int().nonnegative("Số lượng phải là số nguyên dương"),
    type: zod_1.z.string().min(1, "Loại sản phẩm không được để trống"),
    description: zod_1.z.string()
}).strict();
exports.BrandSchema = zod_1.z.object({
    nameBrand: zod_1.z.string().trim().min(1, "Tên thương hiệu không được để trống"),
    product: zod_1.z.array(exports.ProductBrandSchema),
}).strict();
class BrandController {
    brandUsecase;
    bookBrandUsecase;
    saveBrandUsecase;
    constructor(brandUsecase, bookBrandUsecase, saveBrandUsecase) {
        this.brandUsecase = brandUsecase, this.bookBrandUsecase = bookBrandUsecase, this.saveBrandUsecase = saveBrandUsecase;
    }
    async get_brand(req, res) {
        const isSuccess = await this.brandUsecase.execute();
        return res.status(200).json({ data: { isSuccess: isSuccess, status: "Lấy dữ liệu thương hiệu và sản phẩm thành công" } });
    }
    async save_brand(req, res) {
        const safeDataBrand = exports.BrandSchema.parse(req.body);
        // const products = safeDataBrand.product.map((item) => new ProductBrand(item.name, item.amount, item.type));
        // const data = new Brand(safeDataBrand.nameBrand, products);
        const isSuccess = await this.saveBrandUsecase.execute(safeDataBrand);
        return res.status(200).json({ data: { isSuccess: isSuccess, status: "Đăng ký thương hiệu thành công" } });
    }
    async booking(req, res) {
        const safeDataBookBrand = BookBrandSchema.parse(req.body);
        const nameBrandDTO = { nameBrand: safeDataBookBrand.nameBrand };
        const bookDataDTO = { ...safeDataBookBrand };
        const isSuccess = await this.bookBrandUsecase.execute(nameBrandDTO, bookDataDTO);
        return res.status(200).json({ data: { isSuccess: isSuccess, status: "Đặt đơn hàng sản phẩm thành công" } });
    }
}
exports.default = BrandController;

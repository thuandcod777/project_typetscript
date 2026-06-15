import { z } from "zod";
import BookBrandUsecase from "../../../usecase/book_brand_usecase";
import BrandUsecase from "../../../usecase/brand_use_case";
import { type Request, type Response } from "express";
import SaveBrandUsecase from "../../../usecase/save_brand_usecase";
import { IBookBrandInputDTO } from "../../../domain/dtos/book-brand-input.dto";
import { IProductBrandInputDTO } from "../../../domain/dtos/product-brand-input.dto";
import { IBrandInputDTO } from "../../../domain/dtos/brand-input.dto";

const BookBrandSchema: z.ZodType<IBookBrandInputDTO> = z.object({
    bookCode: z.string(),
    name: z.string(),
    numberPhone: z.number(),
    address: z.string(),
    nameProduct: z.string(),
    amount: z.number(),
    type: z.string(),
    status: z.string(),
}).strict();



export const ProductBrandSchema: z.ZodType<IProductBrandInputDTO> = z.object({
    name: z.string().trim().min(1, "Tên sản phẩm không được để trống"),
    amount: z.number().int().nonnegative("Số lượng phải là số nguyên dương"),
    type: z.string().min(1, "Loại sản phẩm không được để trống"),
});



export const BrandSchema: z.ZodType<IBrandInputDTO> = z.object({
    nameBrand: z.string().trim().min(1, "Tên thương hiệu không được để trống"),
    product: z.array(ProductBrandSchema),
});

export default class BrandController {
    private readonly brandUsecase: BrandUsecase;
    private readonly bookBrandUsecase: BookBrandUsecase;
    private readonly saveBrandUsecase: SaveBrandUsecase;

    constructor(brandUsecase: BrandUsecase, bookBrandUsecase: BookBrandUsecase, saveBrandUsecase: SaveBrandUsecase) {
        this.brandUsecase = brandUsecase, this.bookBrandUsecase = bookBrandUsecase, this.saveBrandUsecase = saveBrandUsecase
    }

    public async get_brand(req: Request, res: Response) {
        const isSuccess = await this.brandUsecase.execute();
        return res.status(200).json({ data: { isSuccess: isSuccess, status: "Lấy dữ liệu thương hiệu và sản phẩm thành công" } });

    }

    public async save_brand(req: Request, res: Response) {
        const safeDataBrand = BrandSchema.parse(req.body);
        // const products = safeDataBrand.product.map((item) => new ProductBrand(item.name, item.amount, item.type));
        // const data = new Brand(safeDataBrand.nameBrand, products);
        const isSuccess = await this.saveBrandUsecase.execute(safeDataBrand);
        return res.status(200).json({ data: { isSuccess: isSuccess, status: "Đăng ký thương hiệu thành công" } });

    }

    public async book_brand(req: Request, res: Response) {

        const safeDataBookBrand = BookBrandSchema.parse(req.body);

        const isSuccess = await this.bookBrandUsecase.execute(safeDataBookBrand);
        return res.status(200).json({ data: { isSuccess: isSuccess, status: "Đặt đơn hàng sản phẩm thành công" } });

    }
}
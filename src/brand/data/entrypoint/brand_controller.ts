import { z } from "zod";
import BookBrandUsecase from "../../usecase/book_brand_usecase";
import BrandUsecase from "../../usecase/brand_use_case";
import { type Request, type Response } from "express";
import { BookModel, BrandModel, ProductModel } from "../../domain/brand_model";
import { IBookProduct, IBrand } from "../models/brand_model";
import SaveBrandUsecase from "../../usecase/save_brand_usecase";

const BookBrandSchema = z.object({
    bookCode: z.string(),
    name: z.string(),
    numberPhone: z.number(),
    address: z.string(),
    nameProduct: z.string(),
    amount: z.number(),
    type: z.string(),
    status: z.string(),
}).strict();

type iBookBrandModel = z.infer<typeof BookBrandSchema>


export const ProductZodSchema = z.object({
    name: z.string().trim().min(1, "Tên sản phẩm không được để trống"),
    amount: z.number().int().nonnegative("Số lượng phải là số nguyên dương"),
    type: z.string().min(1, "Loại sản phẩm không được để trống"),
});

export type IProductZod = z.infer<typeof ProductZodSchema>;


export const BrandZodSchema = z.object({

    nameBrand: z.string().trim().min(1, "Tên thương hiệu không được để trống"),
    product: z.array(ProductZodSchema).optional(),
}).transform((data) => {
    // Hàm transform này hoạt động giống như phương thức 'fromJson' của bạn
    return {
        nameBrand: data.nameBrand,
        product: data.product || [],

    };
});

// Định nghĩa Type đầu ra sau khi đã được chuẩn hóa qua hàm transform
export type IBrandZod = z.infer<typeof BrandZodSchema>;

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
        const safeDataBrand: IBrandZod = BrandZodSchema.parse(req.body);
        const products = safeDataBrand.product.map((item) => new ProductModel(item.name, item.amount, item.type));
        const data = new BrandModel(safeDataBrand.nameBrand, products);
        const isSuccess = await this.saveBrandUsecase.execute(data);
        return res.status(200).json({ data: { isSuccess: isSuccess, status: "Đăng ký thương hiệu thành công" } });

    }

    public async book_brand(req: Request, res: Response) {

        const safeDataBookBrand: iBookBrandModel = BookBrandSchema.parse(req.body);
        const data = new BookModel({
            name: safeDataBookBrand.name,
            address: safeDataBookBrand.address,
            amount: safeDataBookBrand.amount,
            bookCode: safeDataBookBrand.bookCode,
            nameProduct: safeDataBookBrand.nameProduct,
            numberPhone: safeDataBookBrand.numberPhone,
            status: safeDataBookBrand.status,
            type: safeDataBookBrand.type,
        });
        const isSuccess = await this.bookBrandUsecase.execute(data);
        return res.status(200).json({ data: { isSuccess: isSuccess, status: "Đặt đơn hàng sản phẩm thành công" } });

    }
}
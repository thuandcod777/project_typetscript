import { BookModel, BrandModel } from "./brand_model";

export default interface IBrandRepository {
    saveBrand(brandData: BrandModel): Promise<boolean>;
    getBrand(): Promise<boolean>;
    bookProductOfBrand(bookData: BookModel): Promise<boolean>;
}
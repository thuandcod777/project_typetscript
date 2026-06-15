import { IBookBrandInputDTO } from "../dtos/book-brand-input.dto";
import { IBrandInputDTO } from "../dtos/brand-input.dto";

export default interface IBrandRepository {
    saveBrand(brandData: IBrandInputDTO): Promise<boolean>;
    getBrand(): Promise<boolean>;
    bookProductOfBrand(bookData: IBookBrandInputDTO): Promise<boolean>;
}
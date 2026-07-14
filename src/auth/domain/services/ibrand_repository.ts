import { IBookBrandInputDTO } from "../dtos/book-brand-input.dto";
import { IBrandInputDTO } from "../dtos/brand-input.dto";
import { INameBrandInputDTO } from "../dtos/name-brand-input.dto";

export default interface IBrandRepository {
    saveBrand(brandData: IBrandInputDTO): Promise<boolean>;
    getAllBrand(): Promise<boolean>;
    booking(nameBrand: INameBrandInputDTO, bookData: IBookBrandInputDTO): Promise<boolean>;
}
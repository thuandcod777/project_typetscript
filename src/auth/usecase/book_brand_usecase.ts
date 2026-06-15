import { IBookBrandInputDTO } from "../domain/dtos/book-brand-input.dto";
import IBrandRepository from "../domain/services/ibrand_repository";

export default class BookBrandUsecase {
    constructor(private bookBrandRepository: IBrandRepository) {

    }

    public async execute(bookData: IBookBrandInputDTO): Promise<boolean> {
        const data = await this.bookBrandRepository.bookProductOfBrand(bookData);
        return true;
    }
}
import { BookModel } from "../domain/brand_model";
import IBrandRepository from "../domain/ibrand_repository";

export default class BookBrandUsecase {
    constructor(private bookBrandRepository: IBrandRepository) {

    }

    public async execute(bookData: BookModel): Promise<boolean> {
        const data = await this.bookBrandRepository.bookProductOfBrand(bookData);
        return true;
    }
}
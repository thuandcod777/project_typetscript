import { IBookBrandInputDTO } from "../domain/dtos/book-brand-input.dto";
import { INameBrandInputDTO } from "../domain/dtos/name-brand-input.dto";
import IBrandRepository from "../domain/services/ibrand_repository";

export default class BookBrandUsecase {
    constructor(private bookBrandRepository: IBrandRepository) { }

    public async execute(nameBrand: INameBrandInputDTO, bookData: IBookBrandInputDTO): Promise<boolean> {
        const data = await this.bookBrandRepository.booking(nameBrand, bookData);
        if (!data) {
            throw new Error('Đặt sản phẩm thất bại');
        }
        return data;
    }
}
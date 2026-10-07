"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BookBrandUsecase {
    bookBrandRepository;
    constructor(bookBrandRepository) {
        this.bookBrandRepository = bookBrandRepository;
    }
    async execute(nameBrand, bookData) {
        const data = await this.bookBrandRepository.booking(nameBrand, bookData);
        if (!data) {
            throw new Error('Đặt sản phẩm thất bại');
        }
        return data;
    }
}
exports.default = BookBrandUsecase;

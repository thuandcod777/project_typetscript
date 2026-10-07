"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BrandUsecase {
    brandRepository;
    constructor(brandRepository) {
        this.brandRepository = brandRepository;
    }
    async execute() {
        const result = await this.brandRepository.getAllBrand();
        if (!result) {
            throw new Error('Lấy tất cả danh sách thất bại');
        }
        return result;
    }
}
exports.default = BrandUsecase;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SaveBrandUsecase {
    saveBrandRepository;
    constructor(saveBrandRepository) {
        this.saveBrandRepository = saveBrandRepository;
    }
    async execute(brandData) {
        const data = await this.saveBrandRepository.saveBrand(brandData);
        if (!data) {
            throw new Error('Lưu thông tin thương hiệu thất bại');
        }
        return true;
    }
}
exports.default = SaveBrandUsecase;

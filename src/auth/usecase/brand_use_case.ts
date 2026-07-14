import IBrandRepository from "../domain/services/ibrand_repository";

export default class BrandUsecase {
    constructor(private brandRepository: IBrandRepository) { }

    public async execute(): Promise<boolean> {
        const result = await this.brandRepository.getAllBrand();
        if (!result) {
            throw new Error('Lấy tất cả danh sách thất bại');
        }
        return result;
    }
}
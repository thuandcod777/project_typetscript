import { IBrandInputDTO } from "../domain/dtos/brand-input.dto";
import IBrandRepository from "../domain/services/ibrand_repository";

export default class SaveBrandUsecase {
    constructor(private saveBrandRepository: IBrandRepository) { }

    public async execute(brandData: IBrandInputDTO): Promise<boolean> {
        const data = await this.saveBrandRepository.saveBrand(brandData);

        if (!data) {
            throw new Error('Lưu thông tin thương hiệu thất bại');
        }

        return true;
    }
}
import { BrandModel } from "../domain/brand_model";
import IBrandRepository from "../domain/ibrand_repository";

export default class SaveBrandUsecase {
    constructor(private saveBrandRepository: IBrandRepository) {

    }

    public async execute(brandData: BrandModel): Promise<boolean> {
        const data = await this.saveBrandRepository.saveBrand(brandData);
        return true;
    }
}
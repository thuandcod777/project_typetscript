import IBrandRepository from "../domain/ibrand_repository";

export default class BrandUsecase {
    constructor(private brandRepository: IBrandRepository) { }

    public async execute(): Promise<boolean> {
        const data = await this.brandRepository.getBrand();
        console.log("brand data", data)
        return true;
    }
}
import { Mongoose } from "mongoose";
import IBrandRepository from "../../domain/services/ibrand_repository";
import { IBrandInputDTO } from "../../domain/dtos/brand-input.dto";
import { BrandSchema } from "../../presentation/http/brand/brand_controller";
import { IBookBrandInputDTO } from "../../domain/dtos/book-brand-input.dto";

export default class BrandRespoitory implements IBrandRepository {
    constructor(private readonly client: Mongoose) { }

    public async getBrand(): Promise<boolean> {
        const doc = this.client.model<IBrand>('brand', BrandSchema);

        const dataBrand = await doc.find({});

        if (!dataBrand || dataBrand.length === 0) {
            return false;
        }

        return true;
    }

    public async bookProductOfBrand(bookData: IBookBrandInputDTO): Promise<boolean> {
        const doc = this.client.model<IBookProduct>('book', BookProductSchema);

        const isSaved = await doc.create(bookData);

        return !!isSaved;
    }

    public async saveBrand(brandData: IBrandInputDTO): Promise<boolean> {
        const doc = this.client.model<IBrand>('brand', BrandSchema);

        const isSaved = await doc.create(brandData);

        return !!isSaved;
    }

}
import { Mongoose } from "mongoose";
import IBrandRepository from "../../domain/ibrand_repository";
import { BookProductSchema, BrandSchema, IBookProduct, IBrand } from "../models/brand_model";
import { BookModel, BrandModel } from "../../domain/brand_model";

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
    public async bookProductOfBrand(bookData: BookModel): Promise<boolean> {
        const doc = this.client.model<IBookProduct>('book', BookProductSchema);

        const isSaved = await doc.create(bookData);

        return !!isSaved;
    }
    public async saveBrand(brandData: BrandModel): Promise<boolean> {
        const doc = this.client.model<IBrand>('brand', BrandSchema);

        const isSaved = await doc.create(brandData);

        return !!isSaved;
    }

}
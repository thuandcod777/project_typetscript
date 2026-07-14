import { Mongoose } from "mongoose";
import { BookingSchema, BrandSchema, IBooking, IBrand, IProductBrand, ProductBrandSchema } from "../model/brand_model";
import { IBookBrandInputDTO } from "../../domain/dtos/book-brand-input.dto";
import { IBrandInputDTO } from "../../domain/dtos/brand-input.dto";
import IBrandRepository from "../../domain/services/ibrand_repository";
import { INameBrandInputDTO } from "../../domain/dtos/name-brand-input.dto";
import { Booking } from "../../domain/entities/brand.entity";

export default class BrandRespoitory implements IBrandRepository {
    constructor(private readonly client: Mongoose) { }

    public async getAllBrand(): Promise<boolean> {
        const doc = this.client.model<IBrand>('brand', BrandSchema);

        const dataBrand = await doc.find({});

        if (!dataBrand || dataBrand.length === 0) {
            return false;
        }

        return true;
    }

    public async booking(nameBrand: INameBrandInputDTO, bookData: IBookBrandInputDTO): Promise<boolean> {

        const brandModel = this.client.model<IBrand>('brand', BrandSchema);

        const productBrandModel = this.client.model<IBooking>('book', BookingSchema);

        const dbSession = await this.client.startSession();

        try {
            await dbSession.withTransaction(async () => {
                const brand = await brandModel.findOne({ nameBrand: nameBrand.nameBrand }).session(dbSession);

                const booking = new Booking(
                    {
                        brandId: brand?._id.toString(),
                        bookCode: bookData.bookCode,
                        name: bookData.name,
                        numberPhone: bookData.numberPhone,
                        address: bookData.address,
                        nameProduct: bookData.nameProduct,
                        amount: bookData.amount,
                        type: bookData.type,
                        status: bookData.status,
                    }
                );

                await dbSession.commitTransaction();

                await productBrandModel.create([booking], { session: dbSession });
            });

            return true;
        } catch (error) {
            console.error(`[DB Error] Lỗi cập nhật session:`, error);
            return false;
        } finally {
            await dbSession.endSession();
        }
    }

    public async saveBrand(brandData: IBrandInputDTO): Promise<boolean> {
        const doc = this.client.model<IBrand>('brand', BrandSchema);

        const isSaved = await doc.create(brandData);

        return !!isSaved;
    }

}
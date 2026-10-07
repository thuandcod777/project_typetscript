"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const brand_model_1 = require("../model/brand_model");
const brand_entity_1 = require("../../domain/entities/brand.entity");
class BrandRespoitory {
    client;
    constructor(client) {
        this.client = client;
    }
    async getAllBrand() {
        const doc = this.client.model('brand', brand_model_1.BrandSchema);
        const dataBrand = await doc.find({});
        if (!dataBrand || dataBrand.length === 0) {
            return false;
        }
        return true;
    }
    async booking(nameBrand, bookData) {
        const brandModel = this.client.model('brand', brand_model_1.BrandSchema);
        const productBrandModel = this.client.model('book', brand_model_1.BookingSchema);
        const dbSession = await this.client.startSession();
        try {
            await dbSession.withTransaction(async () => {
                const brand = await brandModel.findOne({ nameBrand: nameBrand.nameBrand }).session(dbSession);
                const booking = new brand_entity_1.Booking({
                    brandId: brand?._id.toString(),
                    bookCode: bookData.bookCode,
                    name: bookData.name,
                    numberPhone: bookData.numberPhone,
                    address: bookData.address,
                    nameProduct: bookData.nameProduct,
                    amount: bookData.amount,
                    type: bookData.type,
                    status: bookData.status,
                });
                await dbSession.commitTransaction();
                await productBrandModel.create([booking], { session: dbSession });
            });
            return true;
        }
        catch (error) {
            console.error(`[DB Error] Lỗi cập nhật session:`, error);
            return false;
        }
        finally {
            await dbSession.endSession();
        }
    }
    async saveBrand(brandData) {
        const doc = this.client.model('brand', brand_model_1.BrandSchema);
        const isSaved = await doc.create(brandData);
        return !!isSaved;
    }
}
exports.default = BrandRespoitory;

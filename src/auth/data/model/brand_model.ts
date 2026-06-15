import { Schema } from "mongoose";

export interface IBook {
    bookCode: string;
    name: string;
    numberPhone: String;
    address: string;
    nameProduct: string;
    amount: number;
    type: string;
    status: string;
}

const BookSchema = new Schema<IBook>({
    bookCode: { type: String, required: true },
    name: { type: String, required: true },
    numberPhone: { type: String, required: true },
    address: { type: String, required: true },
    nameProduct: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
}, { _id: true, timestamps: true });


export interface IProductBrand {
    name: string;
    amount: number;
    type: string;
}

const ProductBrandSchema = new Schema<IProductBrand>({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
});


export interface IBrand {
    nameBrand: string;
    product: IProductBrand[];
}

export const BrandSchema = new Schema({
    nameBrand: { type: String, required: true },
    product: { type: ProductBrandSchema, default: null }
}, { _id: true, timestamps: true });
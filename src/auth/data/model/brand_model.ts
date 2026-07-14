import mongoose, { Schema, Types } from "mongoose";

export interface IBooking {
    brandId: Types.ObjectId;
    bookCode: string;
    name: string;
    numberPhone: String;
    address: string;
    nameProduct: string;
    amount: number;
    type: string;
    status: string;
}

export const BookingSchema = new Schema<IBooking>({
    brandId: { type: mongoose.Schema.Types.ObjectId },
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
    description: string;
}

export const ProductBrandSchema = new Schema<IProductBrand>({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true }
});

export interface IBrand {
    nameBrand: string;
    product: IProductBrand[];
}

export const BrandSchema = new Schema({
    nameBrand: { type: String, required: true },
    product: { type: [ProductBrandSchema], default: null }
}, { _id: true, timestamps: true });
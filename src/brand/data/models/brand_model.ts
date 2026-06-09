import { Schema } from "mongoose";
import { required } from "zod/v4-mini";
import { IOrder, OrderSchema } from "../../../orders/data/models/order_model";

export interface IProductOfBrand {
    name: string;
    amount: number;
    type: string;
}


export const ProductOfBrandSchema = new Schema<IProductOfBrand>({
    name: { type: String, trim: true, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true }
}, { timestamps: true });

export interface IBrand {
    nameBrand: string;
    product: IProductOfBrand[]
}

export const BrandSchema = new Schema<IBrand>({
    nameBrand: { type: String, trim: true, required: true },
    product: { type: [ProductOfBrandSchema], required: true, default: [] }
}, { _id: true, timestamps: true });


export interface IBookProduct {
    bookCode: string;
    name: string;
    numberPhone: Number;
    address: string;
    nameProduct: string;
    amount: number;
    type: string;
    status: string;
}


export const BookProductSchema = new Schema<IBookProduct>({
    bookCode: { type: String, trim: true, required: true },
    name: { type: String, trim: true, required: true },
    numberPhone: { type: Number, required: true },
    address: { type: String, trim: true, required: true },
    nameProduct: { type: String, trim: true, required: true },
    amount: { type: Number, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true }
}, { _id: true, timestamps: true });


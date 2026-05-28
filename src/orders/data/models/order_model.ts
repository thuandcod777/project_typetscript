import { Document, Schema } from 'mongoose'

export interface IProduct {
    nameProduct: string;
    typeProduct: string;
    amount: number;
    width: number;
    height: number;
    weight: number;
    length: number;
    index: number;
}

export const ProductSchema = new Schema<IProduct>({
    nameProduct: { type: String, trim: true, required: true },
    typeProduct: { type: String, trim: true, required: true },
    amount: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    length: { type: Number, required: true },
    index: { type: Number, default: 0, required: true }
}, { _id: false });

export interface IAddressTakeGoods {
    method: string;
    address: string;
    scope: string;
}

export const AddressTakeGoodsSchema = new Schema<IAddressTakeGoods>({
    method: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    scope: { type: String, trim: true, required: true }
}, { _id: false });

export interface IAddressDelivery {
    method: string;
    address: string;
    scope: string;
}

export const AddressDeliverySchema = new Schema<IAddressDelivery>({
    method: { type: String, trim: true, required: true },
    address: { type: String, trim: true, required: true },
    scope: { type: String, trim: true, required: true }
}, { _id: false });

export interface IPayment {
    typePayment: string;
    stepPayment: number;
}

export const PaymentSchema = new Schema<IPayment>({
    typePayment: { type: String, trim: true, required: true },
    stepPayment: { type: Number, required: true }
}, { _id: false });

export interface IOrder extends Document {
    /*  id: string; */
    orderCode: string;
    statusDelivery: string;
    statusPickTime: boolean;
    product: IProduct;
    addressTakeGoods: IAddressTakeGoods;
    addressDelivery: IAddressDelivery;
    payment: IPayment;
}

export const OrderSchema = new Schema<IOrder>({
    orderCode: { type: String, trim: true, required: true, unique: true },
    statusDelivery: { type: String, default: "Confirm" },
    statusPickTime: { type: Boolean, default: false },
    product: { type: ProductSchema, required: true },
    addressTakeGoods: { type: AddressTakeGoodsSchema, required: true },
    addressDelivery: { type: AddressDeliverySchema, required: true },
    payment: { type: PaymentSchema, required: true }
}, { _id: true, timestamps: true });



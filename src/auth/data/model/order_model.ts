import mongoose, { Document, Schema, Types } from 'mongoose'
import { IPickTime, PickTimeSchema } from './pick_time_model';

export interface IProduct {
    name_product: string;
    type_product: string;
    amount: number;
    width: number;
    height: number;
    weight: number;
    length: number;
    index: number;
}

export const ProductSchema = new Schema<IProduct>({
    name_product: { type: String, trim: true, required: true },
    type_product: { type: String, trim: true, required: true },
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
    type_payment: string;
    step_payment: number;
}

export const PaymentSchema = new Schema<IPayment>({
    type_payment: { type: String, trim: true, required: true },
    step_payment: { type: Number, required: true }
}, { _id: false });

export interface IOrder extends Document {
    user_id: Types.ObjectId;
    order_code: string;
    status_delivery: string;
    status_pick_time: IPickTime | null;
    product: IProduct | null;
    address_take_goods: IAddressTakeGoods | null;
    address_delivery: IAddressDelivery | null;
    payment: IPayment | null;
}

export const OrderSchema = new Schema<IOrder>({
    user_id: { type: mongoose.Schema.Types.ObjectId },
    order_code: { type: String, trim: true, required: true, unique: true },
    status_delivery: { type: String, default: "Confirm" },
    status_pick_time: { type: PickTimeSchema, default: null },
    product: { type: ProductSchema, required: true },
    address_take_goods: { type: AddressTakeGoodsSchema, required: true },
    address_delivery: { type: AddressDeliverySchema, required: true },
    payment: { type: PaymentSchema, required: true }
}, { _id: true, timestamps: true });



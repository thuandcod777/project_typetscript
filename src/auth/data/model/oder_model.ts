import { Document, Schema } from "mongoose";

export interface OrderModel extends Document {
    namePerson: string,
    nameProduct: string,
    numberProduct: number,
    orderDate: Date
}

export const OrderSchema = new Schema({
    namePerson: { type: String, required: true },
    nameProduct: { type: String, required: true },
    numberProduct: { type: Number, required: true },
    orderDate: { type: Date, default: Date.now }
})
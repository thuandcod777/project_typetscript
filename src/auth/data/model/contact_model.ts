import { Schema } from "mongoose";

export interface IContact {
    name_enterprise: string;
    name_client: string;
    email: string;
    address: string;
    number_phone: string;
    name_product: string;
    amount: number;
    types: string;
    workday: string;
}

export const ContactSchema = new Schema({
    name_enterprise: { type: String },
    name_client: { type: String },
    email: { type: String },
    address: { type: String },
    number_phone: { type: String },
    name_product: { type: String },
    amount: { type: Number },
    types: { type: String },
    workday: { type: String }
}, { _id: true, timestamps: true })


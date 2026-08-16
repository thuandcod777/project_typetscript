import { Schema } from "mongoose";

export type PickAction = 'pending' | 'completed' | 'cancel';

export interface IPickTime {
    order_code: string;
    name_sender: string;
    number_phone: string;
    license: string;
    pick_time: string;
    status_pick_time: PickAction;
}

export const PickTimeSchema = new Schema<IPickTime>({
    name_sender: { type: String, trim: true, required: true },
    number_phone: { type: String, trim: true, required: true },
    license: { type: String, trim: true, required: true },
    pick_time: { type: String, trim: true, required: true },
    status_pick_time: { type: String, enum: ['pending', 'completed', 'cancel'], default: 'pending', required: true },
}, { _id: true, timestamps: true })
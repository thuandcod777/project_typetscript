import { Schema } from "mongoose";

export type PickAction = 'pending' | 'completed' | 'cancel';

export interface IPickTime {
    orderCode: string;
    pick_time: string;
    status_pick_time: PickAction;
}

export const PickTimeSchema = new Schema<IPickTime>({
    orderCode: { type: String, trim: true, required: true },
    pick_time: { type: String, trim: true, required: true },
    status_pick_time: { type: String, enum: ['pending', 'completed', 'cancel'], default: 'completed', required: true },
}, { _id: true, timestamps: true })
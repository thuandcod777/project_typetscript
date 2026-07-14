import { Schema } from "mongoose";

export type PickAction = 'pending' | 'completed' | 'cancel';

export interface IPickTime {
    pick_time: string;
    status_pick_time: PickAction;
}

export const PickTimeSchema = new Schema<IPickTime>({
    pick_time: { type: String, trim: true, required: true },
    status_pick_time: { type: String, enum: ['pending', 'completed', 'cancel'], default: 'pending', required: true },
}, { _id: true, timestamps: true })
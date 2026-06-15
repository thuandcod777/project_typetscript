import { Schema } from "mongoose";

export type PickAction = 'pending' | 'completed' | 'cancel';

export interface IPickTime {
    pickTime: string;
    statusPickTime: PickAction;
}

export const PickTimeSchema = new Schema<IPickTime>({
    pickTime: { type: String, trim: true, required: true },
    statusPickTime: { type: String, enum: ['pending', 'completed', 'cancel'], default: 'pending', required: true },
}, { _id: true, timestamps: true })
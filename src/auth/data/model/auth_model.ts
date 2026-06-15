import mongoose, { Document, Schema, Types } from 'mongoose'
import { IStepContract, StepContractSchema } from './contract_model';
import { IScopeCollection } from './scope_model';

export type StatusRole = 'client' | 'brand'

export interface IAuthSession extends Document {
    token: string;
    expiresAt: Date;
    isActive: boolean;
    isBlock: boolean;
}

export const AuthSchema = new Schema<IAuthSession>({
    token: { type: String, trim: true, required: true },
    expiresAt: { type: Date, default: Date.now, expires: 0 },
    isActive: { type: Boolean, required: true },
    isBlock: { type: Boolean, required: true },
}, { _id: true, timestamps: true });


export interface IUser {
    name: string,
    email: string,
    nameCompany: string,
    numberPhone: string,
    type: string,
    role: StatusRole,
    contract: Types.ObjectId | IStepContract | null,
    session: Types.ObjectId | IAuthSession | null,
}

export const UserSchema = new Schema({
    email: { type: String, required: true },
    name: { type: String, reqruied: true },
    nameCompany: { type: String, required: true },
    numberPhone: { type: Number, required: true },
    type: { type: String, required: true },
    role: { type: String, enum: ['client', 'brand'], required: true },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null },
    contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', default: null },
}, { _id: true, timestamps: true })


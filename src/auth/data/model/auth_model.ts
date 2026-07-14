import mongoose, { Document, Schema, Types } from 'mongoose'
import { IStepContract } from './contract_model';
import { restoreFieldsPlugin } from '../helper/restore_fields_plugin';

export type StatusRole = 'client' | 'cooperative'

export interface IAuthAudit {
    ip_address: string;
    user_agent: string;
}

export const AuthAuditSchema = new Schema<IAuthAudit>({
    ip_address: { type: String, trim: true, required: true },
    user_agent: { type: String, trim: true, required: true },
}, { _id: false });

export interface IAuthSession {
    refresh_token: string;
    access_token: string;
    expires_at: Date;
    is_active: boolean;
    is_block: boolean;
}

export const AuthSchema = new Schema<IAuthSession>({
    refresh_token: { type: String, trim: true },
    access_token: { type: String, trim: true },
    expires_at: { type: Date, default: Date.now },
    is_active: { type: Boolean },
    is_block: { type: Boolean, required: true },
}, { _id: true, timestamps: true });


export interface IUser {
    name: string,
    email: string,
    name_company: string,
    number_phone: string,
    type: string,
    role: StatusRole,
    session: Types.ObjectId | IAuthSession | null,
    opt: Types.ObjectId | null,
    contract: Types.ObjectId | IStepContract | null,
}

export const UserSchema = new Schema({
    email: { type: String, required: true, default: "", unique: true },
    name: { type: String, reqruied: true, default: "" },
    name_company: { type: String, required: true, default: "" },
    number_phone: { type: String, required: true, default: "" },
    type: { type: String, required: true, default: "" },
    role: { type: String, enum: ['client', 'cooperative'], required: true, default: 'client' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null },
    otp: { type: mongoose.Schema.Types.ObjectId, ref: 'Otp', default: null },
    contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', default: null },
}, { _id: true, timestamps: true });

UserSchema.plugin(restoreFieldsPlugin);

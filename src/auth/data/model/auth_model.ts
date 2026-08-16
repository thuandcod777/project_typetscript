import mongoose, { Types, Schema } from 'mongoose'
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
    user_id: Types.ObjectId;
    refresh_token: string;
    access_token: string;
    is_active: boolean;
    is_block: boolean;
}

export const AuthSchema = new Schema<IAuthSession>({
    user_id: { type: mongoose.Schema.Types.ObjectId },
    refresh_token: { type: String, trim: true },
    access_token: { type: String, trim: true },
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
}

export const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, reqruied: true, default: null },
    name_company: { type: String, required: true, default: null },
    number_phone: { type: String, required: true, default: null },
    type: { type: String, required: true, default: "" },
    role: { type: String, enum: ['client', 'cooperative'], required: true, default: 'client' },
}, { _id: true, timestamps: true });

UserSchema.plugin(restoreFieldsPlugin);

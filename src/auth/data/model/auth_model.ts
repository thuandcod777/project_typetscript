import { Document, Schema } from 'mongoose'
import { required } from 'zod/mini';

export interface IUser {
    name: string,
    email: string,
    nameCompany: string,
    numberPhone: string,
    type: string,
}

export const UserSchema = new Schema({
    email: { type: String, required: true },
    name: { type: String, reqruied: true },
    nameCompany: { type: String, required: true },
    numberPhone: { type: Number, required: true },
    type: { type: String, required: true },
})

export interface IAuthSession extends Document {
    token: string;
    expiresAt: Date;
    user: IUser;
}

export const AuthSchema = new Schema<IAuthSession>({
    token: { type: String, trim: true, required: true },
    expiresAt: { type: Date, default: Date.now, expires: 0 },
    user: { type: UserSchema, required: true }
}, { _id: true, timestamps: true });
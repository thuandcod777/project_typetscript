import { Document, Schema } from 'mongoose'

export interface UsersModel extends Document {
    id: string
    name: string,
    email: string,
    type: string,
    password?: string,
}

export const UserSchema = new Schema({
    id: String,
    email: { type: String, required: true },
    name: String,
    type: { type: String, required: true },
    password: String,
})
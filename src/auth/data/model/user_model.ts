import { Document, Schema } from 'mongoose'

export interface UserModel extends Document {
    name: string,
    email: string,
    type: string,
    password?: string,
}

export const UserSchema = new Schema({
    email: { type: String, required: true },
    name: String,
    type: { type: String, required: true }, 
    password: String,
})
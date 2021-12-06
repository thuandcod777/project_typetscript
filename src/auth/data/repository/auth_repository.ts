import IAuthRepository from "../../domain/iauth_repository";
import User from "../../domain/user";
import { Mongoose } from "mongoose";
import { UserModel, UserSchema } from "../model/user_model";
import { OrderModel, OrderSchema } from "../model/oder_model";

export default class AuthRepository implements IAuthRepository {
    constructor(private readonly client: Mongoose) { }

    public async find(email: string): Promise<User> {
        const users = this.client.model<UserModel>('User', UserSchema)

        const user = await users.findOne({ email: email.toLowerCase() })

        if (!user) return Promise.reject('User not found')

        return new User(user.id, user.name, user.email, user.password ?? '', user.type)

    }


    public async add(email: string, name: string, auth_type: string, passwordHash?: string): Promise<string> {
        const userModel = this.client.model<UserModel>('User', UserSchema)

        const saveUser = await userModel.create({
            email: email.toLowerCase(),
            name: name,
            type: auth_type,
            password: passwordHash,
        })

        if (passwordHash) saveUser.password = passwordHash

        saveUser.save()

        return saveUser.id
    }




}
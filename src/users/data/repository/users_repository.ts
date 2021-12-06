import IGetuserRepository from "../../domain/igetuser_repository"
import { Mongoose } from "mongoose"
import Users from "../../domain/users"
import { UserSchema, UsersModel } from "../models/users_model"

export default class UsersRepository implements IGetuserRepository {
    constructor(private readonly client: Mongoose) { }

    public async getUser(): Promise<Users[]> {
        const userModel = this.client.model<UsersModel>('User', UserSchema)

        const user = await userModel.find().catch((_) => null)

        if (user === null) return Promise.reject('No User found')

        return this.allUser(user)
    }

    private allUser(users: UsersModel[]): Users[] {
        return users.map((user) => new Users(user.id, user.email, user.name, user.password ?? '', user.type))
    }

}
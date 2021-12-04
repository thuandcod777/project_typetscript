import User from "./user";

export default interface IAuthRepository {
    find(email: string): Promise<User>
    add(email: string, name: string, type: string, passwordHash?: string): Promise<string>
}
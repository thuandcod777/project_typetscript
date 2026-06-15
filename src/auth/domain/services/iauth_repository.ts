import { IRegisterInputDTO } from "../dtos/register_input.dto";
import User from "../entities/user.entity";

export default interface IAuthRepository {
    signIn(email: string): Promise<User | null>;
    register(userData: User): Promise<User>;
    updateSession(userId: string, token: string, isActive: boolean): Promise<boolean>;
    activateSession(userId: string): Promise<boolean>;
    logOut(email: string): Promise<boolean>;
}
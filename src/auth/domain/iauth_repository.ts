import UserModel, { AuthSessionModel } from "./auth";
import User from "./auth";

export default interface IAuthRepository {
    signInScope(email: string): Promise<AuthSessionModel>;
    register(userData: AuthSessionModel): Promise<AuthSessionModel>;
    updateActivceAndRefreshToken(id: string, token: string, isActive: boolean): Promise<boolean>;
}
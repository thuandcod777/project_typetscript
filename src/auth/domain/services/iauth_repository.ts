import { AuthSession, LogOut, ResultLogin } from "../entities/auth.entity";
import { Contract } from "../entities/contract.entity";
import User from "../entities/user.entity";

export default interface IAuthRepository {
    signIn(email: string): Promise<ResultLogin>;
    register(userData: User): Promise<User>;
    logOut(email: string, statusLogin: string): Promise<LogOut | null>;
    getSession(userId: string): Promise<AuthSession | null>;
    getContract(contractId: string): Promise<Contract>;
    updateSession(userId: string, refreshToken: string | null, accessToken: string | null, expiresAt: Date, isActive: boolean, isBlock: boolean): Promise<AuthSession | null>;
    updateToken(sessionId: string, refreshToken: string, accessToken: string, expiresAt: Date): Promise<boolean>;
    activateSession(userId: string): Promise<boolean>;
    checkSessionExists(): Promise<boolean>;
}
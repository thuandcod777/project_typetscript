import { IUSerInputDto } from "../dtos/order_input.dto";
import { AuthSession, LogOut } from "../entities/auth.entity";
import { Contract } from "../entities/contract.entity";
import type { ClientSession } from "mongoose";
import User from "../entities/user.entity";

export default interface IAuthRepository {
    startSession(): Promise<ClientSession>;
    checkUser(email: string, session?: ClientSession): Promise<{ success: boolean, userData: User | null, message: string }>;
    updateUser(userId: string, userData: IUSerInputDto, session?: ClientSession): Promise<{ success: boolean, message: string }>;
    logOut(email: string, statusLogin: string): Promise<LogOut | null>;
    getSession(userId: string): Promise<AuthSession | null>;
    updateToken(sessionId: string, refreshToken: string, accessToken: string, expiresAt: Date): Promise<boolean>;
    activateSession(userId: string): Promise<boolean>;
    checkSessionExists(): Promise<boolean>;
    getUserProfileFromSession(token: string, role: string): Promise<{ success: boolean, userData: User | null, message: string }>;
}
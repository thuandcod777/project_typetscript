import IAuthRepository from "../../domain/services/iauth_repository";
import { type QueryOptions, type ClientSession, Mongoose, Types } from "mongoose";
import { AuthSchema, IAuthSession, IUser, UserSchema } from "../model/auth_model";
import { AuthSession, LogOut } from "../../domain/entities/auth.entity";
import e from "express";
import { IUSerInputDto } from "../../domain/dtos/order_input.dto";
import User from "../../domain/entities/user.entity";
import { ContractSchema, IContract } from "../model/contract_model";
import { Contract } from "../../domain/entities/contract.entity";
import { ContractDetails } from "../../domain/entities/contract-details.entity";
import Scope from "../../domain/entities/scope.entity";
import { ContractPdf } from "../../domain/entities/contract-pdf.entity";

export default class AuthRepository implements IAuthRepository {
    constructor(private readonly client: Mongoose) { }

    public async startSession(): Promise<ClientSession> {
        return this.client.startSession();
    }

    public async checkUser(email: string, session?: ClientSession): Promise<{ success: boolean, userData: User | null, message: string }> {
        const userModel = this.client.model<IUser>('User', UserSchema);

        const userQuery = userModel.findOne({ email: email });

        if (session) {
            userQuery.session(session);
        }

        const user = await userQuery.lean();

        if (!user) {
            return { success: false, userData: null, message: "Không tìm thấy tài khoản email đăng ký." };
        }

        const userData = User.fromJson({
            _id: user._id.toString(),
            name: user.name,
            name_company: user.name_company,
            number_phone: user.number_phone,
            role: user.role
        });

        return { success: true, userData: userData, message: "Tìm kiếm tài khoản thành công." };
    }

    public async updateUser(userId: string, userData: IUSerInputDto, session?: ClientSession): Promise<{ success: boolean; message: string; }> {
        const userModel = this.client.model<IUser>('User', UserSchema);

        const updateOptions: QueryOptions & { returnDocument: 'after' | 'before' } = { returnDocument: 'after' };

        if (session) {
            updateOptions.session = session;
        }

        const updateUser = await userModel.findOneAndUpdate({ _id: userId }, {
            $set: {
                name: userData.name,
                name_company: userData.name_company,
                number_phone: userData.number_phone
            }
        }, updateOptions).lean();

        if (!updateUser) {
            return { success: false, message: "Lỗi cập nhật người dùng." };
        }

        return { success: true, message: "Cập nhật thông tin người dùng thành công." };
    }

    public async logOut(email: string, statusLogin: string): Promise<LogOut | null> {
        return {
            userId: "".toString(),
            token: ""
        };
    }

    public async getSession(sessionId: string): Promise<AuthSession | null> {
        const sessionModel = this.client.model<IAuthSession>('Session', AuthSchema);

        const sessionData = await sessionModel.findById(sessionId);

        if (!sessionData) {
            return null;
        }

        const authSession = new AuthSession({
            id: sessionData._id.toString(),
            refresh_token: sessionData.refresh_token,
            access_token: sessionData.access_token,
            is_active: sessionData.is_active,
            is_block: sessionData.is_block
        });

        return authSession;
    }

    public async checkSessionExists(): Promise<boolean> {
        const sessionModel = this.client.model<IAuthSession>('Session', AuthSchema);

        const isExist = await sessionModel.exists({}).lean() !== null;

        return isExist;

    }

    public async updateToken(sessionId: string, refresh_token: string, access_token: string, expires_at: Date): Promise<boolean> {
        const sessionModel = this.client.model<IAuthSession>('Session', AuthSchema);

        const isUpdated = await sessionModel.findOneAndUpdate({ _id: sessionId }, {
            $set: {
                refresh_token: refresh_token,
                access_token: access_token,
                expires_at: expires_at
            }
        }).lean();

        return !!isUpdated;
    }

    public async activateSession(userId: string): Promise<boolean> {

        try {

            return true;

        } catch (error) {
            console.error(`[DB Error] `, error);
            return false;
        }
    }

    public async getUserProfileFromSession(token: string, role: string): Promise<{ success: boolean, userData: User | null, message: string }> {
        const sessionModel = this.client.model<IAuthSession>('Session', AuthSchema);
        const userModel = this.client.model<IUser>('User', UserSchema);

        let data = {};

        if (role === 'client') {
            data = { access_token: token }
        } else if (role === 'cooperative') {
            data = { refresh_token: token }
        } else {
            return { success: false, userData: null, message: "Vai trò không hợp lệ." };
        }

        const session = await sessionModel.findOne(data).lean();

        if (!session) {
            return { success: false, userData: null, message: "Phiên không tồn tại." };
        }

        const user = await userModel.findOne({ _id: session!.user_id }).lean();

        if (!user) {
            return { success: false, userData: null, message: "Không tìm thấy thông tin người dùng tương ứng." };
        }

        const userData = User.fromJson({
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            name_company: user.name_company,
            number_phone: user.number_phone,
            type: user.type,
            role: user.role,
        });

        return { success: true, userData: userData, message: "Tìm kiếm thông tin người dùng thành công." };
    }
}


import IAuthRepository from "../../domain/services/iauth_repository";
import { Mongoose, Types } from "mongoose";
import { AuthSchema, IAuthSession, IUser, UserSchema } from "../model/auth_model";
import User from "../../domain/entities/user.entity";
import { IScopeJSON } from "../../domain/entities/scope.entity";
import { AuthSession, LogOut, ResultLogin } from "../../domain/entities/auth.entity";
import e from "express";
import { Contract } from "../../domain/entities/contract.entity";
import { IContractDetailsJSON } from "../../domain/entities/contract-details.entity";
import { IContractPdfJSON } from "../../domain/entities/contract-pdf.entity";
import { IStepContract, StepContractSchema } from "../model/contract_model";



type IPopulateUser = Omit<IUser, 'session'> & {
    _id: { toString(): string },
    session: {
        _id: { toString(): string };
        id?: string;
        refreshToken: string;
        accessToken: string;
        expiresAt: string | Date;
        isActive: boolean;
        isBlock: boolean;
    } | null;
    contract: {
        _id: { toString(): string };
        id?: string;
        contractCode: string;
        stepContract: number;
        contractDetails: IContractDetailsJSON | null;
        scope: IScopeJSON | null;
        contractPdf: IContractPdfJSON | null;
        isSuccess: boolean;
    } | null
}



export default class AuthRepository implements IAuthRepository {
    constructor(private readonly client: Mongoose) { }

    public async signIn(email: string): Promise<ResultLogin> {
        const userModel = this.client.model<IUser>('User', UserSchema);

        const rawUser = await userModel.findOne({ email: email }).lean();

        if (!rawUser) {
            throw new Error(`User not found: ${rawUser!._id}`);
        }

        return {
            id: rawUser._id.toString(),
            role: rawUser.role,
            sessionId: rawUser.session ? rawUser.session.toString() : null,
            contractId: rawUser.contract ? rawUser.contract.toString() : null
        };
    }

    public async register(userData: User): Promise<User> {
        const userModel = this.client.model<IUser>('User', UserSchema);

        let savedUserJson: any;

        const saveAuth = await userModel.create(
            {
                name: userData.name,
                email: userData.email,
                name_company: userData.name_company,
                number_phone: userData.number_phone,
                type: userData.type,
                role: userData.role,
                otp: null,
                session: null,
                contract: null,
            }
        );

        savedUserJson = saveAuth.toJSON({
            transform: (doc, ret) => {
                ret.id = ret._id.toString(); // Chuyển _id thành id
                delete ret._id; // Xóa bỏ trường _id gốc
                delete ret.__v; // Xóa bỏ trường phiên bản
                return ret;
            }
        });

        return User.fromJson(savedUserJson);
    }

    public async logOut(email: string, statusLogin: string): Promise<LogOut | null> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const sessionModel = this.client.model<IAuthSession>('Session', AuthSchema);

        const user = await userModel.findOne({ email: email }).lean();;

        if (!user) {
            console.error(`[DB Error] Không tìm thấy User với email: ${email}`);
            return null;
        }

        let token = "";

        if (user.session) {
            const sessionData = await sessionModel.findByIdAndUpdate(user.session, {
                $set: {
                    isActive: false
                }
            });

            if (statusLogin === 'contract' && user.role === 'cooperative') {
                token = sessionData?.refresh_token ?? "";
            } else if (statusLogin === 'booking' && ['client', 'cooperative'].includes(user.role)) {
                token = sessionData?.access_token ?? "";
            }
        }

        return {
            userId: user._id.toString(),
            token: token
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
            expires_at: sessionData.expires_at,
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

    public async updateSession(userId: string, refresh_token: string, access_token: string, expires_at: Date, is_active: boolean, is_block: boolean): Promise<AuthSession | null> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const sessionModel = this.client.model<IAuthSession>('Session', AuthSchema);

        const dbSession = await this.client.startSession();

        let createdSession: AuthSession | null = null;

        try {
            const user = await userModel.findById(userId).session(dbSession);

            if (!user) {
                throw new Error(`User not found: ${userId}`);
            }

            const sessionId = user.session;

            if (!sessionId) {

                const sessionData = await sessionModel.create([{
                    refresh_token: refresh_token,
                    access_token: access_token,
                    expires_at: expires_at,
                    is_active: is_active,
                    is_block: is_block
                }], { session: dbSession });


                user.session = sessionData[0]._id as any;
                await user.save({ session: dbSession });

                createdSession = new AuthSession({
                    id: sessionData[0]._id.toString(),
                    refresh_token: sessionData[0].refresh_token,
                    access_token: sessionData[0].access_token,
                    expires_at: sessionData[0].expires_at,
                    is_active: sessionData[0].is_active,
                    is_block: sessionData[0].is_block
                });
            }

            console.log(`=> [DB Success] Đã tạo mới Session cho User ID: ${userId}`);

            return createdSession;
        } catch (error) {
            console.error(`[DB Error] `, error);
            return null;
        } finally {
            await dbSession.endSession();
        }

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
        const userModel = this.client.model<IUser>('User', UserSchema);
        const sessionModel = this.client.model<IAuthSession>('Session', AuthSchema);

        const dbSession = await this.client.startSession();

        try {
            await dbSession.withTransaction(async () => {

                const user = await userModel.findById(userId);

                if (!user) {
                    return false;
                }

                const sessionId = user.session;

                if (!sessionId) {
                    await sessionModel.findByIdAndUpdate(sessionId, { $set: { is_active: true }, new: true });
                } else {
                    await sessionModel.findByIdAndUpdate(sessionId, { $set: { is_active: true }, new: true });
                }

                console.log(`[DB Success] Đã cập nhật trạng thái hoạt động cho người dùng : ${user._id}`)
            });

            return true;

        } catch (error) {
            console.error(`[DB Error] `, error);
            return false;
        } finally {
            await dbSession.endSession();
        }
    }

    public async getContract(contractId: string): Promise<Contract> {

        if (!Types.ObjectId.isValid(contractId)) {
            throw new Error(`Invalid Contract ID format: ${contractId}`);
        }

        const contractModel = this.client.model<IStepContract>('Contract', StepContractSchema);

        const rawContract = await contractModel.findById(contractId);

        if (!rawContract) {
            throw new Error(`Contract with ID ${contractId} does not exist`);
        }

        return {
            contract_code: rawContract.contract_code,
            step_contract: rawContract.step_contract,
            contract_details: rawContract.contract_details ? {
                number_contract: rawContract.contract_details.number_contract,
                name_client_a: rawContract.contract_details.name_client_a,
                name_business_owner_b: rawContract.contract_details.name_business_owner_b,
                name_enterprise_a: rawContract.contract_details.name_enterprise_a,
                name_enterprise_b: rawContract.contract_details.name_enterprise_b,
                business_register_number_a: rawContract.contract_details.business_register_number_a,
                business_register_number_b: rawContract.contract_details.business_register_number_b,
                name_product: rawContract.contract_details.name_product,
                type_weight: rawContract.contract_details.type_weight,
                type_product: rawContract.contract_details.type_product,
                pickup_location: rawContract.contract_details.pickup_location,
                delivery_location: rawContract.contract_details.delivery_location,
                method_contract: rawContract.contract_details.method_contract,
                method_delivery: rawContract.contract_details.method_delivery,
                method_payment: rawContract.contract_details.method_payment,
            } : null,
            scope: rawContract.scope ? {
                scopes: (rawContract.scope.scopes ?? []).map((item) => {
                    return {
                        is_scope: item.is_scope,
                        address: item.address,
                        location: item.location
                    };
                }
                ),
                is_success: rawContract.scope.is_success ?? false,
                is_verify_scope: rawContract.scope.is_verify_scope ?? false,
            } : null,
            contract_pdf: rawContract.contract_pdf ? {
                id: (rawContract.contract_pdf as any)._id?.toString() ?? '',
                name: rawContract.contract_pdf.name,
                buffer: rawContract.contract_pdf.buffer,
                mime_type: rawContract.contract_pdf.mime_type,
            } : null,
            is_success: rawContract?.is_success!,
        }
    }
}


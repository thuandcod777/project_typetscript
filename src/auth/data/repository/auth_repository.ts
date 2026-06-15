import IAuthRepository from "../../domain/services/iauth_repository";
import { Mongoose } from "mongoose";
import { AuthSchema, IAuthSession, IUser, UserSchema } from "../model/auth_model";
import User, { IUserJSON } from "../../domain/entities/user.entity";
import { json } from "zod";
import { ContractDetails, IContractDetailsJSON } from "../../domain/entities/contract-details.entity";
import { ContractPdf, IContractPdfJSON } from "../../domain/entities/contract-pdf.entity";
import { IScopeJSON } from "../../domain/entities/scope.entity";



type IPopulateUser = Omit<IUser, 'session'> & {
    _id: { toString(): string },
    session: {
        _id: { toString(): string };
        id?: string;
        token: string;
        expiresAt: string | Date;
        isActive: boolean;
        isBlocked: boolean;
    } | null;
    contract: {
        _id: { toString(): string };
        id?: string;
        contractCode: string;
        stepContract: number;
        contractDetails: IContractDetailsJSON | null;
        scope: IScopeJSON | null;
        contractPdf: IContractPdfJSON | null;
    } | null
}



export default class AuthRepository implements IAuthRepository {
    constructor(private readonly client: Mongoose) { }


    public async signIn(email: string): Promise<User | null> {
        const userModel = this.client.model<IUser>('User', UserSchema);

        const rawUser = (await userModel.findOne({ email: email }).populate(
            {
                path: 'session',
                match: { isActive: false, expiresAt: { $gt: new Date() } }
            },

        ).lean()) as IPopulateUser | null;

        if (!rawUser) {
            return null;
        }

        const formattedUser: IUserJSON = {
            id: rawUser._id.toString(),
            name: rawUser.name,
            email: rawUser.email,
            nameCompany: rawUser.nameCompany,
            numberPhone: rawUser.numberPhone,
            type: rawUser.type,
            role: rawUser.role,
            contract: rawUser.contract ? {
                contractCode: rawUser.contract.contractCode,
                stepContract: rawUser.contract.stepContract,
                contractDetails: rawUser.contract.contractDetails,
                scope: rawUser.contract.scope,
                contractPdf: rawUser.contract.contractPdf
            } : null,
            session: rawUser.session ? {
                id: rawUser.session._id ? rawUser.session._id.toString() : (rawUser.session.id || ""),
                token: rawUser.session.token,
                expiresAt: rawUser.session.expiresAt,
                isActive: rawUser.session.isActive,
                isBlocked: rawUser.session.isBlocked,
            } : null
        };

        return User.fromJson(formattedUser);

    }

    public async activateSession(userId: string): Promise<boolean> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const sessionModel = this.client.model<IAuthSession>('Session', AuthSchema);

        const user = await userModel.findById(userId);
        if (user && user.session) {
            await sessionModel.findByIdAndUpdate(user.session, { $set: { isActive: true } });
            return true;
        }
        return false;
    }

    public async register(userData: User): Promise<User> {
        const userModel = this.client.model<IUser>('User', UserSchema);

        let savedUserJson: any;

        const saveAuth = await userModel.create(
            {
                name: userData.name,
                email: userData.email,
                nameCompany: userData.nameCompany,
                numberPhone: userData.numberPhone,
                type: userData.type,
                role: userData.role,
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

    public async updateSession(userId: string, token: string, isActive: boolean): Promise<boolean> {
        const userModel = this.client.model<IUser>('User', UserSchema);
        const sessionModel = this.client.model<IAuthSession>('Session', AuthSchema);

        const dbSession = await this.client.startSession();
        dbSession.startTransaction();

        try {
            const user = await userModel.findById(userId).session(dbSession);
            console.log(user);
            if (!user) {
                console.error(`[DB Error] Không tìm thấy User ID: ${userId}`);
                await dbSession.abortTransaction();
                await dbSession.endSession();
                return false;
            }


            const expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);

            const sessionId = user.session;

            if (!sessionId) {
                const sessionData = await sessionModel.create([{
                    token: token,
                    isActive: isActive,
                    expiresAt: expiresAt,
                    isBlock: false
                }], { session: dbSession });

                user.session = sessionData[0]._id as any;
            }

            await user.save({ session: dbSession });

            await dbSession.commitTransaction();
            console.log(`=> [DB Success] Đã tạo mới Session cho User ID: ${userId}`);
            return true;
        } catch (error) {
            await dbSession.abortTransaction();
            console.error(`[DB Error] Lỗi cập nhật session:`, error);
            return false;
        } finally {
            // Luôn luôn đóng session tại đây để không bao giờ bị rò rỉ kết nối DB
            await dbSession.endSession();
        }
    }

    public async logOut(email: string): Promise<boolean> {
        const userModel = this.client.model<IUser>('User', UserSchema);

        const updatedUser = await userModel.findByIdAndUpdate({ email: email }, { $set: { 'session.isActive': true } });


        console.log(`=> [DB Success] Cập nhật trạng thái hoạt động thành công cho email: ${email}`);
        return true;
    }
}


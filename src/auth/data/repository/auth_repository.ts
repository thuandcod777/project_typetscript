import IAuthRepository from "../../domain/iauth_repository";
import { AuthSessionModel } from "../../domain/auth";
import { Mongoose } from "mongoose";
import { AuthSchema, IAuthSession } from "../model/auth_model";
import id from "zod/v4/locales/id.cjs";

export default class AuthRepository implements IAuthRepository {
    constructor(private readonly client: Mongoose) { }


    public async signInScope(email: string): Promise<AuthSessionModel> {
        const signInScope = this.client.model<IAuthSession>('Auth', AuthSchema);

        const userSession = await signInScope.findOne({ email });

        if (!userSession) {
            throw new Error('Tài khoản không tồn tại');
        }

        return AuthSessionModel.fromJson(userSession.toJSON(
            {
                transform: (doc, ret) => {
                    ret.id = ret._id.toString(); // Chuyển _id thành id
                    delete ret._id; // Xóa bỏ trường _id gốc
                    delete ret.__v; // Xóa bỏ trường phiên bản
                    return ret;
                }
            }
        ));
    }

    public async register(authData: AuthSessionModel): Promise<AuthSessionModel> {
        const registerUser = this.client.model<IAuthSession>('Auth', AuthSchema);

        const saveAuth = await registerUser.create(authData);

        return AuthSessionModel.fromJson(saveAuth.toJSON({
            transform: (doc, ret) => {
                ret.id = ret._id.toString(); // Chuyển _id thành id
                delete ret._id; // Xóa bỏ trường _id gốc
                delete ret.__v; // Xóa bỏ trường phiên bản
                return ret;
            }
        }));
    }

    public async updateActivceAndRefreshToken(id: string, token: string, isActive: boolean): Promise<boolean> {
        const doc = this.client.model<IAuthSession>('Auth', AuthSchema);
        const updated = await doc.findByIdAndUpdate(id, { $set: { token: token, isActive: isActive } });
        if (!updated) {
            console.error(`[DB Error] Cập nhật refresh token thất bại cho ID: ${id}`);
            return false;
        }
        console.log(`=> [DB Success] Cập nhật Refresh Token mới vào MongoDB thành công cho ID: ${id}`);
        return true;
    }


}


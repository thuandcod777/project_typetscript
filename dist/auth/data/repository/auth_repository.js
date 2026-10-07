"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_model_1 = require("../model/auth_model");
const auth_entity_1 = require("../../domain/entities/auth.entity");
const user_entity_1 = __importDefault(require("../../domain/entities/user.entity"));
class AuthRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async startSession() {
        return this.client.startSession();
    }
    async checkUser(email, session) {
        const userModel = this.client.model('User', auth_model_1.UserSchema);
        const userQuery = userModel.findOne({ email: email });
        if (session) {
            userQuery.session(session);
        }
        const user = await userQuery.lean();
        if (!user) {
            return { success: false, userData: null, message: "Không tìm thấy tài khoản email đăng ký." };
        }
        const userData = user_entity_1.default.fromJson({
            _id: user._id.toString(),
            name: user.name,
            name_company: user.name_company,
            number_phone: user.number_phone,
            role: user.role
        });
        return { success: true, userData: userData, message: "Tìm kiếm tài khoản thành công." };
    }
    async updateUser(userId, userData, session) {
        const userModel = this.client.model('User', auth_model_1.UserSchema);
        const updateOptions = { returnDocument: 'after' };
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
    async logOut(email, statusLogin) {
        return {
            userId: "".toString(),
            token: ""
        };
    }
    async getSession(sessionId) {
        const sessionModel = this.client.model('Session', auth_model_1.AuthSchema);
        const sessionData = await sessionModel.findById(sessionId);
        if (!sessionData) {
            return null;
        }
        const authSession = new auth_entity_1.AuthSession({
            id: sessionData._id.toString(),
            refresh_token: sessionData.refresh_token,
            access_token: sessionData.access_token,
            is_active: sessionData.is_active,
            is_block: sessionData.is_block
        });
        return authSession;
    }
    async checkSessionExists() {
        const sessionModel = this.client.model('Session', auth_model_1.AuthSchema);
        const isExist = await sessionModel.exists({}).lean() !== null;
        return isExist;
    }
    async updateToken(sessionId, refresh_token, access_token, expires_at) {
        const sessionModel = this.client.model('Session', auth_model_1.AuthSchema);
        const isUpdated = await sessionModel.findOneAndUpdate({ _id: sessionId }, {
            $set: {
                refresh_token: refresh_token,
                access_token: access_token,
                expires_at: expires_at
            }
        }).lean();
        return !!isUpdated;
    }
    async activateSession(userId) {
        try {
            return true;
        }
        catch (error) {
            console.error(`[DB Error] `, error);
            return false;
        }
    }
    async getUserProfileFromSession(token, role) {
        const sessionModel = this.client.model('Session', auth_model_1.AuthSchema);
        const userModel = this.client.model('User', auth_model_1.UserSchema);
        let data = {};
        if (role === 'client') {
            data = { access_token: token };
        }
        else if (role === 'cooperative') {
            data = { refresh_token: token };
        }
        else {
            return { success: false, userData: null, message: "Vai trò không hợp lệ." };
        }
        const session = await sessionModel.findOne(data).lean();
        if (!session) {
            return { success: false, userData: null, message: "Phiên không tồn tại." };
        }
        const user = await userModel.findOne({ _id: session.user_id }).lean();
        if (!user) {
            return { success: false, userData: null, message: "Không tìm thấy thông tin người dùng tương ứng." };
        }
        const userData = user_entity_1.default.fromJson({
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
exports.default = AuthRepository;

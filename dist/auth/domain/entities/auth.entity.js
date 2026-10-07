"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSession = void 0;
class AuthSession {
    id;
    refresh_token;
    access_token;
    is_active;
    is_block;
    constructor({ id, refresh_token, access_token, is_active, is_block }) {
        this.id = id ?? "";
        this.refresh_token = refresh_token;
        this.access_token = access_token;
        this.is_active = is_active;
        this.is_block = is_block;
    }
    static fromJson(json) {
        return new AuthSession({
            id: json.id,
            refresh_token: json.refresh_token,
            access_token: json.access_token,
            is_active: json.is_active,
            is_block: json.is_block,
        });
    }
}
exports.AuthSession = AuthSession;

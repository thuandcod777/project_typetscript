import mongoose, { Document, Schema, Types } from 'mongoose'

export interface IAuthSessionJSON {
    id: string;
    refresh_token: string;
    access_token: string;
    expires_at: string | Date;
    is_active: boolean;
    is_block: boolean;
}

export class AuthSession {
    readonly id: string;
    readonly refresh_token: string;
    readonly access_token: string;
    readonly expires_at: Date;
    readonly is_active: boolean;
    readonly is_block: boolean;

    constructor({ id, refresh_token, access_token, expires_at = new Date(), is_active, is_block }: { id?: string, refresh_token: string, access_token: string, expires_at: Date, is_active: boolean, is_block: boolean }) {
        this.id = id ?? "";
        this.refresh_token = refresh_token;
        this.access_token = access_token;
        this.expires_at = expires_at;
        this.is_active = is_active;
        this.is_block = is_block;
    }

    get isValid(): boolean {
        return new Date() < this.expires_at;
    }

    static fromJson(json: IAuthSessionJSON): AuthSession {
        return new AuthSession({
            id: json.id,
            refresh_token: json.refresh_token,
            access_token: json.access_token,
            expires_at: new Date(json.expires_at),
            is_active: json.is_active,
            is_block: json.is_block,
        });
    }

}

export interface LogOut {
    userId: string;
    token: string;
}

export interface ResultLogin {
    id: string;
    role: string;
    sessionId: string | null;
    contractId: string | null;
}
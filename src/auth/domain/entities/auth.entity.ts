export interface IAuthSessionJSON {
    id: string;
    token: string;
    expiresAt: string | Date;
    isActive: boolean;
    isBlocked: boolean;
}

export class AuthSession {
    readonly id: string;
    readonly token: string;
    readonly expiresAt: Date;
    readonly isActive: boolean;
    readonly isBlocked: boolean;

    constructor({ id, token, expiresAt = new Date(), isActive, isBlocked }: { id?: string, token: string, expiresAt: Date, isActive: boolean, isBlocked: boolean }) {
        this.id = id ?? "";
        this.token = token;
        this.expiresAt = expiresAt;
        this.isActive = isActive;
        this.isBlocked = isBlocked;
    }

    get isValid(): boolean {
        return new Date() < this.expiresAt;
    }

    static fromJson(json: IAuthSessionJSON): AuthSession {
        return new AuthSession({
            id: json.id,
            token: json.token,
            expiresAt: new Date(json.expiresAt),
            isActive: json.isActive,
            isBlocked: json.isBlocked,
        });
    }

}
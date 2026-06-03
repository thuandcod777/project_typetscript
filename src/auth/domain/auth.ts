
interface IUserJSON {
    name: string;
    email: string;
    nameCompany: string;
    numberPhone: number;
    type: string;
}

export default class UserModel {
    readonly name: string;
    readonly email: string;
    readonly nameCompany: string;
    readonly numberPhone: number;
    readonly type: string;

    constructor({ email = "", name = "", nameCompany = "", numberPhone = 0, type = "" }: {
        email: string, name: string, nameCompany: string, numberPhone: number, type: string
    }) {

        this.name = name;
        this.email = email;
        this.nameCompany = nameCompany;
        this.numberPhone = numberPhone;
        this.type = type;
    }

    static fromJson(json: IUserJSON): UserModel {
        return new UserModel({
            name: json.name,
            email: json.email,
            nameCompany: json.nameCompany,
            numberPhone: json.numberPhone,
            type: json.type
        });
    }
}

export interface IAuthSessionJSON {
    id: string;
    token: string;
    expiresAt: string;
    isActive: boolean;
    isBlocked: boolean;
    user: IUserJSON;
}

export class AuthSessionModel {
    readonly id: string;
    readonly token: string;
    readonly expiresAt: Date;
    readonly isActive: boolean;
    readonly isBlocked: boolean;
    readonly user: UserModel;

    constructor({ id, token, expiresAt = new Date(), isActive, isBlocked, user }: { id?: string, token: string, expiresAt: Date, isActive: boolean, isBlocked: boolean, user: UserModel }) {
        this.id = id ?? ""; // Nếu không truyền id (lúc tạo mới), gán tạm chuỗi rỗng để Mongoose tự sinh ID
        this.token = token;
        this.expiresAt = expiresAt;
        this.isActive = isActive;
        this.isBlocked = isBlocked;
        this.user = user;
    }

    get isValid(): boolean {
        return new Date() < this.expiresAt;
    }

    static fromJson(json: IAuthSessionJSON): AuthSessionModel {
        return new AuthSessionModel({
            id: json.id,
            token: json.token,
            expiresAt: new Date(json.expiresAt),
            isActive: json.isActive,
            isBlocked: json.isBlocked,
            user: UserModel.fromJson(json.user)
        });
    }

}
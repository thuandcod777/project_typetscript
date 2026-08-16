export interface IUserJSON {
    _id?: string | null;
    name?: string | null;
    email?: string | null;
    name_company?: string | null;
    number_phone?: string | null;
    type?: string | null;
    role?: string | null;
}

export default class User {
    readonly _id: string | null;
    readonly name: string | null;
    readonly email: string | null;
    readonly name_company: string | null;
    readonly number_phone: string | null;
    readonly type: string | null;
    readonly role: string | null;

    constructor({ _id = null, email = null, name = null, name_company = null, number_phone = null, type = null, role = null }: IUserJSON) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.name_company = name_company;
        this.number_phone = number_phone;
        this.type = type;
        this.role = role;
    }

    static fromJson(json: IUserJSON): User {
        return new User(json);
    }
}

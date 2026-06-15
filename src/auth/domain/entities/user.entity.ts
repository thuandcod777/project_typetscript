import { AuthSession, IAuthSessionJSON } from "./auth.entity";
import { Contract, IContractJSON } from "./contract.entity";

export interface IUserJSON {
    id: string;
    name: string;
    email: string;
    nameCompany: string;
    numberPhone: string;
    type: string;
    role: string;
    contract: IContractJSON | null;
    session: IAuthSessionJSON | null;
}

export default class User {
    readonly id: string | null;
    readonly name: string;
    readonly email: string;
    readonly nameCompany: string;
    readonly numberPhone: string;
    readonly type: string;
    readonly role: string;
    readonly contract: Contract | null;
    readonly session: AuthSession | null;

    constructor({ id = null, email = "", name = "", nameCompany = "", numberPhone = "", type = "", role = "", contract = null, session = null }: {
        id: string | null, email: string, name: string, nameCompany: string, numberPhone: string, type: string, role: string, contract: Contract | null, session: AuthSession | null
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.nameCompany = nameCompany;
        this.numberPhone = numberPhone;
        this.type = type;
        this.role = role;
        this.contract = contract;
        this.session = session;
    }

    static fromJson(json: IUserJSON): User {
        return new User({
            id: json.id,
            name: json.name,
            email: json.email,
            nameCompany: json.nameCompany,
            numberPhone: json.numberPhone,
            type: json.type,
            role: json.role,
            contract: json.contract ? Contract.fromJson(json.contract) : null,
            session: json.session ? AuthSession.fromJson(json.session) : null
        });
    }
}

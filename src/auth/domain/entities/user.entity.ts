import { AuthSession, IAuthSessionJSON } from "./auth.entity";
import { Contract, IContractJSON } from "./contract.entity";

export interface IUserJSON {
    id: string;
    name: string;
    email: string;
    name_company: string;
    number_phone: string;
    type: string;
    role: string;
    otp: string | null;
    contract: IContractJSON | null;
    session: IAuthSessionJSON | null;
}

export default class User {
    readonly id: string | null;
    readonly name: string;
    readonly email: string;
    readonly name_company: string;
    readonly number_phone: string;
    readonly type: string;
    readonly role: string;
    readonly session: AuthSession | null;
    readonly otp: string | null;
    readonly contract: Contract | null;


    constructor({ id = null, email = "", name = "", name_company = "", number_phone = "", type = "", role = "", session = null, otp = null, contract = null }: {
        id: string | null, email: string, name: string, name_company: string, number_phone: string, type: string, role: string, session: AuthSession | null, otp: string | null, contract: Contract | null
    }) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.name_company = name_company;
        this.number_phone = number_phone;
        this.type = type;
        this.role = role;
        this.session = session;
        this.otp = otp;
        this.contract = contract;
    }

    static fromJson(json: IUserJSON): User {
        return new User({
            id: json.id,
            name: json.name,
            email: json.email,
            name_company: json.name_company,
            number_phone: json.number_phone,
            type: json.type,
            role: json.role,
            session: json.session ? AuthSession.fromJson(json.session) : null,
            otp: json.otp ?? null,
            contract: json.contract ? Contract.fromJson(json.contract) : null,

        });
    }
}

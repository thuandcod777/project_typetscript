import { Contract, IContractJSON } from "./contract.entity";
import User, { IUserJSON } from "./user.entity";


export default class UserContract {
    readonly user: User;
    readonly contract: Contract | null;

    constructor({ user, contract = null }: {
        user: User, contract?: Contract | null
    }) {
        this.user = user;
        this.contract = contract;
    }
}
import { Contract, IContractJSON } from "./contract.entity";
import Order from "./order.entity";
import User from "./user.entity";


export default class ObjectData {
    readonly user: User;
    readonly contract: Contract | null;
    readonly order: Order | null;

    constructor({ user, contract = null, order = null }: {
        user: User, contract?: Contract | null, order?: Order | null
    }) {
        this.user = user;
        this.contract = contract;
        this.order = order;
    }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObjectData {
    user;
    contract;
    order;
    constructor({ user, contract = null, order = null }) {
        this.user = user;
        this.contract = contract;
        this.order = order;
    }
}
exports.default = ObjectData;

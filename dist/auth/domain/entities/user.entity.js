"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    _id;
    name;
    email;
    name_company;
    number_phone;
    type;
    role;
    constructor({ _id = null, email = null, name = null, name_company = null, number_phone = null, type = null, role = null }) {
        this._id = _id;
        this.name = name;
        this.email = email;
        this.name_company = name_company;
        this.number_phone = number_phone;
        this.type = type;
        this.role = role;
    }
    static fromJson(json) {
        return new User(json);
    }
}
exports.default = User;

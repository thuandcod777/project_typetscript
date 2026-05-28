"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_1 = __importDefault(require("../../domain/users"));
const users_model_1 = require("../models/users_model");
class UsersRepository {
    constructor(client) {
        this.client = client;
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = this.client.model('User', users_model_1.UserSchema);
            const user = yield userModel.find().catch((_) => null);
            if (user === null)
                return Promise.reject('No User found');
            return this.allUser(user);
        });
    }
    allUser(users) {
        return users.map((user) => { var _a; return new users_1.default(user.id, user.email, user.name, (_a = user.password) !== null && _a !== void 0 ? _a : '', user.type); });
    }
}
exports.default = UsersRepository;

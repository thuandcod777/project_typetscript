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
const user_1 = __importDefault(require("../../domain/user"));
const user_model_1 = require("../model/user_model");
class AuthRepository {
    constructor(client) {
        this.client = client;
    }
    find(email) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const users = this.client.model('User', user_model_1.UserSchema);
            const user = yield users.findOne({ email: email.toLowerCase() });
            if (!user)
                return Promise.reject('User not found');
            return new user_1.default(user.id, user.name, user.email, (_a = user.password) !== null && _a !== void 0 ? _a : '', user.type);
        });
    }
    add(email, name, auth_type, passwordHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const userModel = this.client.model('User', user_model_1.UserSchema);
            const saveUser = yield userModel.create({
                email: email.toLowerCase(),
                name: name,
                type: auth_type,
                password: passwordHash,
            });
            if (passwordHash)
                saveUser.password = passwordHash;
            saveUser.save();
            return saveUser.id;
        });
    }
}
exports.default = AuthRepository;

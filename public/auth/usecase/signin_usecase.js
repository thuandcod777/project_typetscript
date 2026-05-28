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
Object.defineProperty(exports, "__esModule", { value: true });
class SignInUseCase {
    constructor(authRepository, passwordService) {
        this.authRepository = authRepository;
        this.passwordService = passwordService;
    }
    execute(name, email, auth_type, password) {
        return __awaiter(this, void 0, void 0, function* () {
            /* const user=await this.authRepository.find(email);
            if (password === '' && user) return user.id
    
            if(!(await this.passwordService.compare(password,user.password))){
                return Promise.reject('Invalid email or password')
            }
    
            return user.id */
            if (auth_type === 'email')
                return this.emailLogin(email, password);
            return this.oauthLogin(email, name, auth_type);
        });
    }
    emailLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.find(email).catch((_) => null);
            if (!user || !(yield this.passwordService.compare(password, user.password)))
                return Promise.reject('Invalid email or password');
            return user.id;
        });
    }
    oauthLogin(email, name, auth_type) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.find(email).catch((_) => null);
            if (user && user.type === 'email')
                return Promise.reject('Account already exists, log in with password');
            if (user)
                return user.id;
            const userId = yield this.authRepository.add(email, name, auth_type);
            return userId;
        });
    }
}
exports.default = SignInUseCase;

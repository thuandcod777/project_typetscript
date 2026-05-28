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
class AuthController {
    constructor(signinUseCase, signupUseCase, tokenService, orderUseCase) {
        this.signinUseCase = signinUseCase;
        this.signupUseCase = signupUseCase;
        this.tokenService = tokenService;
        this.orderUseCase = orderUseCase;
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, auth_type, password } = req.body;
                return this.signinUseCase
                    .execute(name, email, auth_type, password)
                    .then((id) => res.status(200).json({ auth_token: this.tokenService.encode(id) }))
                    .catch((err) => res.status(404).json({ error: err.message }));
            }
            catch (err) {
                return res.status(400).json({ error: err });
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, name, auth_type, password } = req.body;
                return this.signupUseCase
                    .execute(email, name, auth_type, password)
                    .then((id) => res.status(200).json({ auth_token: this.tokenService.encode(id) }))
                    .catch((err) => res.status(404).json({ error: err.message }));
            }
            catch (err) {
                return res.status(400).json({ error: err });
            }
        });
    }
    saveorder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { namePerson, nameProduct, numberProduct, orderDate } = req.body;
                return this.orderUseCase
                    .execute(namePerson, nameProduct, numberProduct, orderDate)
                    .then((id) => res.status(200).json({ save: id, }))
                    .catch((err) => res.status(404).json({ error: err.message }));
            }
            catch (err) {
                return res.status(400).json({ error: err });
            }
        });
    }
}
exports.default = AuthController;

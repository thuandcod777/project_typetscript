"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtTokenService {
    privateKey;
    constructor(privateKey) {
        this.privateKey = privateKey;
    }
    generateAccessToken(payload) {
        let token = jsonwebtoken_1.default.sign({ data: payload }, this.privateKey, {
            issuer: 'project',
            expiresIn: '15m'
        });
        return token;
    }
    generateRefreshToken(payload) {
        let token = jsonwebtoken_1.default.sign({ data: payload }, this.privateKey, { issuer: 'project', expiresIn: '10d' });
        return token;
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.privateKey);
            return decoded;
        }
        catch (err) {
            return 'Invalid Token';
        }
    }
}
exports.default = JwtTokenService;

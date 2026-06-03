import ITokenService from "../../services/itoken_service";
import jwt from "jsonwebtoken"

export default class JwtTokenService implements ITokenService {
    constructor(private readonly privateKey: string) { }

    generateAccessToken(payload: string | object): string | object {
        let token = jwt.sign({ data: payload }, this.privateKey, {
            issuer: 'project',
            expiresIn: '15m'
        });
        return token;
    }

    generateRefreshToken(payload: string | object): string | object {
        let token = jwt.sign({ data: payload }, this.privateKey, { issuer: 'project', expiresIn: '10d' })
        return token;
    }

    verifyAccessToken(token: string): string | object {
        try {
            const decoded = jwt.verify(token, this.privateKey);
            return decoded;
        } catch (err) {
            return 'Invalid Token';
        }
    }

    verifyRefreshToken(token: string): string | object {
        try {
            const decoded = jwt.verify(token, this.privateKey);
            return decoded;
        } catch (err) {
            return 'Invalid Token';
        }
    }
}
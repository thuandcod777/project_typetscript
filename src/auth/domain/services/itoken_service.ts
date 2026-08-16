export default interface ITokenService {
    generateAccessToken(payload: string | object): string | object;
    generateRefreshToken(payload: string | object): string | object;
    verifyToken(token: string | object): string | object;
}
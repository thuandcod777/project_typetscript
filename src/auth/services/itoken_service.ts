export default interface ITokenService {
    generateAccessToken(payload: string | object): string | object;
    generateRefreshToken(payload: string | object): string | object;
    verifyAccessToken(token: string | object): string | object;
    verifyRefreshToken(token: string | object): string | object;
}
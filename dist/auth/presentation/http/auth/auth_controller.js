"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSessionSchema = void 0;
const zod_1 = require("zod");
exports.UserSessionSchema = zod_1.z.object({
    token: zod_1.z.string(),
    role: zod_1.z.string(),
}).strict();
class AuthController {
    getUserProfileUsecase;
    constructor(getUserProfileUsecase) {
        this.getUserProfileUsecase = getUserProfileUsecase;
    }
    async getUserProfile(req, res) {
        try {
            const safeUserSession = exports.UserSessionSchema.parse(req.body);
            const result = await this.getUserProfileUsecase.execute(safeUserSession);
            return res.status(result.status).json({
                data: {
                    success: result.success, user: result.data.user, contract: result.data.contract, message: result.message
                }
            });
        }
        catch (error) {
            return res.status(500).json({ error: "Lỗi hệ thống nghiêm trọng." });
        }
    }
}
exports.default = AuthController;

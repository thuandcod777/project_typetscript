"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const geoJsonPointSchema = zod_1.z.object({
    type: zod_1.z.string().refine((val) => val === 'Point', {
        message: "Type phải là 'Point'"
    }),
    coordinates: zod_1.z.tuple([zod_1.z.number().min(-180).max(180),
        zod_1.z.number().min(-90).max(90)])
}).strict();
const scopeItemSchema = zod_1.z.object({
    is_scope: zod_1.z.boolean().default(true),
    address: zod_1.z.string().trim().default(""),
    location: geoJsonPointSchema
}).strict();
const scopeCollectionSchema = zod_1.z.object({
    user_id: zod_1.z.string(),
    step_contract: zod_1.z.number(),
    scopes: zod_1.z.array(scopeItemSchema),
    is_success: zod_1.z.boolean().default(false),
}).strict();
class ScopeController {
    scopeUsecase;
    constructor(scopeUsecase) {
        this.scopeUsecase = scopeUsecase;
    }
    async saveScope(req, res) {
        try {
            const safeScopeData = scopeCollectionSchema.parse(req.body);
            const result = await this.scopeUsecase.execute(safeScopeData);
            return res.status(result.status).json({
                data: {
                    success: result.success,
                    message: result.message
                }
            });
        }
        catch (err) {
            if (err instanceof zod_1.z.ZodError) {
                return res.status(400).json({
                    success: false,
                    error: "Dữ liệu gửi lên không hợp lệ",
                    details: err.issues.map(e => ({
                        field: e.path.join('.'),
                        message: e.message
                    }))
                });
            }
            return res.status(500).json({
                success: false,
                error: "Internal Server Error",
                message: err instanceof Error ? err.message : String(err)
            });
        }
    }
}
exports.default = ScopeController;

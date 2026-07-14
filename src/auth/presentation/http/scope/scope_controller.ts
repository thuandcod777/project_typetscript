import { success, z } from "zod";
import ScopeUsecase from "../../../usecase/scope_usecase";
import { Request, Response } from 'express';
import { IGeoJsonPoint } from "../../../domain/entities/scope.entity";
import { IScopeInputDTO } from "../../../domain/dtos/scope_input.dto";

const geoJsonPointSchema: z.ZodType<IGeoJsonPoint> = z.object({
    type: z.string().refine((val) => val === 'Point', {
        message: "Type phải là 'Point'"
    }) as any,
    coordinates: z.tuple([z.number().min(-180).max(180),
    z.number().min(-90).max(90)])
}).strict();

const scopeItemSchema = z.object({
    is_scope: z.boolean().default(true),
    address: z.string().trim().default(""),
    location: geoJsonPointSchema
}).strict();

const scopeCollectionSchema: z.ZodType<IScopeInputDTO> = z.object({
    email: z.string(),
    step_contract: z.number(),
    scopes: z.array(scopeItemSchema),
    is_success: z.boolean().default(false),
    is_verify_scope: z.boolean().default(false)
}).strict();


export default class ScopeController {
    private readonly scopeUsecase: ScopeUsecase;

    constructor(scopeUsecase: ScopeUsecase) {
        this.scopeUsecase = scopeUsecase;
    }

    public async saveScope(req: Request, res: Response) {
        try {
            const safeScopeData = scopeCollectionSchema.parse(req.body);

            const result = await this.scopeUsecase.execute(safeScopeData);

            return res.status(result.status).json({
                data: {
                    success: result.success,
                    message: result.message
                }
            });

        } catch (err) {
            if (err instanceof z.ZodError) {
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
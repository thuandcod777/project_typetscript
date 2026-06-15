import { email, z } from "zod";
import ScopeUsecase from "../../../usecase/scope_usecase";
import { Request, Response } from 'express';
import Scope from "../../../domain/entities/scope.entity";
import { ScopeCollection } from "../../../domain/entities/scope-collection.entity";


const geoJsonPointSchema = z.object({
    type: z.string().refine((val) => val === 'Point', {
        message: "Type phải là 'Point'"
    }),
    coordinates: z.tuple([z.number().min(-180).max(180),
    z.number().min(-90).max(90)])
})

const scopeItemSchema = z.object({
    is_scope: z.boolean().default(true),
    address: z.string().trim().default(""),
    location: geoJsonPointSchema
});

const scopeCollectionSchema = z.object({
    is_success: z.boolean().default(false),
    scopes: z.array(scopeItemSchema)
});

type IScopeModel = z.infer<typeof scopeCollectionSchema>;

export default class ScopeController {
    private readonly scopeUsecase: ScopeUsecase;
    constructor(scopeUsecase: ScopeUsecase) {
        this.scopeUsecase = scopeUsecase;
    }

    public async saveScope(req: Request, res: Response) {
        try {
            const validatedBody: IScopeModel = await scopeCollectionSchema.parseAsync(req.body);

            const rawScopes = validatedBody.scopes;

            const scopeModels: ScopeCollection[] = rawScopes.map(item => ScopeCollection.fromJson(item as any));

            const scope = await this.scopeUsecase.execute("m.q.thuan777@gmail.com", scopeModels);

            return res.status(200).json({ scope: scope });

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
}
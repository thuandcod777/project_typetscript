import { z } from "zod";
import ScopeUsecase from "../../usecase/scope_usecase";
import { Request, Response } from 'express';
import { ScopeModel } from "../../domain/scope";

const ScopeModelSchema = z.object({
    body: z.object({
        email: z.string(),
        scopes: z.array(
            z.object({
                address: z.string().trim().default(""),
                location: z.object({
                    type: z.string().refine(val => val === "Point", {
                        message: "Type must be exactly 'Point'"
                    }) as z.ZodType<"Point">,
                    coordinates: z.tuple([
                        z.number().min(-180).max(180),
                        z.number().min(-90).max(90)
                    ])
                })
            })
        ).nonempty({ message: "Scope list cannot be empty" })
    })
});

type IScopeModel = z.infer<typeof ScopeModelSchema>['body'];

export default class ScopeController {
    private readonly scopeUsecase: ScopeUsecase;
    constructor(scopeUsecase: ScopeUsecase) {
        this.scopeUsecase = scopeUsecase;
    }

    public async saveScope(req: Request, res: Response) {
        try {
            const validatedRequest = await ScopeModelSchema.parseAsync({ body: req.body });
            const { email, scopes: rawScopes } = validatedRequest.body;

            const scopeModels: ScopeModel[] = rawScopes.map(item => ScopeModel.fromJson(item));
            const scope = await this.scopeUsecase.execute(email, scopeModels);
            return res.status(200).json({ scope: scope });

        } catch (err) {
            return res.status(400).json({ error: err });
        }
    }
}
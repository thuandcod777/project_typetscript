import { z } from "zod";
import { IContactInputDTO } from "../../../domain/dtos/contact_input.dto";
import CreateContactUsecase from "../../../usecase/create_contact_usecase";
import { Request, Response } from 'express';

const contactSchema: z.ZodType<IContactInputDTO> = z.object({
    name_enterprise: z.string(),
    name_client: z.string(),
    email: z.string(),
    address: z.string(),
    number_phone: z.string(),
    name_product: z.string(),
    amount: z.number(),
    types: z.string(),
    workday: z.string()
});

export default class ContactController {
    private readonly createContactUsecase: CreateContactUsecase;

    constructor(createContactUsecase: CreateContactUsecase) {
        this.createContactUsecase = createContactUsecase
    }

    public async createContact(req: Request, res: Response) {
        const safeContactData = contactSchema.parse(req.body);
        const result = await this.createContactUsecase.execute(safeContactData);
        return res.status(result.status).json({
            data: {
                success: result.success,
                message: result.message
            }
        })
    }
}
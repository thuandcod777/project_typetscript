import { Router, Request, Response } from "express";
import IContactRepository from "../../../domain/services/icontact_repository";
import CreateContactUsecase from "../../../usecase/create_contact_usecase";
import ContactController from "./contact_controller";

export default class ContactRouter {
    public static configure(contactRepository: IContactRepository) {
        const router = Router();

        let controller = ContactRouter.composeController(contactRepository);

        router.post('/createcontact', (req: Request, res: Response) => controller.createContact(req, res));

        return router;
    }


    private static composeController(contactRepository: IContactRepository) {

        const createContactUsecase = new CreateContactUsecase(contactRepository);

        const controller = new ContactController(createContactUsecase);

        return controller;
    }
}
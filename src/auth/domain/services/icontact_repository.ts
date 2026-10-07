import { IContactInputDTO } from "../dtos/contact_input.dto";

export default interface IContactRepository {
    createContact(contactData: IContactInputDTO): Promise<{ success: boolean, message: string }>;
}
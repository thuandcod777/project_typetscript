import { Mongoose } from "mongoose";
import { IContactInputDTO } from "../../domain/dtos/contact_input.dto";
import IContactRepository from "../../domain/services/icontact_repository";
import { ContactSchema, IContact } from "../model/contact_model";

export default class ContactRepository implements IContactRepository {
    constructor(private readonly client: Mongoose) { }


    public async createContact(contactData: IContactInputDTO): Promise<{ success: boolean; message: string; }> {
        let contactModel = this.client.model<IContact>('Contact', ContactSchema);

        const contactQuery = new contactModel({
            name_enterprise: contactData.name_enterprise,
            name_client: contactData.name_client,
            email: contactData.email,
            address: contactData.address,
            number_phone: contactData.number_phone,
            name_product: contactData.name_product,
            amount: contactData.amount,
            types: contactData.types,
            workday: contactData.workday
        });


        await contactQuery.save();

        if (!contactQuery) {
            return { success: false, message: "Đăng ký liên hệ không thành công." };
        }

        return { success: true, message: "Đăng ký liên hệ thành công." };
    }


}
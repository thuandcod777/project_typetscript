import { IContactInputDTO } from "../domain/dtos/contact_input.dto";
import { ResponseDto } from "../domain/entities/response.entity";
import IContactRepository from "../domain/services/icontact_repository";

export default class CreateContactUsecase {
    constructor(private contactRepository: IContactRepository) { }

    public async execute(contactData: IContactInputDTO): Promise<ResponseDto> {

        let result = await this.contactRepository.createContact(contactData);

        if (!result.success) {
            return ResponseDto.failure(result.message);

        }

        return ResponseDto.success(result.message);
    }
}
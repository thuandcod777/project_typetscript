import fa from "zod/v4/locales/fa.cjs";
import IContractRepository from "../domain/services/icontract_repository";
import { IContractDetailsInputDTO } from "../domain/dtos/contract_details_input.dto";
import { IEmailInputDTO } from "../domain/dtos/email_input.dto";

export default class CreateContractUsecase {
    constructor(private contractRepository: IContractRepository) { }

    public async execute(email: IEmailInputDTO, contract_data: IContractDetailsInputDTO): Promise<boolean> {
        const data = await this.contractRepository.create_contract(email, contract_data);

        if (!data) {
            return false;
        }

        return true;
    }
}
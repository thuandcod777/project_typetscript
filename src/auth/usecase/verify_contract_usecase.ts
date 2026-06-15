import { IEmailInputDTO } from "../domain/dtos/email_input.dto";
import IContractRepository from "../domain/services/icontract_repository";

export default class VerifyContractUsecase {
    constructor(private verifyRepository: IContractRepository) { }

    public async execute(email: IEmailInputDTO): Promise<boolean> {
        await this.verifyRepository.verify_contract(email);

        return true;
    }
}
import { IContractDetailsInputDTO } from "../dtos/contract_details_input.dto";
import { IEmailInputDTO } from "../dtos/email_input.dto";

export default interface IContractRepository {
    verify_contract(email: IEmailInputDTO): Promise<boolean>;
    create_contract(contract_code: IEmailInputDTO, contractDetail: IContractDetailsInputDTO): Promise<boolean>;
}
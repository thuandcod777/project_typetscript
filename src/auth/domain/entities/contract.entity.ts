import { IPdfData } from "../../data/model/contract_model";
import { ContractDetails } from "./contract-details.entity";
import { ContractPdf, IContractPdfJSON } from "./contract-pdf.entity";
import Scope, { IScopeJSON } from "./scope.entity";

export type StatusContract = 'registered' | 'note scope' | 'agree' | 'finished';

export interface IContractJSON {
    contract_code: string;
    step_contract: number;
    contract_details: ContractDetails | null;
    scope: IScopeJSON | null;
    contract_pdf: IContractPdfJSON | null;
    is_success: boolean;
}

export class Contract {
    contract_code: string;
    step_contract: number;
    contract_details: ContractDetails | null;
    scope: Scope | null;
    contract_pdf: ContractPdf | null;
    is_success: boolean;

    constructor({ contract_code = '', step_contract = 0, contract_details = new ContractDetails(), scope = new Scope(), contract_pdf = new ContractPdf(), is_success = false }: Partial<Contract> = {}) {
        this.contract_code = contract_code;
        this.step_contract = step_contract;
        this.contract_details = contract_details;
        this.scope = scope;
        this.contract_pdf = contract_pdf;
        this.is_success = is_success;
    }

    static fromJson(json: IContractJSON): Contract {
        return new Contract({
            contract_code: json.contract_code,
            step_contract: json.step_contract,
            contract_details: json.contract_details ? ContractDetails.fromJson(json.contract_details) : null,
            scope: json.scope ? Scope.fromJson(json.scope) : null,
            contract_pdf: json.contract_pdf ? ContractPdf.fromJson(json.contract_pdf) : null,
            is_success: json.is_success
        })
    }
}

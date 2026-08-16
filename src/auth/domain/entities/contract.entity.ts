import { IPdfData } from "../../data/model/contract_model";
import { ContractDetails } from "./contract-details.entity";
import { ContractPdf, IContractPdfJSON } from "./contract-pdf.entity";
import Scope, { IScopeJSON } from "./scope.entity";

export type StatusContract = 'registered' | 'note scope' | 'agree' | 'finished';

export interface IContractJSON {
    user_id: string;
    contract_code: string;
    step_contract: number;
    contract_details: ContractDetails | null;
    scope: IScopeJSON | null;
    contract_pdf: IContractPdfJSON | null;
    is_success: boolean;
}

export class Contract {
    user_id: string;
    contract_code: string;
    step_contract: number;
    contract_details: ContractDetails | null;
    scope: Scope | null;
    contract_pdf: ContractPdf | null;
    is_success: boolean;

    constructor({ user_id = '', contract_code = '', step_contract = 0, contract_details = null, scope = null, contract_pdf = null, is_success = false }: Partial<Omit<Contract, 'scope' | 'contract_pdf' | 'contract_details'>> & {
        contract_details?: ContractDetails | null;
        scope?: Scope | null;
        contract_pdf?: ContractPdf | null;
    } = {}) {
        this.user_id = user_id;
        this.contract_code = contract_code;
        this.step_contract = step_contract;
        this.contract_details = contract_details;
        this.scope = scope;
        this.contract_pdf = contract_pdf;
        this.is_success = is_success;
    }

    static fromJson(json: IContractJSON): Contract {
        return new Contract({
            user_id: json.user_id,
            contract_code: json.contract_code,
            step_contract: json.step_contract,
            is_success: json.is_success,
            contract_details: json.contract_details ? ContractDetails.fromJson(json.contract_details) : null,
            scope: json.scope ? Scope.fromJson(json.scope) : null,
            contract_pdf: json.contract_pdf ? ContractPdf.fromJson(json.contract_pdf) : null,
        })
    }
}

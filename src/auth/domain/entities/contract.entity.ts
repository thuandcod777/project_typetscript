import { IPdfData } from "../../data/model/contract_model";
import { ContractDetails } from "./contract-details.entity";
import { ContractPdf, IContractPdfJSON } from "./contract-pdf.entity";
import Scope, { IScopeJSON } from "./scope.entity";

export type StatusContract = 'registered' | 'note scope' | 'agree' | 'finished';

export interface IContractJSON {
    contractCode: string;
    stepContract: number;
    contractDetails: ContractDetails | null;
    scope: IScopeJSON | null;
    contractPdf: IContractPdfJSON | null;
}

export class Contract {
    contractCode: string;
    stepContract: number;
    contractDetails: ContractDetails | null;
    scope: Scope | null;
    contractPdf: ContractPdf | null;

    constructor({ contractCode = '', stepContract = 0, contractDetails = new ContractDetails(), scope = new Scope(), contractPdf = new ContractPdf() }: Partial<Contract> = {}) {
        this.contractCode = contractCode;
        this.stepContract = stepContract;
        this.contractDetails = contractDetails;
        this.scope = scope;
        this.contractPdf = contractPdf;
    }

    static fromJson(json: IContractJSON): Contract {
        return new Contract({
            contractCode: json.contractCode,
            stepContract: json.stepContract,
            contractDetails: json.contractDetails ? ContractDetails.fromJson(json.contractDetails) : null,
            scope: json.scope ? Scope.fromJson(json.scope) : null,
            contractPdf: json.contractPdf ? ContractPdf.fromJson(json.contractPdf) : null
        })
    }
}

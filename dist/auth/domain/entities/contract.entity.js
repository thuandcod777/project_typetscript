"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const contract_details_entity_1 = require("./contract-details.entity");
const contract_pdf_entity_1 = require("./contract-pdf.entity");
const scope_entity_1 = __importDefault(require("./scope.entity"));
class Contract {
    user_id;
    contract_code;
    step_contract;
    contract_details;
    scope;
    contract_pdf;
    is_success;
    constructor({ user_id = '', contract_code = '', step_contract = 0, contract_details = null, scope = null, contract_pdf = null, is_success = false } = {}) {
        this.user_id = user_id;
        this.contract_code = contract_code;
        this.step_contract = step_contract;
        this.contract_details = contract_details;
        this.scope = scope;
        this.contract_pdf = contract_pdf;
        this.is_success = is_success;
    }
    static fromJson(json) {
        return new Contract({
            user_id: json.user_id,
            contract_code: json.contract_code,
            step_contract: json.step_contract,
            is_success: json.is_success,
            contract_details: json.contract_details ? contract_details_entity_1.ContractDetails.fromJson(json.contract_details) : null,
            scope: json.scope ? scope_entity_1.default.fromJson(json.scope) : null,
            contract_pdf: json.contract_pdf ? contract_pdf_entity_1.ContractPdf.fromJson(json.contract_pdf) : null,
        });
    }
}
exports.Contract = Contract;

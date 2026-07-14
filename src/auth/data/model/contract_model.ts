import { Schema } from "mongoose";
import { IScopeCollection, ScopeSchema } from "./scope_model";

export interface IPdfData {
    name: string;
    buffer: Buffer;
    mime_type: string;
}

const PdfSchema = new Schema<IPdfData>({
    name: { type: String, required: true },
    buffer: { type: Buffer, required: true },
    mime_type: { type: String, default: 'application/pdf' }
}, { _id: true, timestamps: true });

export interface IContract {
    number_contract: string;
    name_client_a: string;
    name_business_owner_b: string;
    name_enterprise_a: string;
    name_enterprise_b: string;
    business_register_number_a: string;
    business_register_number_b: string;
    name_product: string;
    type_weight: string;
    type_product: string;
    pickup_location: string;
    delivery_location: string;
    method_contract: string;
    method_delivery: string;
    method_payment: string;
}

export const ContractSchema = new Schema({
    number_contract: { type: String, required: true },
    name_client_a: { type: String, required: true },
    name_business_owner_b: { type: String, required: true },
    name_enterprise_a: { type: String, required: true },
    name_enterprise_b: { type: String, required: true },
    business_register_number_a: { type: String, required: true },
    business_register_number_b: { type: String, required: true },
    name_product: { type: String },
    type_weight: { type: String },
    type_product: { type: String },
    pickup_location: { type: String },
    delivery_location: { type: String },
    method_contract: { type: String },
    method_delivery: { type: String },
    method_payment: { type: String },
}, { _id: true, timestamps: true })

export interface IStepContract {
    contract_code: string;
    step_contract: number;
    scope: IScopeCollection;
    contract_details: IContract;
    contract_pdf: IPdfData;
    is_success: boolean;
}

export const StepContractSchema = new Schema({
    contract_code: { type: String },
    step_contract: { type: Number },
    scope: { type: ScopeSchema, default: null },
    contract_details: { type: ContractSchema, default: null },
    contract_pdf: { type: PdfSchema, default: null },
    is_success: { type: Boolean, default: false }
}, { _id: true, timestamps: true })

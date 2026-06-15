import mongoose, { Schema, Types } from "mongoose";
import { IScopeCollection, ScopeSchema } from "./scope_model";
import { boolean } from "zod";


export type StatusContract = 'registered' | 'note scope' | 'agree' | 'finished';

export interface IPdfData {
    name: string;
    data: Buffer;
    contentType: string;
}

const PdfSchema = new Schema<IPdfData>({
    name: { type: String, required: true },
    data: { type: Buffer, required: true },
    contentType: { type: String, default: 'application/pdf' }
}, { _id: true, timestamps: true });

export interface IContract {
    nameBrandA: string;
    nameBrandB: string;
    businessRegisterNumber: number;
    numberContract: number;
    nameProduct: string;
    typeWeight: string;
    typeProduct: string;
    addressStart: string;
    addressEnd: string;
    methodContract: string;
    methodDelivery: string;
    methodPayment: string;
}

export const ContractSchema = new Schema({
    nameBrandA: { type: String, required: true },
    nameBrandB: { type: String, required: true },
    businessRegisterNumber: { type: Number, required: true },
    numberContract: { type: Number, required: true },
    nameProduct: { type: String },
    typeWeight: { type: String },
    typeProduct: { type: String },
    addressStart: { type: String },
    addressEnd: { type: String },
    methodContract: { type: String },
    methodDelivery: { type: String },
    methodPayment: { type: String },
}, { _id: true, timestamps: true })

export interface IStepContract {
    contractCode: string;
    stepContract: number;
    contractDetails: IContract;
    scope: IScopeCollection;
    contractPdf: IPdfData;
}

export const StepContractSchema = new Schema({
    contractCode: { type: String },
    stepContract: { type: Number },
    contractDetails: { type: ContractSchema, default: null },
    scope: { type: ScopeSchema, default: null },
    contractPdf: { type: PdfSchema, default: null },
}, { _id: true, timestamps: true })

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractSchema = exports.ContractDetailSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const scope_model_1 = require("./scope_model");
const PdfSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    buffer: { type: Buffer, required: true },
    mime_type: { type: String, default: 'application/pdf' }
}, { _id: true, timestamps: true });
exports.ContractDetailSchema = new mongoose_1.Schema({
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
}, { _id: true, timestamps: true });
exports.ContractSchema = new mongoose_1.Schema({
    user_id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    contract_code: { type: String },
    step_contract: { type: Number },
    scope: { type: scope_model_1.ScopeSchema, default: null },
    contract_details: { type: exports.ContractDetailSchema, default: null },
    contract_pdf: { type: PdfSchema, default: null },
    is_success: { type: Boolean, default: false }
}, { _id: true, timestamps: true });

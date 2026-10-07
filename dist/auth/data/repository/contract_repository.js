"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contract_model_1 = require("../model/contract_model");
const contract_entity_1 = require("../../domain/entities/contract.entity");
class ContractRepository {
    client;
    constructor(client) {
        this.client = client;
    }
    async createContract(userId, contract_code, step_contract, session) {
        const contractModel = this.client.model('Contract', contract_model_1.ContractSchema);
        const updateOptions = { returnDocument: 'after' };
        if (session) {
            updateOptions.session = session;
        }
        const contractQuery = new contractModel({
            user_id: userId.toString(),
            contract_code: contract_code,
            step_contract: step_contract,
            contract_details: null,
            scope: null,
            contract_pdf: null,
            is_success: false
        });
        await contractQuery.save({ session: session ? session : null });
        return { success: true, message: "Đăng ký hợp đồng thành công." };
    }
    async uploadPdf(uploadPdfData, session) {
        const contractModel = this.client.model('Contract', contract_model_1.ContractSchema);
        const updateOptions = {
            returnDocument: 'after'
        };
        if (session) {
            updateOptions.session = session;
        }
        const contractPdf = await contractModel.findOneAndUpdate({ user_id: uploadPdfData.user_id }, {
            $set: {
                step_contract: uploadPdfData.step_contract,
                contract_details: uploadPdfData.contract_details,
                contract_pdf: {
                    name: uploadPdfData.contract_pdf.originalname,
                    buffer: uploadPdfData.contract_pdf.buffer,
                    mime_type: uploadPdfData.contract_pdf.mimetype
                }
            }
        }, updateOptions).lean();
        return { success: true, message: "Đăng ký thông tin hợp đồng thành công." };
    }
    async getContract(userId, session) {
        const contractModel = this.client.model('Contract', contract_model_1.ContractSchema);
        const contractQuery = contractModel.findOne({ user_id: userId });
        if (session) {
            contractQuery.session(session);
        }
        else {
            contractQuery.readConcern('majority');
        }
        const contract = await contractQuery.lean();
        const contractData = contract ? contract_entity_1.Contract.fromJson({
            user_id: contract.user_id.toString(),
            contract_code: contract.contract_code,
            step_contract: contract.step_contract,
            contract_details: contract.contract_details,
            scope: contract.scope,
            contract_pdf: contract.contract_pdf,
            is_success: contract.is_success
        }) : null;
        return { success: true, contractData: contractData, message: "Tìm thấy thông tin hợp đồng thành công." };
    }
}
exports.default = ContractRepository;

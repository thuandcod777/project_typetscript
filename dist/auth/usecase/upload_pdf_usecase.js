"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_entity_1 = require("../domain/entities/response.entity");
class UploadPdfUsecase {
    contractRepository;
    constructor(contractRepository) {
        this.contractRepository = contractRepository;
    }
    async execute(uploadPdfData) {
        const data = await this.contractRepository.uploadPdf(uploadPdfData);
        if (!data) {
            return response_entity_1.ResponseDto.failure('Tải file pdf không thành công');
        }
        return response_entity_1.ResponseDto.success('Đăng tải thành công');
    }
}
exports.default = UploadPdfUsecase;

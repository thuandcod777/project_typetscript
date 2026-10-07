"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionFailure = void 0;
class TransactionFailure extends Error {
    response;
    constructor(response) {
        super(response.message);
        this.response = response;
        this.name = 'TransactionFailure';
        // Đảm bảo prototype hoạt động chính xác khi kế thừa Error trong TypeScript
        Object.setPrototypeOf(this, TransactionFailure.prototype);
    }
}
exports.TransactionFailure = TransactionFailure;

import { ResponseDto } from "../entities/response.entity";

export class TransactionFailure extends Error {
    constructor(public readonly response: ResponseDto) {
        super(response.message);
        this.name = 'TransactionFailure';

        // Đảm bảo prototype hoạt động chính xác khi kế thừa Error trong TypeScript
        Object.setPrototypeOf(this, TransactionFailure.prototype);
    }
}
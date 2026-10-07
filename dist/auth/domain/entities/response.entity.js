"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseDto = void 0;
class ResponseDto {
    success;
    status;
    message;
    data;
    constructor(success, status, message, data) {
        this.success = success;
        this.status = status;
        this.message = message;
        if (data !== undefined) {
            this.data = data;
        }
    }
    static success(message, data, status = 200) {
        return new ResponseDto(true, status, message, data);
    }
    static failure(message, status = 400) {
        return new ResponseDto(false, status, message);
    }
}
exports.ResponseDto = ResponseDto;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedError = void 0;
class UnauthorizedError extends Error {
    message;
    constructor(message) {
        super(message);
        this.message = message;
        this.name = "UnauthorizedError";
    }
}
exports.UnauthorizedError = UnauthorizedError;

export class ResponseDto<T = any> {
    public readonly success: boolean;
    public readonly status: number;
    public readonly message: string;
    public readonly data?: T;

    constructor(success: boolean, status: number, message: string, data?: T) {
        this.success = success;
        this.status = status;
        this.message = message;

        if (data !== undefined) {
            this.data = data;
        }
    }

    public static success<R>(message: string, data?: R, status = 200): ResponseDto<R> {
        return new ResponseDto<R>(true, status, message, data);
    }

    public static failure<T = null>(message: string, status = 400): ResponseDto<T> {
        return new ResponseDto<T>(false, status, message);
    }
}
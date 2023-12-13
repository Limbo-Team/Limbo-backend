import { StatusCodes } from 'http-status-codes';
import { AxiosError } from 'axios';

class ApplicationError extends Error {
    statusCode: StatusCodes;
    status: string;

    constructor(message: string, statusCode: StatusCodes) {
        super(message);
        this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        this.status = this.statusCode >= 500 ? 'Error' : 'Fail';
        Error.captureStackTrace(this, this.constructor);
    }

    static isAxiosError(error: unknown): error is AxiosError {
        return error instanceof AxiosError;
    }

    static isApplicationError(error: unknown): error is ApplicationError {
        return error instanceof ApplicationError;
    }
}

export default ApplicationError;

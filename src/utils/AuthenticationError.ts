import { StatusCodes } from 'http-status-codes';
import ApplicationError from './ApplicationError';

class AuthenticationError extends ApplicationError {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}

export default AuthenticationError;

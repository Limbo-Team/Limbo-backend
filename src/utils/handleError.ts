import { StatusCodes } from 'http-status-codes';
import ApplicationError from './ApplicationError';

const handleError = (
    error: unknown,
    message: string = 'Encountered an error',
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
) => {
    if (ApplicationError.isApplicationError(error)) {
        return error;
    }
    if (ApplicationError.isAxiosError(error)) {
        return new ApplicationError(error.message, error.response?.status as StatusCodes);
    }
    return new ApplicationError(message, statusCode);
};

export default handleError;

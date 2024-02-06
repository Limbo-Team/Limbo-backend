import { StatusCodes } from 'http-status-codes';
import ApplicationError from './ApplicationError';

const validateRequestBody = <T>(requestBody: T, properties: (keyof T)[]) => {
    if (!requestBody) {
        throw new ApplicationError('Request body is required', StatusCodes.BAD_REQUEST);
    }

    properties.forEach((property) => {
        const value = requestBody[property];
        if (typeof value !== 'string' || value.trim() === '') {
            throw new ApplicationError(`Property ${String(property)} is required`, StatusCodes.BAD_REQUEST);
        }
    });
};

export default validateRequestBody;

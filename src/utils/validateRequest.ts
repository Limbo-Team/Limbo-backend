import { StatusCodes } from 'http-status-codes';
import ApplicationError from './ApplicationError';

export const validateRequestBody = <T>(requestBody: T, properties: (keyof T)[]) => {
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

export const validateRequestArrayBody = (requestBody: any, propertiesName: string) => {
    if (Object.keys(requestBody).length === 0) {
        throw new ApplicationError(`No ${propertiesName} provided`, StatusCodes.BAD_REQUEST);
    }
};

export const validateRequestParams = (params: any, properties: string[]) => {
    properties.forEach((property) => {
        const value = params[property];
        if (typeof value !== 'string' || value.trim() === '') {
            throw new ApplicationError(`Property ${property} is required`, StatusCodes.BAD_REQUEST);
        }
    });
};

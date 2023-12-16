import { Request, Response, NextFunction } from 'express';
import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';

const errorHandler = (error: ApplicationError, req: Request, res: Response, next: NextFunction) => {
    error.statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = error.status || 'Error';
    error.message = error.message || 'Something went wrong';

    res.status(error.statusCode).json({
        statusCode: error.statusCode,
        status: error.status,
        message: error.message,
        stack: error.stack,
    });
};

export default errorHandler;

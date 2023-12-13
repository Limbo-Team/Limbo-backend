import { NextFunction, Request, Response } from 'express';

const errorLogger = (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(`error ${error.message}`);
    next(error);
};

export default errorLogger;

import { NextFunction, Request, Response } from 'express';

const responseLogger = (request: Request, response: Response, next: NextFunction) => {
    response.on('finish', () => {
        console.info(`status:: ${response.statusCode} ${response.statusMessage}`);
    });
    next();
};

export default responseLogger;

import { NextFunction, Request, Response } from 'express';

const requestLogger = (request: Request, response: Response, next: NextFunction) => {
    console.info(
        `${request.method} url:: ${request.baseUrl}/${request.url}, body:: ${JSON.stringify(
            request.body,
        )}, query params:: ${JSON.stringify(request.query)}, headers:: ${JSON.stringify(request.headers)}`,
    );
    next();
};

export default requestLogger;

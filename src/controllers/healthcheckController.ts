import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const healthcheckController = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(StatusCodes.OK).json({ message: 'OK' });
    } catch (error) {
        next(error);
    }
};

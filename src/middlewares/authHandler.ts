import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('authorization');
    if (!token) return res.sendStatus(StatusCodes.UNAUTHORIZED);
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        next();
    } catch (error) {
        next(error);
    }
};

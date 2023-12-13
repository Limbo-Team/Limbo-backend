import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationError from '../utils/AuthenticationError';
import { accessTokenSecret } from '../config/environment';
import getUserIdFromToken from '../utils/getUserIdFromToken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: string | undefined = req.header('Authorization');
        if (!token) throw new AuthenticationError('No token provided');

        const bearer = token.split(' ')[0];
        if (bearer !== 'Bearer') throw new AuthenticationError('Invalid token type');

        const bearerToken = token.split(' ')[1];
        if (!bearerToken) throw new AuthenticationError('No token provided');

        jwt.verify(bearerToken, accessTokenSecret as string, (error) => {
            if (error) {
                throw new AuthenticationError('Invalid token');
            }
        });
        res.locals.userId = getUserIdFromToken(token);
        next();
    } catch (error) {
        next(error);
    }
};

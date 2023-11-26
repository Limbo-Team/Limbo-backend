import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userSignBody } from '../types/userTypes';
import jwt from 'jsonwebtoken';

export const signUser = (req: Request, res: Response, next: NextFunction) => {
    const userData: userSignBody = req.body;

    console.log('cookies', req.cookies);

    if (userData.password === 'admin' && userData.email === 'admin@mail.com') {
        const signToken: string = jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET as string);

        return res.cookie('authToken', signToken).status(StatusCodes.OK).send({
            message: 'OK',
        });
    }

    return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'user does not exists',
    });
};

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
    return res.sendStatus(StatusCodes.OK);
};

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserSignInBody } from '../types/userTypes';
import UserService from '../services/UserService';

export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData: UserSignInBody = req.body;
        const userService = new UserService();
        const signToken = await userService.signInUser(userData);

        return res.status(StatusCodes.OK).send({
            authToken: signToken,
        });
    } catch (error) {
        next(error);
    }
};

export const signOutUser = (req: Request, res: Response, next: NextFunction) => {
    return res.sendStatus(StatusCodes.OK);
};

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserSignInBody, UserSignUpBody } from '../types/userTypes';
import UserService from '../services/UserService';
import AuthenticationError from '../utils/AuthenticationError';

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

export const signOutUser = async (req: Request, res: Response, next: NextFunction) => {
    return res.sendStatus(StatusCodes.OK);
};

export const signUpUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData: UserSignUpBody = req.body;
        const userService = new UserService();

        await userService.signUpUser(userData);
        return res.sendStatus(StatusCodes.CREATED);
    } catch (error) {
        next(error);
    }
};

export const getUserChapters = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authToken = req.headers.authorization;
        if (!authToken) throw new AuthenticationError('No auth token provided');

        const userService = new UserService();
        const userChapters = await userService.getUserChapters(authToken);

        return res.status(StatusCodes.OK).json(userChapters);
    } catch (error) {
        next(error);
    }
};

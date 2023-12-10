import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserSignInBody, UserSignUpBody } from '../types/userTypes';
import UserService from '../services/UserService';
import { defaultDuration, defaultStartDate } from '../constants/constants';

export const signInUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData: UserSignInBody = req.body;
        const userService = new UserService();
        const authToken = await userService.signInUser(userData);

        return res.status(StatusCodes.OK).json(authToken);
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
        const userId = res.locals.userId;
        const userService = new UserService();

        const userChapters = await userService.getUserChapters(userId);

        return res.status(StatusCodes.OK).json(userChapters);
    } catch (error) {
        next(error);
    }
};

export const getUserActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.userId;

        const stringDate = req.query.startDate ? (req.query.startDate as string) : defaultStartDate.toISOString();
        const startDate = new Date(stringDate.split('T')[0]);
        const duration = req.query.duration ? parseInt(req.query.duration as string) : defaultDuration;

        const userService = new UserService();
        const userActivity = await userService.getUserActivity(userId, startDate, duration);

        return res.status(StatusCodes.OK).json(userActivity);
    } catch (error) {
        next(error);
    }
};

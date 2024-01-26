import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnswerQuizBody, UserSignInBody, UserSignUpBody } from '../types/userTypes';
import UserService from '../services/UserService';
import { defaultDuration, defaultStartDate } from '../constants/constants';
import ApplicationError from '../utils/ApplicationError';
import { ObjectId } from 'mongodb';

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

export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.userId;
        const userService = new UserService();

        const userStats = await userService.getUserStats(userId);

        return res.status(StatusCodes.OK).json(userStats);
    } catch (error) {
        next(error);
    }
};

export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.userId;
        const userService = new UserService();

        const userInfo = await userService.getUserInfo(userId);

        return res.status(StatusCodes.OK).json(userInfo);
    } catch (error) {
        next(error);
    }
};

export const getUserQuizzes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.chapterId) throw new ApplicationError('No chapter id provided', StatusCodes.BAD_REQUEST);

        const chapterId = new ObjectId(req.params.chapterId as string);
        const userId = res.locals.userId;
        const userService = new UserService();

        const quizzes = await userService.getUserQuizzes(userId, chapterId);

        return res.status(StatusCodes.OK).json(quizzes);
    } catch (error) {
        next(error);
    }
};

export const getQuizQuestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.quizId) throw new ApplicationError('No quiz id provided', StatusCodes.BAD_REQUEST);

        const quizId = new ObjectId(req.params.quizId as string);
        const userId = res.locals.userId;
        const userService = new UserService();

        const questions = await userService.getQuizQuestions(userId, quizId);

        return res.status(StatusCodes.OK).json(questions);
    } catch (error) {
        next(error);
    }
};

export const getUserAvailableRewards = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.userId;
        const userService = new UserService();

        const availableRewards = await userService.getUserAvailableRewards(userId);

        return res.status(StatusCodes.OK).json(availableRewards);
    } catch (error) {
        next(error);
    }
};

export const buyUserReward = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.rewardId) throw new ApplicationError('No reward id provided', StatusCodes.BAD_REQUEST);

        const rewardId = new ObjectId(req.params.rewardId as string);
        const userId = res.locals.userId;
        const userService = new UserService();

        const newPoints = await userService.buyUserReward(userId, rewardId);

        return res.status(StatusCodes.OK).json(newPoints);
    } catch (error) {
        next(error);
    }
};

export const answerQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.quizId) throw new ApplicationError('No quiz id provided', StatusCodes.BAD_REQUEST);
        if (req.body.constructor === Object && Object.keys(req.body).length === 0)
            throw new ApplicationError('No answers provided', StatusCodes.BAD_REQUEST);

        const quizId = new ObjectId(req.params.quizId as string);
        const userId = res.locals.userId;
        const answers = req.body as AnswerQuizBody;
        const userService = new UserService();

        const answerStatus = await userService.answerQuiz(userId, quizId, answers);

        return res.status(StatusCodes.OK).json(answerStatus);
    } catch (error) {
        next(error);
    }
};

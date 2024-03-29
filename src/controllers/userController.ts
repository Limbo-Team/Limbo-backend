import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AnswerQuizBody, UserSignInBody, UserSignUpBody } from '../types/userTypes';
import UserService from '../services/UserService';
import { defaultActivityDurationInDays, defaultStartDate } from '../constants/constants';
import ApplicationError from '../utils/ApplicationError';
import { ObjectId } from 'mongodb';
import { validateRequestArrayBody, validateRequestParams } from '../utils/validateRequest';

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

        const userChapters = await userService.getUserChaptersProgress(userId);

        return res.status(StatusCodes.OK).json(userChapters);
    } catch (error) {
        next(error);
    }
};

export const getUserActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.userId;

        const { startDate, duration } = req.query as { startDate: string; duration: string };

        const userService = new UserService();
        const userActivity = await userService.getUserActivity({
            userId,
            startDate: startDate
                ? new Date(new Date(startDate).toISOString().split('T')[0])
                : new Date(defaultStartDate.toISOString().split('T')[0]),
            duration: duration ? parseInt(duration) : defaultActivityDurationInDays,
        });

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
        validateRequestParams(req.params, ['chapterId']);

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
        validateRequestParams(req.params, ['quizId']);

        const quizId = new ObjectId(req.params.quizId as string);
        const userId = res.locals.userId;
        const userService = new UserService();

        const questions = await userService.getQuestionsForQuiz(userId, quizId);

        return res.status(StatusCodes.OK).json(questions);
    } catch (error) {
        next(error);
    }
};

export const getUserAvailableRewards = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = res.locals.userId;
        const userService = new UserService();

        const availableRewards = await userService.getAvailableRewardsToBuy(userId);

        return res.status(StatusCodes.OK).json(availableRewards);
    } catch (error) {
        next(error);
    }
};

export const buyUserReward = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validateRequestParams(req.params, ['rewardId']);

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
        validateRequestParams(req.params, ['quizId']);
        validateRequestArrayBody(req.body, 'answers');

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

export const noEndpointFound = (req: Request, res: Response, next: NextFunction) => {
    next(new ApplicationError('Endpoint not found', StatusCodes.NOT_FOUND));
};

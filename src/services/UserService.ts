import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/User';
import { FetchedUser, UserSignInBody, UserSignUpBody } from '../types/userTypes';
import jwt from 'jsonwebtoken';
import ApplicationError from '../utils/ApplicationError';
import { accessTokenSecret } from '../config/environment';
import { ChapterModel } from '../models/Chapter';
import { QuizDoneModel } from '../models/QuizDone';
import { QuizModel } from '../models/Quiz';
import { msInADay } from '../constants/constants';
import { ObjectId } from 'mongodb';
import {
    GetUserActivityResponse,
    GetUserChaptersResponse,
    SignInUserResponse,
} from '../types/response-types/userResponseTypes';

class UserService {
    async signInUser(userData: UserSignInBody): Promise<SignInUserResponse> {
        if (!userData || !userData.email || !userData.password)
            throw new ApplicationError('Invalid user data', StatusCodes.BAD_REQUEST);

        const user: FetchedUser | null = await UserModel.findOne({
            email: userData.email,
            password: userData.password,
        });

        if (!user) {
            throw new ApplicationError('Wrong email or password', StatusCodes.UNAUTHORIZED);
        }

        const userDataToHash = { id: user._id };
        const authToken: string = jwt.sign(userDataToHash, accessTokenSecret as string);

        return {
            authToken,
        };
    }

    async signUpUser(userData: UserSignUpBody): Promise<void> {
        if (!userData || !userData.email || !userData.password || !userData.firstName || !userData.lastName)
            throw new ApplicationError('Invalid user data', StatusCodes.BAD_REQUEST);

        const user: FetchedUser | null = await UserModel.findOne({
            email: userData.email,
        });

        if (user) {
            throw new ApplicationError('User already exists', StatusCodes.CONFLICT);
        }

        await UserModel.create(userData);
    }

    async getUserChapters(userId: ObjectId): Promise<GetUserChaptersResponse> {
        const chapters = await ChapterModel.find();
        const quizzesDone = await QuizDoneModel.find({ userId });

        const quizDoneIds = quizzesDone.map(({ quizId }) => quizId.toString());

        const chaptersWithProgress = await Promise.all(
            chapters.map(async (chapter) => {
                const { _id: chapterId } = chapter;
                const chapterQuizzes = await QuizModel.find({ chapterId });
                const chapterQuizzesIds = chapterQuizzes.map(({ _id }) => _id.toString());

                const doneQuizzes = chapterQuizzesIds.filter((chapterQuizId) => quizDoneIds.includes(chapterQuizId));

                return {
                    chapterId,
                    maximumQuizzes: chapterQuizzesIds.length,
                    doneQuizzes: doneQuizzes.length,
                    percentage: Math.floor(doneQuizzes.length / chapterQuizzesIds.length) * 100,
                };
            }),
        );
        return chaptersWithProgress;
    }

    async getUserActivity(userId: ObjectId, startDate: Date, duration: number): Promise<GetUserActivityResponse> {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + duration);

        const quizzesDone = await QuizDoneModel.find({
            userId,
            completedAt: { $gte: startDate, $lt: endDate },
        });

        const quizzes = await QuizModel.find({ _id: { $in: quizzesDone.map(({ quizId }) => quizId) } });

        const userActivity = Array.from({ length: duration }, (_, dayCounter) => {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + dayCounter);
            return {
                date,
                points: 0,
            };
        });

        quizzesDone.forEach((quizDone) => {
            const completeDate = quizDone.completedAt;
            const index = (completeDate.getTime() - startDate.getTime()) / msInADay;
            const quiz = quizzes.find(({ _id }) => _id.toString() === quizDone.quizId.toString());

            if (quiz) {
                userActivity[index].points += quiz.points;
            }
        });

        return userActivity;
    }
}

export default UserService;

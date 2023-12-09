import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/User';
import { FetchedUser, UserSignInBody, UserSignUpBody } from '../types/userTypes';
import jwt from 'jsonwebtoken';
import ApplicationError from '../utils/ApplicationError';
import { accessTokenSecret } from '../config/environment';
import { ChapterModel } from '../models/Chapter';
import { ChapterDoneModel } from '../models/ChapterDone';
import { QuizDoneModel } from '../models/QuizDone';
import { QuizModel } from '../models/Quiz';
import getUserIdFromToken from '../utils/getUserIdFromToken';

class UserService {
    async signInUser(userData: UserSignInBody): Promise<string> {
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
        const signToken: string = jwt.sign(userDataToHash, accessTokenSecret as string);

        return signToken;
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

    async getUserChapters(authToken: string): Promise<object[]> {
        const userId = getUserIdFromToken(authToken);

        const chapters = await ChapterModel.find();
        const chaptersDone = await ChapterDoneModel.find({ userId });
        const quizzesDone = await QuizDoneModel.find({ userId });

        const chapterDoneIds = chaptersDone.map(({ chapterId }) => chapterId.toString());
        const quizDoneIds = quizzesDone.map(({ quizId }) => quizId.toString());

        const chaptersWithProgress = await Promise.all(
            chapters.map(async (chapter) => {
                const { _id: chapterId } = chapter;
                const chapterQuizzes = await QuizModel.find({ chapterId });
                const chapterQuizzesIds = chapterQuizzes.map(({ _id }) => _id.toString());

                const isChapterDone = chapterDoneIds.includes(chapterId.toString());
                const doneQuizzes = chapterQuizzesIds.filter((chapterQuizId) => quizDoneIds.includes(chapterQuizId));

                return {
                    chapterId,
                    maximumQuizzes: chapterQuizzesIds.length,
                    doneQuizzes: isChapterDone ? chapterQuizzesIds.length : doneQuizzes.length,
                    percentage: isChapterDone ? 100 : Math.floor(doneQuizzes.length / chapterQuizzesIds.length) * 100,
                };
            }),
        );
        return chaptersWithProgress;
    }
}

export default UserService;

import { StatusCodes } from 'http-status-codes';
import { User, UserModel } from '../models/User';
import { AnswerQuizBody, UserActivity, UserSignInBody, UserSignUpBody } from '../types/userTypes';
import jwt from 'jsonwebtoken';
import ApplicationError from '../utils/ApplicationError';
import { accessTokenSecret } from '../config/environment';
import { ChapterModel } from '../models/Chapter';
import { QuizDone, QuizDoneModel } from '../models/QuizDone';
import { Quiz, QuizModel } from '../models/Quiz';
import { defaultActivityDurationInDays, defaultStartDate, msInADay } from '../constants/constants';
import { ObjectId } from 'mongodb';
import {
    AnswerQuizResponse,
    BuyUserRewardResponse,
    GetQuizQuestionsResponse,
    GetUserActivityResponse,
    GetUserAvailableRewardsResponse,
    GetUserChaptersResponse,
    GetUserInfoResponse,
    GetUserQuizzesResponse,
    GetUserStatsResponse,
    SignInUserResponse,
} from '../types/response-types/userResponseTypes';
import { ChapterDoneModel } from '../models/ChapterDone';
import { Reward, RewardModel } from '../models/Reward';
import { QuestionModel } from '../models/Question';
import DatabaseService from './DatabaseService';
import toApplicationError from '../utils/toApplicationError';
import Populated from '../utils/Populated';
import validateRequestBody from '../utils/validateRequestBody';

class UserService {
    async signInUser(userData: UserSignInBody): Promise<SignInUserResponse> {
        validateRequestBody(userData, ['email', 'password']);

        const user = await UserModel.findOne({
            email: userData.email,
            password: userData.password,
        });

        if (!user) {
            throw new ApplicationError('Wrong email or password', StatusCodes.UNAUTHORIZED);
        }

        const userDataToHash = { id: user._id };
        const authToken: string = jwt.sign(userDataToHash, accessTokenSecret as string);

        const userInfo = await this.getUserInfo(new ObjectId(user._id));
        const { firstName, lastName, email, image, points } = userInfo;

        return {
            authToken,
            firstName,
            lastName,
            email,
            image,
            points,
        };
    }

    async signUpUser(userData: UserSignUpBody): Promise<void> {
        validateRequestBody(userData, ['email', 'password', 'firstName', 'lastName']);

        const foundUser = await UserModel.findOne({
            email: userData.email,
        });

        if (foundUser) {
            throw new ApplicationError('User already exists', StatusCodes.CONFLICT);
        }

        await UserModel.create(userData);
    }

    async getUserChaptersProgress(userId: ObjectId): Promise<GetUserChaptersResponse> {
        const allQuizzesDoneByUser = await QuizDoneModel.find({ userId });
        const quizzesDoneIds = allQuizzesDoneByUser.map(({ quizId }) => quizId.toString());

        const allChapters = await ChapterModel.find();
        const chaptersWithProgress = await Promise.all(
            allChapters.map(async (chapter) => {
                const { _id: chapterId, title: chapterTitle } = chapter;
                const quizzesForThisChapter = await QuizModel.find({ chapterId });
                const quizIdsForThisChapter = quizzesForThisChapter.map(({ _id }) => _id.toString());

                const doneQuizzesForThisChapter = quizIdsForThisChapter.filter((chapterQuizId) =>
                    quizzesDoneIds.includes(chapterQuizId),
                );

                return {
                    chapterId,
                    chapterTitle,
                    maximumQuizzes: quizIdsForThisChapter.length,
                    doneQuizzes: doneQuizzesForThisChapter.length,
                    percentage: Math.floor((doneQuizzesForThisChapter.length / quizIdsForThisChapter.length) * 100),
                };
            }),
        );
        return chaptersWithProgress;
    }

    async getUserActivity({
        userId,
        startDate,
        duration,
    }: {
        userId: ObjectId;
        startDate: Date;
        duration: number;
    }): Promise<GetUserActivityResponse> {
        const endDate = new Date(startDate.getTime() + duration * msInADay);

        const quizzesDoneWithinGivenPeriod = await QuizDoneModel.find({
            userId,
            completedAt: { $gte: startDate, $lt: endDate },
        }).populate<Populated<QuizDone, Quiz, 'quizId'>>('quizId');

        const userActivity: UserActivity[] = Array.from({ length: duration }, (_, dayCounter) => ({
            date: new Date(startDate.getTime() + dayCounter * msInADay),
            points: 0,
        }));

        quizzesDoneWithinGivenPeriod.forEach((quizDone) => {
            const indexOfTheDay = Math.floor((quizDone.completedAt.getTime() - startDate.getTime()) / msInADay);
            const pointsForDoneQuiz = quizDone.quizId.points;

            userActivity[indexOfTheDay].points += pointsForDoneQuiz;
        });

        return userActivity;
    }

    async getUserStats(userId: ObjectId): Promise<GetUserStatsResponse> {
        const user = await UserModel.findById(new ObjectId('657ff676df0ef993045d142b'))
            .orFail()
            .populate<Populated<User, Reward[], 'rewards'>>('rewards')
            .exec();

        const chaptersDone = await ChapterDoneModel.find({ userId });
        const quizzesDone = await QuizDoneModel.find({ userId });

        const userRewardDescriptions = user.rewards.map(({ description }) => description);

        return {
            chaptersDone: chaptersDone.length,
            quizzesDone: quizzesDone.length,
            userRewards: userRewardDescriptions,
        };
    }

    async getUserInfo(userId: ObjectId): Promise<GetUserInfoResponse> {
        const user = await UserModel.findById(userId).orFail();

        const { firstName, lastName, email, image, points } = user;

        return {
            firstName,
            lastName,
            email,
            image,
            points,
        };
    }

    async getUserQuizzes(userId: ObjectId, chapterId: ObjectId): Promise<GetUserQuizzesResponse> {
        const allQuizzes = await QuizModel.find({ chapterId });
        const doneQuizzes = await QuizDoneModel.find({ userId });
        const doneQuizzesIds = doneQuizzes.map(({ quizId }) => quizId.toString());

        const quizzes = allQuizzes.map((quiz) => {
            const { _id: quizId, title: quizTitle } = quiz;
            const isDone = doneQuizzesIds.includes(quizId.toString());

            return {
                quizId,
                quizTitle,
                isDone,
            };
        });

        return quizzes;
    }

    async getQuestionsForQuiz(userId: ObjectId, quizId: ObjectId): Promise<GetQuizQuestionsResponse> {
        await this.checkIfQuizIsDoneByUser(userId, quizId);

        const questions = await QuestionModel.find({ quizId });

        if (!questions) {
            throw new ApplicationError('Questions not found', StatusCodes.NOT_FOUND);
        }

        return questions.map(({ _id: questionId, description, answers }) => ({
            questionId,
            description,
            answers,
        }));
    }

    async getAvailableRewardsToBuy(userId: ObjectId): Promise<GetUserAvailableRewardsResponse> {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new ApplicationError('User not found', StatusCodes.NOT_FOUND);
        }

        const userRewardIds = user.rewards.map(({ _id }) => _id);
        const userAvailableRewards = await RewardModel.find({ _id: { $nin: userRewardIds } });

        const availableRewards = userAvailableRewards.map(
            ({ _id: rewardId, description: rewardDescription, cost: rewardCost }) => ({
                rewardId,
                rewardDescription,
                rewardCost,
            }),
        );
        return availableRewards;
    }

    //TODO: Refactor
    async buyUserReward(userId: ObjectId, rewardId: ObjectId): Promise<BuyUserRewardResponse> {
        const user = await UserModel.findById(userId).orFail();
        if (!user) {
            throw new ApplicationError('User not found', StatusCodes.NOT_FOUND);
        }

        const userRewardIds = user.rewards.map(({ _id }) => _id) || [];
        if (userRewardIds.includes(rewardId)) {
            throw new ApplicationError('Reward already bought', StatusCodes.CONFLICT);
        }

        const reward: Reward | null = await RewardModel.findById(rewardId);
        if (!reward) {
            throw new ApplicationError('Reward not found', StatusCodes.NOT_FOUND);
        }

        if (user.points < reward.cost) {
            throw new ApplicationError('Not enough points', StatusCodes.BAD_REQUEST);
        }

        await UserModel.findByIdAndUpdate(userId, { $push: { rewards: rewardId }, $inc: { points: -reward.cost } });
        return { newPoints: user.points - reward.cost };
    }

    //TODO: Refactor
    async answerQuiz(userId: ObjectId, quizId: ObjectId, answers: AnswerQuizBody): Promise<AnswerQuizResponse> {
        const user: User | null = await UserModel.findById(userId);
        if (!user) throw new ApplicationError('User not found', StatusCodes.NOT_FOUND);

        const quizDone: QuizDone | null = await QuizDoneModel.findOne({ userId, quizId });
        if (quizDone) throw new ApplicationError('Quiz already done', StatusCodes.CONFLICT);

        const questions = await QuestionModel.find({ quizId });
        const correctAnswers = questions.map(({ _id, correctAnswerIndex, answers }) => ({
            questionId: _id,
            correctAnswerIndex,
            answers,
        }));
        const questionsIds = questions.map(({ _id }) => _id.toString());

        if (answers.length !== correctAnswers.length)
            throw new ApplicationError('Invalid number of answers', StatusCodes.NOT_ACCEPTABLE);

        for (const { questionId, answer } of answers) {
            if (questionId === undefined || answer === undefined)
                throw new ApplicationError('Invalid answer', StatusCodes.NOT_ACCEPTABLE);

            if (!questionsIds.includes(questionId.toString()))
                throw new ApplicationError('Invalid question id', StatusCodes.NOT_ACCEPTABLE);

            const correctAnswer = correctAnswers.find(({ questionId: correctQuestionId }) => {
                return correctQuestionId.toString() === questionId.toString();
            });

            const answerIndex = correctAnswer?.answers.findIndex((correctAnswer) => correctAnswer === answer);

            if (answerIndex !== correctAnswer?.correctAnswerIndex) {
                return { isCorrect: false, newPoints: user.points };
            }
        }

        const quiz: Quiz | null = await QuizModel.findById(quizId);
        if (!quiz) throw new ApplicationError('Quiz not found', StatusCodes.NOT_FOUND);

        const quizzesInChapter = await QuizModel.find({ chapterId: quiz.chapterId });
        const quizzesDoneInChapter = await QuizDoneModel.find({
            userId,
            quizId: { $in: quizzesInChapter.map(({ _id }) => _id) },
        });
        if (quizzesDoneInChapter.length === quizzesInChapter.length - 1) {
            await ChapterDoneModel.create({ userId, chapterId: quiz.chapterId });
        }

        await QuizDoneModel.create({ userId, quizId });
        await UserModel.findByIdAndUpdate(userId, { $inc: { points: quiz.points } });
        return { isCorrect: true, newPoints: user.points + quiz.points };
    }

    //TODO: Refactor
    async finishQuizByUser(userId: ObjectId, quizId: ObjectId): Promise<ObjectId> {
        try {
            await this.checkIfQuizIsDoneByUser(userId, quizId);
            const { _id: quizDoneId } = await QuizDoneModel.create({
                userId: userId,
                quizId: quizId,
            });
            return quizDoneId;
        } catch (error) {
            throw toApplicationError(error, (error as any).message);
        }
    }

    //TODO: Refactor
    async shouldUserFinishChapter(userId: ObjectId, chapterId: ObjectId): Promise<boolean> {
        await DatabaseService.checkIfChapterExists(chapterId);

        const quizzesForThisChapter = await QuizModel.find({
            chapterId: chapterId,
        });
        const quizzesDoneForThisChapter = await QuizDoneModel.find({
            userId: userId,
            quizId: {
                $in: quizzesForThisChapter.map((quiz) => quiz._id),
            },
        });

        return quizzesDoneForThisChapter.length === quizzesForThisChapter.length;
    }

    //TODO: Refactor
    async finishChapterByUser(userId: ObjectId, chapterId: ObjectId): Promise<ObjectId> {
        try {
            await this.checkIfChapterIsDoneByUser(userId, chapterId);
            const { _id: chapterDoneId } = await ChapterDoneModel.create({
                userId: userId,
                chapterId: chapterId,
            });
            return chapterDoneId;
        } catch (error) {
            throw toApplicationError(error, (error as any).message);
        }
    }

    //TODO: Refactor
    async checkIfQuizIsDoneByUser(userId: ObjectId, quizId: ObjectId): Promise<void> {
        await DatabaseService.checkIfQuizExists(quizId);

        const quizDone = await QuizDoneModel.findOne({
            userId: userId,
            quizId: quizId,
        });
        if (quizDone) {
            throw new ApplicationError('Quiz is already done by user', StatusCodes.CONFLICT);
        }
    }

    //TODO: Refactor
    async checkIfChapterIsDoneByUser(userId: ObjectId, chapterId: ObjectId): Promise<void> {
        const chapterDone = await ChapterDoneModel.findOne({
            userId: userId,
            chapterId: chapterId,
        });
        if (chapterDone) {
            throw new ApplicationError('Chapter is already done by user', StatusCodes.CONFLICT);
        }
    }

    //TODO: Refactor
    async addRewardToUser(userId: ObjectId, rewardId: ObjectId): Promise<void> {
        try {
            await UserModel.updateOne(
                { _id: userId },
                {
                    $push: {
                        rewards: rewardId,
                    },
                },
            );
        } catch (error) {
            throw toApplicationError(error, (error as any).message);
        }
    }
}

export default UserService;

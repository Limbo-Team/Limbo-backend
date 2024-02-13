import { StatusCodes } from 'http-status-codes';
import { User, UserModel } from '../models/User';
import { AnswerQuizBody, UserActivity, UserSignInBody, UserSignUpBody } from '../types/userTypes';
import jwt from 'jsonwebtoken';
import ApplicationError from '../utils/ApplicationError';
import { accessTokenSecret } from '../config/environment';
import { ChapterModel } from '../models/Chapter';
import { QuizDone, QuizDoneModel } from '../models/QuizDone';
import { Quiz, QuizModel } from '../models/Quiz';
import { msInADay } from '../constants/constants';
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
import { validateRequestBody } from '../utils/validateRequest';
import * as bcrypt from 'bcrypt';

class UserService {
    async signInUser(userData: UserSignInBody): Promise<SignInUserResponse> {
        validateRequestBody(userData, ['email', 'password']);

        const user = await UserModel.findOne({
            email: userData.email,
        });

        const doesPasswordMatch = user ? await bcrypt.compare(userData.password, user.password) : false;

        if (!user || !doesPasswordMatch) {
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
        const endDate = new Date(new Date(startDate.getTime() + duration * msInADay).toISOString().split('T')[0]);

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
        const user = await UserModel.findById(userId)
            .orFail()
            .populate<Populated<User, Reward[], 'rewards'>>('rewards');

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

        const questions = await QuestionModel.find({ quizId }).orFail();

        return questions.map(({ _id: questionId, description, answers }) => ({
            questionId,
            description,
            answers,
        }));
    }

    async getAvailableRewardsToBuy(userId: ObjectId): Promise<GetUserAvailableRewardsResponse> {
        const user = await UserModel.findById(userId).orFail();

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

    async buyUserReward(userId: ObjectId, rewardId: ObjectId): Promise<BuyUserRewardResponse> {
        const user = await UserModel.findById(userId).orFail();

        const isRewardAlreadyBought = user.rewards.some(({ _id }) => _id === rewardId);
        if (isRewardAlreadyBought) {
            throw new ApplicationError('Reward already bought', StatusCodes.CONFLICT);
        }

        const reward = await RewardModel.findById(rewardId).orFail();

        if (user.points < reward.cost) {
            throw new ApplicationError('Not enough points', StatusCodes.NOT_ACCEPTABLE);
        }

        await this.addRewardToUser(userId, rewardId);
        return { newPoints: user.points - reward.cost };
    }

    async answerQuiz(userId: ObjectId, quizId: ObjectId, answers: AnswerQuizBody): Promise<AnswerQuizResponse> {
        const quiz = await QuizModel.findById(quizId).orFail();
        const quizDone = await QuizDoneModel.findOne({ userId, quizId });
        if (quizDone) {
            throw new ApplicationError('Quiz already done', StatusCodes.CONFLICT);
        }

        const questions = await QuestionModel.find({ quizId }).orFail();

        if (answers.length > questions.length) {
            throw new ApplicationError('Invalid number of answers', StatusCodes.BAD_REQUEST);
        }

        const userAnswers = questions.map((question) => {
            const { _id: questionId, correctAnswerIndex } = question;
            const userAnswerForThisQuestion = answers.find(
                ({ questionId: answersQuestionId }) => answersQuestionId.toString() === questionId.toString(),
            )?.answer;

            const correctAnswerForThisQuestion = question.answers[correctAnswerIndex];

            const isCorrect = userAnswerForThisQuestion?.toLowerCase() === correctAnswerForThisQuestion.toLowerCase();

            return {
                questionId,
                isCorrect,
            };
        });

        const isQuizDoneCorrectly = userAnswers.every(({ isCorrect }) => isCorrect);
        if (isQuizDoneCorrectly) {
            await this.finishQuizByUser(userId, quizId);
            if (await this.shouldUserFinishChapter(userId, quiz.chapterId)) {
                await this.finishChapterByUser(userId, quiz.chapterId);
            }
        }

        const totalCorrectAnswers = userAnswers.filter(({ isCorrect }) => isCorrect).length;

        return {
            isCorrect: isQuizDoneCorrectly,
            earnedPoints: isQuizDoneCorrectly ? quiz.points : 0,
            totalCorrectAnswers,
            totalQuestions: questions.length,
        };
    }

    async finishQuizByUser(userId: ObjectId, quizId: ObjectId): Promise<void> {
        try {
            await this.checkIfQuizIsDoneByUser(userId, quizId);
            await QuizDoneModel.create({
                userId: userId,
                quizId: quizId,
            });

            const user = await UserModel.findById(userId).orFail();
            const quiz = await QuizModel.findById(quizId).orFail();

            user.points += quiz.points;
            await user.save();
        } catch (error) {
            throw toApplicationError(error, (error as any).message);
        }
    }

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

    async finishChapterByUser(userId: ObjectId, chapterId: ObjectId): Promise<void> {
        try {
            await this.checkIfChapterIsDoneByUser(userId, chapterId);
            await ChapterDoneModel.create({
                userId: userId,
                chapterId: chapterId,
            });
        } catch (error) {
            throw toApplicationError(error, (error as any).message);
        }
    }

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

    async checkIfChapterIsDoneByUser(userId: ObjectId, chapterId: ObjectId): Promise<void> {
        const chapterDone = await ChapterDoneModel.findOne({
            userId: userId,
            chapterId: chapterId,
        });
        if (chapterDone) {
            throw new ApplicationError('Chapter is already done by user', StatusCodes.CONFLICT);
        }
    }

    async addRewardToUser(userId: ObjectId, rewardId: ObjectId): Promise<void> {
        try {
            const reward = await RewardModel.findById(rewardId).orFail();
            await UserModel.updateOne(
                { _id: userId },
                {
                    $push: {
                        rewards: rewardId,
                    },
                    $inc: {
                        points: -reward.cost,
                    },
                },
            );
        } catch (error) {
            throw toApplicationError(error, (error as any).message);
        }
    }
}

export default UserService;

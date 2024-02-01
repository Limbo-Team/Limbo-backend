import { StatusCodes } from 'http-status-codes';
import { User, UserModel } from '../models/User';
import { FetchedUser, AnswerQuizBody, UserSignInBody, UserSignUpBody } from '../types/userTypes';
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
                const { _id: chapterId, title: chapterTitle } = chapter;
                const chapterQuizzes = await QuizModel.find({ chapterId });
                const chapterQuizzesIds = chapterQuizzes.map(({ _id }) => _id.toString());

                const doneQuizzes = chapterQuizzesIds.filter((chapterQuizId) => quizDoneIds.includes(chapterQuizId));

                return {
                    chapterId,
                    chapterTitle,
                    maximumQuizzes: chapterQuizzesIds.length,
                    doneQuizzes: doneQuizzes.length,
                    percentage: Math.floor((doneQuizzes.length / chapterQuizzesIds.length) * 100),
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

    async getUserStats(userId: ObjectId): Promise<GetUserStatsResponse> {
        const chaptersDone = await ChapterDoneModel.find({ userId });
        const quizzesDone = await QuizDoneModel.find({ userId });

        const user: User | null = await UserModel.findById(userId);
        if (!user) throw new ApplicationError('User not found', StatusCodes.NOT_FOUND);

        const userRewardIds = user.rewards.map(({ _id }) => _id) || [];
        const userRewards = await RewardModel.find({ _id: { $in: userRewardIds } });
        const userRewardDescriptions = userRewards.map(({ description }) => description);

        return {
            chaptersDone: chaptersDone.length,
            quizzesDone: quizzesDone.length,
            userRewards: userRewardDescriptions,
        };
    }

    async getUserInfo(userId: ObjectId): Promise<GetUserInfoResponse> {
        const user: User | null = await UserModel.findById(userId);
        if (!user) throw new ApplicationError('User not found', StatusCodes.NOT_FOUND);

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

    async getQuizQuestions(userId: ObjectId, quizId: ObjectId): Promise<GetQuizQuestionsResponse> {
        const quizDone = await QuizDoneModel.findOne({ userId, quizId });
        if (quizDone) throw new ApplicationError('Quiz already done', StatusCodes.CONFLICT);

        const questions = await QuestionModel.find({ quizId });

        return questions.map(({ _id: questionId, description, answers }) => ({
            questionId,
            description,
            answers,
        }));
    }

    async getUserAvailableRewards(userId: ObjectId): Promise<GetUserAvailableRewardsResponse> {
        const user: User | null = await UserModel.findById(userId);
        if (!user) throw new ApplicationError('User not found', StatusCodes.NOT_FOUND);

        const userRewardIds = user.rewards.map(({ _id }) => _id) || [];
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
        const user: User | null = await UserModel.findById(userId);
        if (!user) throw new ApplicationError('User not found', StatusCodes.FORBIDDEN);

        const userRewardIds = user.rewards.map(({ _id }) => _id) || [];
        if (userRewardIds.includes(rewardId))
            throw new ApplicationError('Reward already bought', StatusCodes.METHOD_NOT_ALLOWED);

        const reward: Reward | null = await RewardModel.findById(rewardId);
        if (!reward) throw new ApplicationError('Reward not found', StatusCodes.NOT_FOUND);

        if (user.points < reward.cost) throw new ApplicationError('Not enough points', StatusCodes.NOT_ACCEPTABLE);

        await UserModel.findByIdAndUpdate(userId, { $push: { rewards: rewardId }, $inc: { points: -reward.cost } });
        return { newPoints: user.points - reward.cost };
    }

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
}

export default UserService;

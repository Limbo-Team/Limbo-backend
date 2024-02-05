import mongoose from 'mongoose';
import handleError from '../utils/handleError';
import { mongoDBUri } from '../config/environment';
import { User, UserModel } from '../models/User';
import { Reward, RewardModel } from '../models/Reward';
import { Chapter, ChapterModel } from '../models/Chapter';
import { Quiz, QuizModel } from '../models/Quiz';
import { Question, QuestionModel } from '../models/Question';
import { QuizDoneModel } from '../models/QuizDone';
import { ChapterDoneModel } from '../models/ChapterDone';
import { ObjectId } from 'mongodb';
import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';

class DatabaseService {
    async connect(): Promise<DatabaseService> {
        try {
            await mongoose.connect(mongoDBUri as string);
            console.info('🗄️ Connected to MongoDB');
            return this;
        } catch (error) {
            throw handleError(error, 'Failed to connect to MongoDB');
        }
    }

    async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.info('🗄️ Disconnected from MongoDB');
        } catch (error) {
            throw handleError(error, 'Failed to disconnect from MongoDB');
        }
    }

    async addUser(user: Partial<User>): Promise<void> {
        try {
            await UserModel.create({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                image: user.image,
                points: user.points,
                password: user.password,
            });
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async addReward(reward: Partial<Reward>): Promise<ObjectId> {
        try {
            const { _id: rewardId } = await RewardModel.create({
                cost: reward.cost,
                description: reward.description,
            });
            return rewardId;
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async addChapter(chapter: Partial<Chapter>): Promise<ObjectId> {
        try {
            const { _id: chapterId } = await ChapterModel.create({
                title: chapter.title,
            });
            return chapterId;
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async addQuiz(quiz: Partial<Quiz>): Promise<ObjectId> {
        try {
            const { _id: quizId } = await QuizModel.create({
                title: quiz.title,
                points: quiz.points,
                chapterId: quiz.chapterId,
            });
            return quizId;
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async addQuestion(question: Partial<Question>): Promise<ObjectId> {
        try {
            const { _id: questionId } = await QuestionModel.create({
                description: question.description,
                answers: question.answers,
                correctAnswerIndex: question.correctAnswerIndex,
                quizId: question.quizId,
            });
            return questionId;
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async finishQuizByUser(userId: ObjectId, quizId: ObjectId): Promise<ObjectId> {
        try {
            await this.checkIfQuizIsDoneByUser(userId, quizId);
            const { _id: quizDoneId } = await QuizDoneModel.create({
                userId: userId,
                quizId: quizId,
            });
            return quizDoneId;
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async shouldUserFinishChapter(userId: ObjectId, chapterId: ObjectId): Promise<boolean> {
        const chapter = await ChapterModel.findOne({
            _id: chapterId,
        });
        if (!chapter) {
            throw new ApplicationError('Chapter does not exist', StatusCodes.NOT_FOUND);
        }

        const quizzes = await QuizModel.find({
            chapterId: chapterId,
        });

        const quizzesDone = await QuizDoneModel.find({
            userId: userId,
            quizId: {
                $in: quizzes.map((quiz) => quiz._id),
            },
        });

        return quizzesDone.length === quizzes.length;
    }

    async finishChapterByUser(userId: ObjectId, chapterId: ObjectId): Promise<ObjectId> {
        try {
            await this.checkIfChapterIsDoneByUser(userId, chapterId);
            const { _id: chapterDoneId } = await ChapterDoneModel.create({
                userId: userId,
                chapterId: chapterId,
            });
            return chapterDoneId;
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async checkIfQuizIsDoneByUser(userId: ObjectId, quizId: ObjectId): Promise<void> {
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

    async checkIfUserWithMailExists(email: string): Promise<ObjectId> {
        const user = await UserModel.findOne({
            email: email,
        });
        if (!user) {
            throw new ApplicationError('User with this mail does not exists', StatusCodes.CONFLICT);
        }
        return user._id;
    }

    async addRewardToUser(userId: ObjectId, rewardId: ObjectId): Promise<void> {
        try {
            await UserModel.create(
                { _id: userId },
                {
                    $push: {
                        rewards: rewardId,
                    },
                },
            );
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async createResetCode(userId: ObjectId, code: number, createdAt: Date): Promise<void> {
        try {
            await UserModel.updateOne(
                { user: userId },
                {
                    resetCode: code,
                    createdAt: createdAt,
                },
            );
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async addExample(): Promise<void> {
        try {
            const createdUser = await UserModel.create({
                firstName: 'Example name',
                lastName: 'Example surname',
                email: 'asd@asd.pl',
                image: 'https://i.imgur.com/e8buxpa.jpeg',
                points: 0,
                password: 'asd',
            });

            await RewardModel.create({
                cost: 1500,
                description: 'This is an example',
            });

            const createdChapter = await ChapterModel.create({
                title: 'Example chapter',
            });

            const createdQuiz = await QuizModel.create({
                title: 'Example quiz',
                points: 100,
                chapterId: createdChapter._id,
            });

            await QuestionModel.create({
                description: 'Example question',
                answers: ['a', 'b', 'c', 'd'],
                correctAnswerIndex: 0,
                quizId: createdQuiz._id,
            });

            await QuizDoneModel.create({
                userId: createdUser._id,
                quizId: createdQuiz._id,
            });

            await ChapterDoneModel.create({
                userId: createdUser._id,
                chapterId: createdChapter._id,
            });

            console.info('🗄️ Added example to MongoDB');
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }
}

export default new DatabaseService();

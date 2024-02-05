import mongoose from 'mongoose';
import handleError from '../utils/handleError';
import { mongoDBUri } from '../config/environment';
import { UserModel } from '../models/User';
import { RewardModel } from '../models/Reward';
import { ChapterModel } from '../models/Chapter';
import { QuizModel } from '../models/Quiz';
import { QuestionModel } from '../models/Question';
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

    async checkIfChapterExists(chapterId: ObjectId): Promise<void> {
        const chapter = await ChapterModel.findOne({
            _id: chapterId,
        });
        if (!chapter) {
            throw new ApplicationError('Chapter not found', StatusCodes.NOT_FOUND);
        }
    }

    async checkIfQuizExists(quizId: ObjectId): Promise<void> {
        const quiz = await QuizModel.findOne({
            _id: quizId,
        });
        if (!quiz) {
            throw new ApplicationError('Quiz not found', StatusCodes.NOT_FOUND);
        }
    }

    async checkIfQuestionExists(questionId: ObjectId): Promise<void> {
        const question = await QuestionModel.findOne({
            _id: questionId,
        });
        if (!question) {
            throw new ApplicationError('Question not found', StatusCodes.NOT_FOUND);
        }
    }

    async checkIfRewardExists(rewardId: ObjectId): Promise<void> {
        const reward = await RewardModel.findOne({
            _id: rewardId,
        });
        if (!reward) {
            throw new ApplicationError('Reward not found', StatusCodes.NOT_FOUND);
        }
    }

    async checkIfUserExists(userId: ObjectId): Promise<void> {
        const user = await UserModel.findOne({
            _id: userId,
        });
        if (!user) {
            throw new ApplicationError('User not found', StatusCodes.NOT_FOUND);
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

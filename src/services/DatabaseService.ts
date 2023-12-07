import mongoose from 'mongoose';
import handleError from '../utils/handleError';
import { Example, ExampleModel } from '../models/Example';
import { mongoDBUri } from '../config/environment';
import { UserModel, User } from '../models/User';
import { Reward, RewardModel } from '../models/Reward';
import { Chapter, ChapterModel } from '../models/Chapter';
import { Quiz, QuizModel } from '../models/Quiz';
import { Question, QuestionModel } from '../models/Question';
import { QuizDone, QuizDoneModel } from '../models/QuizDone';
import { ChapterDone, ChapterDoneModel } from '../models/ChapterDone';

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

    async addExample(): Promise<void> {
        try {
            await ExampleModel.create<Example>({
                name: 'Example',
            });

            const createdUser = await UserModel.create<User>({
                firstName: 'Example name',
                lastName: 'Example surname',
                email: 'asd@asd.pl',
                image: 'https://i.imgur.com/e8buxpa.jpeg',
                points: 0,
                password: 'asd',
            });

            await RewardModel.create<Reward>({
                cost: 1500,
                description: 'This is an example',
            });

            const createdQuestion = await QuestionModel.create<Question>({
                description: 'Example question',
                answers: ['a', 'b', 'c', 'd'],
                correctAnswerIndex: 0,
            });

            const createdQuiz = await QuizModel.create<Quiz>({
                title: 'Example quiz',
                points: 100,
                questions: [createdQuestion._id],
            });

            const createdChapter = await ChapterModel.create<Chapter>({
                title: 'Example chapter',
                quizzes: [createdQuiz._id],
            });

            await QuizDoneModel.create<QuizDone>({
                userId: createdUser._id,
                quizId: createdQuiz._id,
            });

            await ChapterDoneModel.create<ChapterDone>({
                userId: createdUser._id,
                chapterId: createdChapter._id,
            });

            console.info('🗄️ Added example to MongoDB');
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async getExamplesCollection(): Promise<Example[]> {
        try {
            const examples = await ExampleModel.find();
            console.info('🗄️ Fetched examples from MongoDB');
            return examples;
        } catch (error) {
            throw handleError(error, 'Failed to fetch examples from MongoDB');
        }
    }
}

export default new DatabaseService();

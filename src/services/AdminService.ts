import { ObjectId } from 'mongodb';
import { Chapter, ChapterModel } from '../models/Chapter';
import { Question, QuestionModel } from '../models/Question';
import { Quiz, QuizModel } from '../models/Quiz';
import { Reward, RewardModel } from '../models/Reward';
import toApplicationError from '../utils/toApplicationError';
import { User, UserModel } from '../models/User';

class AdminService {
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
            throw toApplicationError(error, (error as any).message);
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
            throw toApplicationError(error, (error as any).message);
        }
    }

    async addChapter(chapter: Partial<Chapter>): Promise<ObjectId> {
        try {
            const { _id: chapterId } = await ChapterModel.create({
                title: chapter.title,
            });
            return chapterId;
        } catch (error) {
            throw toApplicationError(error, (error as any).message);
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
            throw toApplicationError(error, (error as any).message);
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
            throw toApplicationError(error, (error as any).message);
        }
    }
}

export default AdminService;

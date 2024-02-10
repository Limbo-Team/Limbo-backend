import mongoose, { InferSchemaType } from 'mongoose';
import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';

const quizDoneSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    completedAt: {
        type: Date,
        default: Date.now,
        set: (date: Date) => {
            return new Date(new Date(date).toISOString().split('T')[0]);
        },
        get: (date: Date) => {
            return new Date(new Date(date).toISOString().split('T')[0]);
        },
        immutable: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: false,
        immutable: true,
    },
});

type QuizDoneSchemaType = InferSchemaType<typeof quizDoneSchema>;
export interface QuizDone extends QuizDoneSchemaType, mongoose.Document {}
export const QuizDoneModel = mongoose.model<QuizDone>('QuizDone', quizDoneSchema, 'quizzesDone');

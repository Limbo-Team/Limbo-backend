import { StatusCodes } from 'http-status-codes';
import mongoose, { InferSchemaType } from 'mongoose';
import ApplicationError from '../utils/ApplicationError';

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        max: 50,
    },
    points: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true,
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
        immutable: true,
    },
});

quizSchema.post('findOne', function (error: any, doc: any, next: any): any {
    next(new ApplicationError('Quiz not found', StatusCodes.NOT_FOUND));
});

export type QuizSchemaType = InferSchemaType<typeof quizSchema>;
export interface Quiz extends QuizSchemaType, mongoose.Document {}
export const QuizModel = mongoose.model<Quiz>('Quiz', quizSchema);

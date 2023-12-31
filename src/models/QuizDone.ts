import mongoose, { InferSchemaType } from 'mongoose';

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

export type QuizDone = InferSchemaType<typeof quizDoneSchema>;
export const QuizDoneModel = mongoose.model<QuizDone>('QuizDone', quizDoneSchema, 'quizzesDone');

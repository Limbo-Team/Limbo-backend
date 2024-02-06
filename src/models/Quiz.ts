import mongoose, { InferSchemaType } from 'mongoose';

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

export type QuizSchemaType = InferSchemaType<typeof quizSchema>;
export interface Quiz extends QuizSchemaType, mongoose.Document {}
export const QuizModel = mongoose.model<Quiz>('Quiz', quizSchema);

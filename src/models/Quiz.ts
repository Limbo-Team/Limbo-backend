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
    questions: {
        type: [mongoose.Schema.Types.ObjectId],
        required: false,
        ref: 'Question',
        default: [],
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
    },
});

export type Quiz = InferSchemaType<typeof quizSchema>;
export const QuizModel = mongoose.model<Quiz>('Quiz', quizSchema);

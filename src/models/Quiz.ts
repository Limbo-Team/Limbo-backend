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
    questionIds: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: 'Question',
        default: [],
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export type Quiz = InferSchemaType<typeof quizSchema>;
export const QuizModel = mongoose.model<Quiz>('Quiz', quizSchema);

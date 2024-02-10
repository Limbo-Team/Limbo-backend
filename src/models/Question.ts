import { StatusCodes } from 'http-status-codes';
import mongoose, { InferSchemaType } from 'mongoose';
import ApplicationError from '../utils/ApplicationError';

const questionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 300,
    },
    image: {
        type: String,
        required: false,
        validate: {
            validator: (value: string) => {
                return /^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i.test(value);
            },
            message: (props: any) => `${props.value} is not a valid image URL.`,
        },
    },
    answers: {
        type: [String],
        required: true,
    },
    correctAnswerIndex: {
        type: Number,
        required: true,
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
});

questionSchema.post('find', function (error: any, doc: any, next: any): any {
    next(new ApplicationError('Questions not found', StatusCodes.NOT_FOUND));
});

type QuestionSchemaType = InferSchemaType<typeof questionSchema>;
export interface Question extends QuestionSchemaType, mongoose.Document {}
export const QuestionModel = mongoose.model<Question>('Question', questionSchema);

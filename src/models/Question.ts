import mongoose, { InferSchemaType } from 'mongoose';

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
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
        immutable: true,
    },
});

export type Question = InferSchemaType<typeof questionSchema>;
export const QuestionModel = mongoose.model<Question>('Question', questionSchema);

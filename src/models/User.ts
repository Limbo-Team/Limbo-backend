import mongoose, { InferSchemaType } from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    surname: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => {
                return /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value);
            },
            message: (props: any) => `${props.value} is not a valid email.`,
        },
    },
    image: {
        type: String,
        required: true,
        default: 'https://i.imgur.com/e8buxpa.jpeg',
        validate: {
            validator: (value: string) => {
                return /^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i.test(value);
            },
            message: (props: any) => `${props.value} is not a valid image URL.`,
        },
    },
    points: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    password: {
        type: String,
        required: true,
    },
    rewards: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Reward',
        required: true,
        default: [],
    },
    chaptersDone: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Chapter',
        required: true,
        default: [],
    },
    quizesDone: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Quiz',
        required: true,
        default: [],
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export type User = InferSchemaType<typeof userSchema>;
export const UserModel = mongoose.model<User>('User', userSchema);

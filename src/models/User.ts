import mongoose, { InferSchemaType } from 'mongoose';
import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';
import toApplicationError from '../utils/toApplicationError';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    lastName: {
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
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
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
        min: 0,
        default: 0,
    },
    rewards: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Reward',
        default: [],
    },
    active: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
});

userSchema.post('findOne', function (error: any, doc: any, next: any): any {
    next(new ApplicationError('User not found', StatusCodes.NOT_FOUND));
});

type UserSchemaType = InferSchemaType<typeof userSchema>;
export interface User extends UserSchemaType, mongoose.Document {}
export const UserModel = mongoose.model<User>('User', userSchema);

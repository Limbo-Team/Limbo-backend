import { ObjectId } from 'mongoose';
import { User } from '../models/User';

export type UserSignInBody = {
    email: string;
    password: string;
};

export type UserSignUpBody = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

export type AnswerQuizBody = {
    questionId: ObjectId;
    answer: string;
}[];

export interface FetchedUser extends User {
    _id: string;
    __v: number;
}

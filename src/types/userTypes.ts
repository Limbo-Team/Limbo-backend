import { ObjectId } from 'mongoose';

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

export type UserActivity = {
    date: Date;
    points: number;
};

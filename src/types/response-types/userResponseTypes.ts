import { ObjectId } from 'mongodb';

export type GetUserChaptersResponse = {
    chapterId: ObjectId;
    maximumQuizzes: number;
    doneQuizzes: number;
    percentage: number;
}[];

export type GetUserActivityResponse = {
    date: Date;
    points: number;
}[];

export type SignInUserResponse = {
    authToken: string;
};

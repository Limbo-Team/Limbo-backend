import { ObjectId } from 'mongodb';

export type GetUserChaptersResponse = {
    chapterId: ObjectId;
    chapterTitle: string;
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
} & GetUserInfoResponse;

export type GetUserStatsResponse = {
    chaptersDone: number;
    quizzesDone: number;
    userRewards: string[];
};

export type GetUserInfoResponse = {
    firstName: string;
    lastName: string;
    email: string;
    image: string;
    points: number;
};

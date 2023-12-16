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

export interface FetchedUser extends User {
    _id: string;
    __v: number;
}

import { User } from '../models/User';

export type UserSignInBody = {
    email: string;
    password: string;
};

export interface FetchedUser extends User {
    _id: string;
    __v: number;
}

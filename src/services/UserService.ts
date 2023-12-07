import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/User';
import { FetchedUser, UserSignInBody, UserSignUpBody } from '../types/userTypes';
import jwt from 'jsonwebtoken';
import ApplicationError from '../utils/ApplicationError';
import { accessTokenSecret } from '../config/environment';

class UserService {
    async signInUser(userData: UserSignInBody): Promise<string> {
        if (!userData || !userData.email || !userData.password)
            throw new ApplicationError('Invalid user data', StatusCodes.BAD_REQUEST);

        const user: FetchedUser | null = await UserModel.findOne({
            email: userData.email,
            password: userData.password,
        });

        if (!user) {
            throw new ApplicationError('Wrong email or password', StatusCodes.UNAUTHORIZED);
        }

        const userDataToHash = { id: user._id };
        const signToken: string = jwt.sign(userDataToHash, accessTokenSecret as string);

        return signToken;
    }

    async signUpUser(userData: UserSignUpBody): Promise<void> {
        if (!userData || !userData.email || !userData.password || !userData.firstName || !userData.lastName)
            throw new ApplicationError('Invalid user data', StatusCodes.BAD_REQUEST);

        const user: FetchedUser | null = await UserModel.findOne({
            email: userData.email,
        });

        if (user) {
            throw new ApplicationError('User already exists', StatusCodes.CONFLICT);
        }

        await UserModel.create(userData);
    }
}

export default UserService;

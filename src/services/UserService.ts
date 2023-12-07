import { StatusCodes } from 'http-status-codes';
import { UserModel } from '../models/User';
import { FetchedUser, UserSignInBody } from '../types/userTypes';
import jwt from 'jsonwebtoken';
import ApplicationError from '../utils/ApplicationError';
import { accessTokenSecret } from '../config/environment';

class UserService {
    async signInUser(userData: UserSignInBody): Promise<string> {
        const user: FetchedUser | null = await UserModel.findOne({
            email: userData.email,
            password: userData.password,
        });

        if (!user) {
            throw new ApplicationError('User not found', StatusCodes.NOT_FOUND);
        }

        const userDataToHash = { id: user._id };
        const signToken: string = jwt.sign(userDataToHash, accessTokenSecret as string);

        return signToken;
    }
}

export default UserService;

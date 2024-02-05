import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';
import { FetchedUser } from '../types/userTypes';
import { UserModel } from '../models/User';
import { passwordReset } from '../types/PasswordTypes';
import sendEmail from './EmailServices';

class PasswordService {
    async resetPassword(email: passwordReset): Promise<void> {
        if (!email) throw new ApplicationError('Invalid email', StatusCodes.BAD_REQUEST);

        const user: FetchedUser | null = await UserModel.findOne({
            email: email.email,
        });

        if (!user) throw new ApplicationError('User does not exist', StatusCodes.NOT_FOUND);

        try {
            await sendEmail({ destinationMail: email.email });
        } catch (error) {
            throw new ApplicationError('Email not sent', StatusCodes.INTERNAL_SERVER_ERROR);
        }

        return;
    }
}

export default PasswordService;

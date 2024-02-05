import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';
import { passwordReset } from '../types/PasswordTypes';
import sendEmail from './EmailServices';
import DatabaseService from './DatabaseService';

class PasswordService {
    async resetPassword(email: passwordReset): Promise<void> {
        if (!email) throw new ApplicationError('Invalid email', StatusCodes.BAD_REQUEST);

        try {
            DatabaseService.checkIfUserWithMailExists(email.email);
            await sendEmail({ destinationMail: email.email });
        } catch (error) {
            throw new ApplicationError('Error during email sending', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default PasswordService;

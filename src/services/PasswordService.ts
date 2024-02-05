import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';
import { passwordReset } from '../types/PasswordTypes';
import sendEmail from './EmailServices';
import DatabaseService from './DatabaseService';

class PasswordService {
    async resetPassword(email: passwordReset): Promise<void> {
        if (!email) throw new ApplicationError('Invalid email', StatusCodes.BAD_REQUEST);

        try {
            const resetCode = Math.floor(100000 + Math.random() * 900000);
            const userId = await DatabaseService.checkIfUserWithMailExists(email.email);
            DatabaseService.createResetCode(userId, resetCode, new Date());
            await sendEmail({ destinationMail: email.email, resetCode: resetCode });
        } catch (error) {
            throw new ApplicationError('Error during email sending', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default PasswordService;

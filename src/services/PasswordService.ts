import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';
import { PasswordReset } from '../types/PasswordTypes';
import sendEmail from './EmailServices';
import DatabaseService from './DatabaseService';
import jwt from 'jsonwebtoken';
import { emailResetTokenSecret } from '../config/environment';
import { Request } from 'express';
import AuthenticationError from '../utils/AuthenticationError';

class PasswordService {
    async resetPassword(email: PasswordReset): Promise<string> {
        if (!email) throw new ApplicationError('Invalid email', StatusCodes.BAD_REQUEST);

        try {
            const resetCode = Math.floor(100000 + Math.random() * 900000);
            const userId = await DatabaseService.checkIfUserWithMailExists(email.email);
            const dataToHash = { id: userId };
            const emailResetAuthToken: string = jwt.sign(dataToHash, emailResetTokenSecret as string, {
                expiresIn: 5 * 60,
            });
            console.log(emailResetAuthToken);
            DatabaseService.createResetCode(userId, resetCode, new Date(), emailResetAuthToken);
            await sendEmail({ destinationMail: email.email, resetCode: resetCode });

            return emailResetAuthToken;
        } catch (error) {
            console.error(error);
            throw new ApplicationError('Error during email sending', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    async verifyPassword(code: string): Promise<void> {
        if (!code) throw new ApplicationError('Invalid code', StatusCodes.BAD_REQUEST);

        try {
            await DatabaseService.getResetCode(Number(code));
        } catch (error) {
            throw new ApplicationError('Invalid code', StatusCodes.BAD_REQUEST);
        }
    }

    async changePassword(req: Request, newPassword: string, confirmPassword: string): Promise<void> {
        if (!newPassword || newPassword !== confirmPassword)
            throw new ApplicationError('Invalid new password', StatusCodes.BAD_REQUEST);

        const token: string | undefined = req.header('Authorization');
        if (!token) throw new AuthenticationError('No token provided');
        const bearer = token.split(' ')[0];

        if (bearer !== 'Bearer') throw new AuthenticationError('Invalid token type');
        const bearerToken = token.split(' ')[1];

        if (!bearerToken) throw new AuthenticationError('No token provided');

        jwt.verify(bearerToken, emailResetTokenSecret as string, (error) => {
            if (error) {
                console.log(bearerToken, '\n', emailResetTokenSecret);
                throw new AuthenticationError('Invalid token');
            }
        });

        try {
            const userId = await DatabaseService.findUserIdByEmailAuthToken(bearerToken);
            await DatabaseService.changeUserPassword(userId, newPassword);
        } catch (error) {
            console.error(error);
            throw new ApplicationError('Error during password change', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default PasswordService;

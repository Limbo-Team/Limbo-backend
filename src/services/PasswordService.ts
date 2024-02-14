import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';
import { PasswordReset } from '../types/PasswordTypes';
import sendEmail from './EmailServices';
import DatabaseService from './DatabaseService';
import jwt from 'jsonwebtoken';
import { emailResetTokenSecret } from '../config/environment';
import { Request } from 'express';
import AuthenticationError from '../utils/AuthenticationError';
import handleError from '../utils/handleError';

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
            DatabaseService.createResetCode(userId, resetCode, new Date(), emailResetAuthToken);
            await sendEmail({ destinationMail: email.email, resetCode: resetCode });

            return emailResetAuthToken;
        } catch (error: any) {
            throw handleError(error, (error as any).message);
        }
    }

    async verifyPassword(req: Request, code: string): Promise<void> {
        if (!code) throw new ApplicationError('Invalid code', StatusCodes.BAD_REQUEST);

        try {
            const token = await this.verifyToken(req.header('Authorization'));
            await DatabaseService.getResetCode(Number(code), token);
        } catch (error: any) {
            throw handleError(error, (error as any).message);
        }
    }

    async changePassword(req: Request, newPassword: string, confirmPassword: string): Promise<void> {
        if (!newPassword || newPassword !== confirmPassword)
            throw new ApplicationError('Invalid new password', StatusCodes.BAD_REQUEST);

        try {
            const token = await this.verifyToken(req.header('Authorization'));
            const userId = await DatabaseService.findUserIdByEmailAuthToken(token);
            await DatabaseService.changeUserPassword(userId, newPassword);
            await DatabaseService.deleteResetCode(userId);
        } catch (error) {
            throw handleError(error, (error as any).message);
        }
    }

    async verifyToken(token: string | undefined): Promise<string> {
        if (!token) throw new AuthenticationError('No token provided');
        const bearer = token.split(' ')[0];

        if (bearer !== 'Bearer') throw new AuthenticationError('Invalid token type');
        const bearerToken = token.split(' ')[1];

        if (!bearerToken) throw new AuthenticationError('No token provided');

        try {
            jwt.verify(bearerToken, emailResetTokenSecret as string);
        } catch (error) {
            const userId = await DatabaseService.findUserIdByEmailAuthToken(bearerToken);
            DatabaseService.deleteResetCode(userId);
            throw handleError(error, (error as any).message);
        }
        return bearerToken;
    }
}

export default PasswordService;

import { NextFunction, Request, Response } from 'express';
import { PasswordReset } from '../types/PasswordTypes';
import PasswordService from '../services/PasswordService';
import { StatusCodes } from 'http-status-codes';

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email: PasswordReset = req.body;
        const passwordService = new PasswordService();
        const emailResetAuthToken = await passwordService.resetPassword(email);

        return res.status(StatusCodes.OK).json(emailResetAuthToken);
    } catch (error) {
        next(error);
    }
};

export const verifyPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const code: string = req.body.code;
        const passwordService = new PasswordService();
        await passwordService.verifyPassword(req, code);

        return res.sendStatus(StatusCodes.OK);
    } catch (error) {
        next(error);
    }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newPassword: string = req.body.newPassword;
        const confirmPassword: string = req.body.confirmPassword;
        const passwordService = new PasswordService();
        await passwordService.changePassword(req, newPassword, confirmPassword);

        return res.sendStatus(StatusCodes.OK);
    } catch (error) {
        next(error);
    }
};

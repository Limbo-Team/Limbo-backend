import { NextFunction, Request, Response } from 'express';
import { passwordReset } from '../types/PasswordTypes';
import PasswordService from '../services/PasswordService';
import { StatusCodes } from 'http-status-codes';

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email: passwordReset = req.body;
        const passwordService = new PasswordService();
        await passwordService.resetPassword(email);

        return res.sendStatus(StatusCodes.OK);
    } catch (error) {
        next(error);
    }
};

export const verifyPassword = async (req: Request, res: Response, next: NextFunction) => {};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {};
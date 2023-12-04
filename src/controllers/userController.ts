import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userSignBody } from '../types/userTypes';
import { UserModel, User } from '../models/User';
import jwt from 'jsonwebtoken';
import DatabaseService from '../services/DatabaseService';

export const signUser = async (req: Request, res: Response, next: NextFunction) => {
    const userData: userSignBody = req.body;

    const databaseService = new DatabaseService();
    await databaseService.connect();

    try {
        const user: User | null = await UserModel.findOne({
            email: userData.email,
            password: userData.password,
        });

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: 'user does not exist',
            });
        }

        const userDataToHash = { email: user.email, password: user.password };

        const signToken: string = jwt.sign(userDataToHash, process.env.ACCESS_TOKEN_SECRET as string);

        return res.status(StatusCodes.OK).send({
            message: 'OK',
            authToken: signToken,
        });
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            message: 'user does not exists',
        });
    }
};

export const logoutUser = (req: Request, res: Response, next: NextFunction) => {
    return res.sendStatus(StatusCodes.OK);
};

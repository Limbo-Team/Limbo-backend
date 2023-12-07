import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import DatabaseService from '../services/DatabaseService';

export const getExamplesCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const examplesCollection = await DatabaseService.getExamplesCollection();
        res.status(StatusCodes.OK).json(examplesCollection);
    } catch (error) {
        next(error);
    }
};

export const addExample = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await DatabaseService.addExample();
        res.status(StatusCodes.CREATED).send('Example added to MongoDB database');
    } catch (error) {
        next(error);
    }
};

import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import DatabaseService from '../services/DatabaseService';

export const getExamplesCollection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const databaseService = new DatabaseService();
        await databaseService.connect();
        const examplesCollection = await databaseService.getExamplesCollection();
        await databaseService.disconnect();
        res.status(StatusCodes.OK).json(examplesCollection);
    } catch (error) {
        next(error);
    }
};

export const addExample = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const databaseService = new DatabaseService();
        await databaseService.connect();
        await databaseService.addExample();
        await databaseService.disconnect();
        res.status(StatusCodes.CREATED).send('Example added to MongoDB database');
    } catch (error) {
        next(error);
    }
};

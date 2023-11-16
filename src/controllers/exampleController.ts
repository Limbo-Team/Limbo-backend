import { NextFunction, Request, Response } from 'express';
import ExampleService from '../services/exampleService';
import { StatusCodes } from 'http-status-codes';

export const exampleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const message = await ExampleService.getWelcomeMessage();
        res.status(StatusCodes.OK).json({ message });
    } catch (error) {
        next(error);
    }
};

import { Router } from 'express';
import { addExample, getExamplesCollection } from '../controllers/exampleDBController';

const exampleDBRouter = Router();

exampleDBRouter.get('/', getExamplesCollection);
exampleDBRouter.post('/', addExample);

export default exampleDBRouter;

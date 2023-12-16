import { Router } from 'express';
import { healthcheckController } from '../controllers/healthcheckController';

const healthcheckRouter = Router();

healthcheckRouter.get('/', healthcheckController);

export default healthcheckRouter;

import { Router } from 'express';
import { signUser } from '../controllers/userController';

const userRouter = Router();

userRouter.post('/sign', signUser);

export default userRouter;

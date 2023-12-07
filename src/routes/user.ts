import { Router } from 'express';
import { signOutUser, signInUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authHandler';

const userRouter = Router();

userRouter.post('/signin', signInUser);
userRouter.post('/signout', authenticateToken, signOutUser);

export default userRouter;

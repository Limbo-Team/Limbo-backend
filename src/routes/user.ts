import { Router } from 'express';
import { signOutUser, signInUser, signUpUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authHandler';

const userRouter = Router();

userRouter.post('/signin', signInUser);
userRouter.post('/signout', authenticateToken, signOutUser);
userRouter.post('/signup', signUpUser);

export default userRouter;

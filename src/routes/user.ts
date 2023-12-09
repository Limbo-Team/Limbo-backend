import { Router } from 'express';
import { signOutUser, signInUser, signUpUser, getUserChapters } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authHandler';

const userRouter = Router();

userRouter.post('/signin', signInUser);
userRouter.post('/signout', authenticateToken, signOutUser);
userRouter.post('/signup', signUpUser);
userRouter.get('/chapters', authenticateToken, getUserChapters);

export default userRouter;

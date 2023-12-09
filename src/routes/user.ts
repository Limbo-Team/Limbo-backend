import { Router } from 'express';
import { signOutUser, signInUser, signUpUser, getUserChapters, getUserActivity } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authHandler';

const userRouter = Router();

userRouter.post('/signin', signInUser);
userRouter.post('/signup', signUpUser);

userRouter.all('*', authenticateToken);
userRouter.post('/signout', signOutUser);
userRouter.get('/chapters', getUserChapters);
userRouter.get('/activity', getUserActivity);

export default userRouter;

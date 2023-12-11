import { Router } from 'express';
import {
    signOutUser,
    signInUser,
    signUpUser,
    getUserChapters,
    getUserActivity,
    getUserStats,
} from '../controllers/userController';
import { authenticateToken } from '../middlewares/authHandler';

const userRouter = Router();

userRouter.post('/signin', signInUser);
userRouter.post('/signup', signUpUser);

userRouter.all('*', authenticateToken);
userRouter.post('/signout', signOutUser);
userRouter.get('/chapters', getUserChapters);
userRouter.get('/activity', getUserActivity);
userRouter.get('/stats', getUserStats);

export default userRouter;

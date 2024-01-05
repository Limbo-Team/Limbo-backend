import { Router } from 'express';
import {
    signOutUser,
    signInUser,
    signUpUser,
    getUserChapters,
    getUserActivity,
    getUserStats,
    getUserInfo,
    getUserQuizzes,
    getQuizQuestions,
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
userRouter.get('/info', getUserInfo);
userRouter.get('/chapters/:chapterId/quizzes', getUserQuizzes);
userRouter.get('/quizzes/:quizId/questions', getQuizQuestions);

export default userRouter;

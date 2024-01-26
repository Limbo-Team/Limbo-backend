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
    getUserAvailableRewards,
    buyUserReward,
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
userRouter.get('/rewards/available', getUserAvailableRewards);
userRouter.post('/rewards/:rewardId', buyUserReward);

export default userRouter;

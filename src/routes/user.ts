import { Router } from 'express';
import { logoutUser, signInUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authHandler';

const userRouter = Router();

userRouter.post('/signin', signInUser);
userRouter.post('/logout', authenticateToken, logoutUser);

export default userRouter;

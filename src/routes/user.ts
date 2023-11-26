import { Router } from 'express';
import { logoutUser, signUser } from '../controllers/userController';
import { authenticateToken } from '../middlewares/authHandler';

const userRouter = Router();

userRouter.post('/sign', signUser);
userRouter.post('/logout', authenticateToken, logoutUser);

export default userRouter;

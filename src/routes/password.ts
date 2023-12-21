import { Router } from 'express';
import { changePassword, resetPassword, verifyPassword } from '../controllers/passwordController';

const passwordRouter = Router();

passwordRouter.post('/reset', resetPassword);
passwordRouter.post('/reset/verify', verifyPassword);
passwordRouter.post('/reset/change', changePassword);

export default passwordRouter;

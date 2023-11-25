import { Router } from 'express';

const healthcheckRouter = Router();

healthcheckRouter.get('/', (req, res) => {
    res.send('OK');
});

export default healthcheckRouter;

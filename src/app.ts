import express from 'express';
import requestLogger from './middlewares/requestLogger';
import responseLogger from './middlewares/responseLogger';
import errorLogger from './middlewares/errorLogger';
import errorHandler from './middlewares/errorHandler';
import { appPort } from './config/environment';
import healthcheckRouter from './routes/healthcheck';
import userRouter from './routes/user';
import DatabaseService from './services/DatabaseService';
import passwordRouter from './routes/password';

const app = express();
(async () => {
    await DatabaseService.connect();
})();

app.use(express.json());
app.use(requestLogger);
app.use(responseLogger);
app.use('/healthcheck', healthcheckRouter);
app.use('/user', userRouter);
app.use('/password', passwordRouter);
app.use(errorLogger);
app.use(errorHandler);
app.listen(appPort, () => console.log(`💪 Server is running on port ${appPort}`));

import express from 'express';
import requestLogger from './middlewares/requestLogger';
import responseLogger from './middlewares/responseLogger';
import exampleRouter from './routes/example';
import errorLogger from './middlewares/errorLogger';
import errorHandler from './middlewares/errorHandler';
import { appPort } from './config/environment';

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(responseLogger);
app.use('/example', exampleRouter);
app.use(errorLogger);
app.use(errorHandler);
app.listen(appPort, () => console.log(`💪 Server is running on port ${appPort}`));

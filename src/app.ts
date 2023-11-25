import express from 'express';
import requestLogger from './middlewares/requestLogger';
import responseLogger from './middlewares/responseLogger';
import exampleRouter from './routes/example';
import errorLogger from './middlewares/errorLogger';
import errorHandler from './middlewares/errorHandler';
import { appPort } from './config/environment';
import healthcheckRouter from './routes/healthcheck';
import { mongoDBUri } from './config/environment';
import { MongoClient } from 'mongodb';

const app = express();
app.use(express.json());
app.use(requestLogger);

(async () => {
    try {
        const client = new MongoClient(mongoDBUri as string);
        await client.connect();
        console.log('🗄️ Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
})();

app.use(responseLogger);
app.use('/healthcheck', healthcheckRouter);
app.use('/example', exampleRouter);
app.use(errorLogger);
app.use(errorHandler);
app.listen(appPort, () => console.log(`💪 Server is running on port ${appPort}`));

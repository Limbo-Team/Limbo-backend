import mongoose from 'mongoose';
import handleError from '../utils/handleError';
import { Example, ExampleModel } from '../models/Example';
import { mongoDBUri } from '../config/environment';

class DatabaseService {
    async connect(): Promise<DatabaseService> {
        try {
            await mongoose.connect(mongoDBUri as string);
            console.info('🗄️ Connected to MongoDB');
            return this;
        } catch (error) {
            throw handleError(error, 'Failed to connect to MongoDB');
        }
    }

    async disconnect(): Promise<void> {
        try {
            await mongoose.disconnect();
            console.info('🗄️ Disconnected from MongoDB');
        } catch (error) {
            throw handleError(error, 'Failed to disconnect from MongoDB');
        }
    }

    async addExample(): Promise<void> {
        try {
            await ExampleModel.create({
                name: 'Example',
                description: 'This is an example',
            });
            console.info('🗄️ Added example to MongoDB');
        } catch (error) {
            throw handleError(error, 'Failed to add example to MongoDB');
        }
    }

    async getExamplesCollection(): Promise<Example[]> {
        try {
            const examples = await ExampleModel.find();
            console.info('🗄️ Fetched examples from MongoDB');
            return examples;
        } catch (error) {
            throw handleError(error, 'Failed to fetch examples from MongoDB');
        }
    }
}

export default DatabaseService;

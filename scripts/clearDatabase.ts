//drop database

import mongoose from 'mongoose';
import DatabaseService from '../src/services/DatabaseService';
(async () => {
    await DatabaseService.connect();
    await mongoose.connection.dropDatabase();
    console.info('🗄️ Dropped database');
    await DatabaseService.disconnect();
})();

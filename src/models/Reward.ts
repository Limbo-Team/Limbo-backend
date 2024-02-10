import mongoose, { InferSchemaType } from 'mongoose';
import ApplicationError from '../utils/ApplicationError';
import { StatusCodes } from 'http-status-codes';

const rewardSchema = new mongoose.Schema({
    cost: {
        type: Number,
        required: true,
        min: 0,
        max: 10_000,
    },
    description: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 300,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
});

rewardSchema.post('findOne', function (error: any, doc: any, next: any): any {
    next(new ApplicationError('Reward not found', StatusCodes.NOT_FOUND));
});

type RewardSchemaType = InferSchemaType<typeof rewardSchema>;
export interface Reward extends RewardSchemaType, mongoose.Document {}
export const RewardModel = mongoose.model<Reward>('Reward', rewardSchema);

import mongoose, { InferSchemaType } from 'mongoose';

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

type RewardSchemaType = InferSchemaType<typeof rewardSchema>;
export interface Reward extends RewardSchemaType, mongoose.Document {}
export const RewardModel = mongoose.model<Reward>('Reward', rewardSchema);

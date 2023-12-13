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

export type Reward = InferSchemaType<typeof rewardSchema>;
export const RewardModel = mongoose.model<Reward>('Reward', rewardSchema);

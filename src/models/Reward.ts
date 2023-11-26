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
        required: false,
        default: Date.now,
    },
});

export type Reward = InferSchemaType<typeof rewardSchema>;
export const RewardModel = mongoose.model<Reward>('Reward', rewardSchema);

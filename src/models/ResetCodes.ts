import mongoose, { InferSchemaType } from 'mongoose';

const resetCodeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
});

export type ResetCode = InferSchemaType<typeof resetCodeSchema>;
export const ResetCodeModel = mongoose.model<ResetCode>('ResetCode', resetCodeSchema);

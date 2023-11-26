import mongoose, { InferSchemaType } from 'mongoose';

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        max: 50,
    },
    quizIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Quiz',
        required: true,
        default: [],
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export type Chapter = InferSchemaType<typeof chapterSchema>;
export const ChapterModel = mongoose.model<Chapter>('Chapter', chapterSchema);

import mongoose, { InferSchemaType } from 'mongoose';

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        max: 50,
    },
    quizzes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Quiz',
        required: false,
        default: [],
    },
    createdAt: {
        type: Date,
        required: false,
        default: Date.now,
        immutable: true,
    },
});

export type Chapter = InferSchemaType<typeof chapterSchema>;
export const ChapterModel = mongoose.model<Chapter>('Chapter', chapterSchema);

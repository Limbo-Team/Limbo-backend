import mongoose, { InferSchemaType } from 'mongoose';

const chapterDoneSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    chapterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chapter',
        required: true,
    },
    completedAt: {
        type: Date,
        default: Date.now,
        required: false,
        set: (date: Date) => {
            return new Date(new Date(date).toISOString().split('T')[0]);
        },
        get: (date: Date) => {
            return new Date(new Date(date).toISOString().split('T')[0]);
        },
        immutable: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: false,
        immutable: true,
    },
});

export type ChapterDone = InferSchemaType<typeof chapterDoneSchema>;
export const ChapterDoneModel = mongoose.model<ChapterDone>('ChapterDone', chapterDoneSchema, 'chaptersDone');

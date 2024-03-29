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
        immutable: true,
    },
});

chapterDoneSchema.post('find', () => {
    console.log('post find hookers');
});

export type ChapterDoneSchemaType = InferSchemaType<typeof chapterDoneSchema>;
export interface ChapterDone extends ChapterDoneSchemaType, mongoose.Document {}
export const ChapterDoneModel = mongoose.model<ChapterDone>('ChapterDone', chapterDoneSchema, 'chaptersDone');

import mongoose, { InferSchemaType } from 'mongoose';

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        max: 50,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        immutable: true,
    },
});

export type ChapterSchemaType = InferSchemaType<typeof chapterSchema>;
export interface Chapter extends ChapterSchemaType, mongoose.Document {}
export const ChapterModel = mongoose.model<Chapter>('Chapter', chapterSchema);

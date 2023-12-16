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

export type Chapter = InferSchemaType<typeof chapterSchema>;
export const ChapterModel = mongoose.model<Chapter>('Chapter', chapterSchema);

import mongoose, { InferSchemaType } from 'mongoose';

const exampleSchema = new mongoose.Schema({
    name: String,
    description: String,
});

export type Example = InferSchemaType<typeof exampleSchema>;
export const ExampleModel = mongoose.model<Example>('Example', exampleSchema);

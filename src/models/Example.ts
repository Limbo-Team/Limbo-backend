import mongoose, { InferSchemaType } from 'mongoose';

const exampleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
        default: 'This is an example.',
    },
});

export type Example = InferSchemaType<typeof exampleSchema>;
export const ExampleModel = mongoose.model<Example>('Example', exampleSchema);

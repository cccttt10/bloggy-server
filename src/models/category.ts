import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
import { ServerError } from '../util/util';
const instance = db.instance;

export interface ICategory {
    name: string;
    description?: string;
    user: string; // _id field of user
    createdOn?: Date;
    updatedOn?: Date;
}

export type CategoryDocument = mongoose.Document & ICategory;

const categorySchema = new instance.Schema({
    name: { type: String, required: true, validate: /\S+/ }, // no whitespace in name
    description: { type: String, default: '' },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Category must belong to a user'],
    },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

export const Category = instance.model<CategoryDocument>('Category', categorySchema);

// avoid using arrow function here to perserve this context
categorySchema.pre('save', async function (
    next: mongoose.HookNextFunction
): Promise<void> {
    const categoryAlreadyExists: boolean = await Category.exists({
        name: (this as CategoryDocument).name,
        user: (this as CategoryDocument).user,
    });
    if (categoryAlreadyExists) {
        throw new ServerError({
            statusCode: 400,
            message: 'This user already has this category.',
        });
    }
    next();
});

/*
configure auto-incrementing id
*/
categorySchema.plugin(autoIncrement.plugin, {
    model: 'Category',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

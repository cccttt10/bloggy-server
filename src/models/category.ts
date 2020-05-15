import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
const instance = db.instance;

export type CategoryDocument = mongoose.Document & {
    name: string;
    description: string;
    createdOn: Date;
    updatedOn: Date;
};

const categorySchema = new instance.Schema({
    name: { type: String, required: true, validate: /\S+/ },
    description: String,
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
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

export const Category = instance.model<CategoryDocument>('Category', categorySchema);

import mongoose from 'mongoose';

import db from '../mongodb.config';
const instance = db.instance;
import { UserDocument } from './user';

export interface ICategory {
    name: string;
    description?: string;
    user: UserDocument['_id'];
    createdOn?: Date;
    updatedOn?: Date;
}

export type CategoryDocument = mongoose.Document & ICategory;

const categorySchema = new instance.Schema({
    name: { type: String, required: true },
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

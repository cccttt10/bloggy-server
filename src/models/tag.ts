import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
const instance = db.instance;

export type TagDocument = mongoose.Document & {
    name: string;
    description: string;
    icon: string;
    createdOn: Date;
    updatedOn: Date;
};

const tagSchema = new instance.Schema({
    name: { type: String, required: true, validate: /\S+/ },
    description: String,
    icon: String,
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

/*
configure auto-incrementing id
*/
tagSchema.plugin(autoIncrement.plugin, {
    model: 'Tag',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

export const Tag = instance.model<TagDocument>('Tag', tagSchema);

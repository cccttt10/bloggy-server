import { LinkType, LinkVisibility } from 'global';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
const instance = db.instance;

export type LinkDocument = mongoose.Document & {
    name: string;
    description: string;
    url: string;
    icon: string;
    type: LinkType;
    visibility: LinkVisibility;
    createdOn: Date;
    updatedOn: Date;
};

const linkSchema = new instance.Schema({
    name: { type: String, required: true, validate: /\S+/ },
    description: { type: String, default: '' },
    url: { type: String, required: true, validate: /\S+/, default: '' },
    icon: { type: String, default: '' },
    type: { type: Number, default: 1 }, // 1: external, 2: internal
    visibility: { type: Number, default: 1 }, // 1: private, 2: public
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

/*
configure auto-incrementing id
*/
linkSchema.plugin(autoIncrement.plugin, {
    model: 'Link',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

export const Link = instance.model<LinkDocument>('Link', linkSchema);

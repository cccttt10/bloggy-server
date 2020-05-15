import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
const instance = db.instance;

export type SiteDocument = mongoose.Document & {
    title: string;
    logo: string;
    subtitle: string;
    keywords: string[];
    description: string;
    url: string;
    email: string;
    pingSites: string[];
    meta: {
        numLikes: number;
    };
};

const siteSchema = new instance.Schema({
    title: { type: String, required: true },
    logo: { type: String, required: true },
    subtitle: { type: String, required: true },
    keywords: [{ type: String }],
    description: String,
    url: { type: String, required: true },
    email: String,
    pingSites: [{ type: String, validate: /\S+/ }],
    meta: {
        numLikes: { type: Number, default: 0 },
    },
});

/*
configure auto-incrementing id
*/
siteSchema.plugin(autoIncrement.plugin, {
    model: 'Site',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

export const Site = instance.model<SiteDocument>('Site', siteSchema);

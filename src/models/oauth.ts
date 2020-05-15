/*
NOT NEEDED FOR NOW
*/
import { UserType } from 'global';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
const instance = db.instance;

export type OAuthDocument = mongoose.Document & {
    openId: string;
    name: string;

    /*
    0: blog owner，1 other, 2: github, 3: wechat, 4: qq
    0, 1 -> registered users, 2, 3, 4 -> third party auth users
    */
    type: UserType;

    phone: string;
    email: string;
    location: string;
    bio: string;
    avatar: string;
    createdOn: Date;
    updatedOn: Date;
};

const oAuthSchema = new instance.Schema({
    openId: { type: String, required: true, default: '' }, // id of third-party oauth
    name: { type: String, default: '' },

    /*
    0: blog owner，1 other, 2: github, 3: wechat, 4: qq
    0, 1 -> registered users, 2, 3, 4 -> third party auth users
    */
    type: { type: Number, default: 1 },

    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: 'user' },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

/*
configure auto-incrementing id
*/
oAuthSchema.plugin(autoIncrement.plugin, {
    model: 'OAuth',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

export const OAuth = instance.model<OAuthDocument>('OAuth', oAuthSchema);

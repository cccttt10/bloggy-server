import crypto from 'crypto';
import { UserType } from 'global';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
const instance = db.instance;

export type UserDocument = mongoose.Document & {
    githubId: string;
    name: string;
    type: UserType;
    phone: string;
    imgUrl: string;
    email: string;
    bio: string;
    avatar: string;
    location: string;
    password: string;
    createdOn: Date;
    updatedOn: Date;
};

const userSchema = new instance.Schema({
    githubId: { type: String, default: '' },
    name: { type: String, required: true, default: '' },

    /*
    0: blog owner，1 other, 2: github, 3: wechat, 4: qq
    0, 1 -> registered users, 2, 3, 4 -> third party auth users
    */
    type: { type: Number, default: 1 },

    phone: { type: String, default: '' },
    imgUrl: { type: String, default: '' },
    email: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: 'user' },
    location: { type: String, default: 'user' },
    password: {
        type: String,
        required: true,
        default: crypto
            .createHash('md5')
            .update(process.env.auth_default_password || 'root')
            .digest('hex'),
    },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

/*
configure auto-incrementing id
*/
userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

export const User = instance.model<UserDocument>('User', userSchema);

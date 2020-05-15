import { MessageState } from 'global';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
import { UserDocument } from './user';

const instance = db.instance;

export type MessageDocument = mongoose.Document & {
    userId: UserDocument['id'];
    name: UserDocument['name'];
    avatar: UserDocument['avatar'];
    phone: UserDocument['phone'];
    bio: UserDocument['bio'];
    content: string;
    replies: [
        {
            content: string;
        }
    ];
    email: UserDocument['email'];
    state: MessageState;
    createdOn: Date;
    updatedOn: Date;
};

const messageSchema = new instance.Schema({
    userId: { type: String, default: '' },
    name: { type: String, default: '' },
    avatar: { type: String, default: 'user' },
    phone: { type: String, default: '' },
    bio: { type: String, default: '' },
    content: { type: String, required: true },
    replies: [
        {
            content: { type: String, required: true },
        },
    ],
    email: { type: String, default: '' },
    state: { type: Number, default: 0 }, // 0: not reviewed, 1: reviewed
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

/*
configure auto-incrementing id
*/
messageSchema.plugin(autoIncrement.plugin, {
    model: 'Message',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

export const Message = instance.model<MessageDocument>('Message', messageSchema);

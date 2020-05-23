import mongoose from 'mongoose';

import db from '../mongodb.config';
import { ArticleDocument } from './article';
import { UserDocument } from './user';
const instance = db.instance;

export interface IComment {
    article: ArticleDocument['id'] | ArticleDocument;
    content: string;
    isPinned?: boolean;
    user: UserDocument['id'] | UserDocument;
    isApproved?: boolean;
    createdOn?: Date;
}

export type CommentDocument = mongoose.Document & IComment;

const commentSchema = new instance.Schema({
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
    content: { type: String, required: true, validate: /\S+/ },
    isPinned: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
});

export const Comment = instance.model<CommentDocument>('Comment', commentSchema);

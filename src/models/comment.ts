import mongoose from 'mongoose';

import db from '../mongodb.config';
import { ArticleDocument } from './article';
import { UserDocument } from './user';
const instance = db.instance;

export type CommentDocument = mongoose.Document & {
    articleId: ArticleDocument['id'] | ArticleDocument;
    content: string;
    isPinned?: boolean;
    numLikes?: number;
    userId: UserDocument['id'] | UserDocument;
    isApproved?: boolean;
    createdOn?: Date;
    updatedOn?: Date;
};

const commentSchema = new instance.Schema({
    articleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Article',
        required: true,
    },
    content: { type: String, required: true, validate: /\S+/ },
    isPinned: { type: Boolean, default: false },
    numLikes: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isApproved: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

export const Comment = instance.model<CommentDocument>('Comment', commentSchema);

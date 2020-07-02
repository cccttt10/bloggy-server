import mongoose from 'mongoose';

import db from '../mongodb.config';
const instance = db.instance;

import { DEFAULT_IMG_URL } from '../util/constants';
import { CategoryDocument } from './category';
import { CommentDocument } from './comment';
import { UserDocument } from './user';

export interface IArticle {
    title?: string;
    author: UserDocument['_id'] | UserDocument;
    description?: string;
    content?: string;
    wordCount?: number;
    imgUrl?: string;
    isDraft?: boolean;
    comments?: Array<CommentDocument['_id']> | CommentDocument[];
    categories?: Array<CategoryDocument['_id']> | CategoryDocument[];
    likedBy?: Array<UserDocument['_id']> | UserDocument[];
    meta?: {
        numViews: number;
        numLikes: number;
        numComments: number;
    };
    isAboutPage?: boolean;
    createdOn?: Date;
    updatedOn?: Date;
}

export type ArticleDocument = mongoose.Document & IArticle;

const articleSchema = new instance.Schema({
    title: { type: String, default: 'Untitled Blog' },
    author: { type: instance.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: 'This is a blog post.' },
    content: { type: String, default: 'No content yet.' },
    wordCount: { type: Number, default: 0 },
    imgUrl: { type: String, default: DEFAULT_IMG_URL },
    isDraft: { type: Boolean, default: true },
    comments: [{ type: instance.Schema.Types.ObjectId, ref: 'Comment' }],
    categories: [{ type: instance.Schema.Types.ObjectId, ref: 'Category' }],
    likedBy: [
        {
            type: instance.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    meta: {
        numViews: { type: Number, default: 0 },
        numLikes: { type: Number, default: 0 },
        numComments: { type: Number, default: 0 },
    },
    isAboutPage: { type: Boolean, default: false },
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

export const Article = instance.model<ArticleDocument>('Article', articleSchema);

import mongoose from 'mongoose';

import db from '../mongodb.config';
const instance = db.instance;

import { CategoryDocument } from './category';
import { CommentDocument } from './comment';
import { TagDocument } from './tag';
import { UserDocument } from './user';

export interface IArticle {
    title: string;
    author: UserDocument['_id'];
    description: string;
    content: string;
    wordCount: number;
    imgUrl: string;
    isDraft: boolean;
    tags: Array<TagDocument['_id']>;
    comments: Array<CommentDocument['_id']>;
    categories: Array<CategoryDocument['_id']>;
    likedBy: Array<UserDocument['_id']>;
    meta: {
        numViews: number;
        numLikes: number;
        numComments: number;
    };
    createdOn: Date;
    updatedOn: Date;
}

export type ArticleDocument = mongoose.Document & IArticle;

const articleSchema = new instance.Schema({
    title: { type: String, default: 'Untitled Blog' },
    author: { type: instance.Schema.Types.ObjectId, ref: 'User', required: true },
    description: { type: String, default: 'This is a blog post.' },
    content: { type: String, default: 'No content yet.' },
    wordCount: { type: Number, default: 0 },
    imgUrl: { type: String, default: 'https://s1.ax1x.com/2020/05/15/YDzq7d.jpg' },
    isDraft: { type: Boolean, default: true },
    tags: [{ type: instance.Schema.Types.ObjectId, ref: 'Tag' }],
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
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

export const Article = instance.model<ArticleDocument>('Article', articleSchema);

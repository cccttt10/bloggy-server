import { ArticleState, ArticleType, Originality } from 'global';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
const instance = db.instance;

import { CategoryDocument } from './category';
import { CommentDocument } from './comment';
import { TagDocument } from './tag';
import { UserDocument } from './user';

export type ArticleDocument = mongoose.Document & {
    title: string;
    keyword: number;
    author: string;
    description: string;
    content: string;
    wordCount: number;
    imgUrl: string;
    type: ArticleType;
    state: ArticleState;
    originality: Originality;
    tags: Array<TagDocument['id']>;
    comments: Array<CommentDocument['id']>;
    categories: Array<CategoryDocument['id']>;
    likedBy: Array<{
        id: UserDocument['id'];
        name: UserDocument['name'];
        bio: UserDocument['bio'];
        avatar: UserDocument['avatar'];
        createdOn: UserDocument['createdOn'];
    }>;
    meta: {
        numViews: number;
        numLikes: number;
        numComments: number;
    };
    createdOn: Date;
    updatedOn: Date;
};

const articleSchema = new instance.Schema({
    title: { type: String, required: true, validate: /\S+/ },
    keyword: [{ type: String, default: '' }], // for SEO
    author: { type: String, required: true, validate: /\S+/ },
    description: { type: String, default: '' },
    content: { type: String, required: true, validate: /\S+/ },
    wordCount: { type: Number, default: 0 },
    imgUrl: { type: String, default: 'https://s1.ax1x.com/2020/05/15/YDzq7d.jpg' },
    type: { type: Number, default: 1 }, // 1: blog post, 2: resume, 3: about me
    state: { type: Number, default: 1 }, // 1: draft, 2: published
    originality: { type: Number, default: 0 }, // 0: original, 1: repost, 2: mixed
    tags: [{ type: instance.Schema.Types.ObjectId, ref: 'Tag', required: true }],
    comments: [
        { type: instance.Schema.Types.ObjectId, ref: 'Comment', required: true },
    ],
    categories: [
        { type: instance.Schema.Types.ObjectId, ref: 'Category', required: true },
    ],
    likedBy: [
        {
            id: { type: instance.Schema.Types.ObjectId },
            name: { type: String, required: true, default: '' },
            bio: { type: String, default: '' },
            avatar: { type: String, default: 'user' },
            createdOn: { type: Date, default: Date.now },
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

/*
configure auto-incrementing id
*/
articleSchema.plugin(autoIncrement.plugin, {
    model: 'Article',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

export const Article = instance.model<ArticleDocument>('Article', articleSchema);

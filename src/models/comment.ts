import { CommentState, ReviewState, SimpleUserType } from 'global';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import db from '../mongodb.config';
import { ArticleDocument } from './article';
import { UserDocument } from './user';
const instance = db.instance;

type SimpleUser = {
    userId: UserDocument['id'];
    name: string;
    type: SimpleUserType;
    avatar: string;
};

export type CommentDocument = mongoose.Document & {
    articleId: ArticleDocument['id'];
    content: string;
    isPinned: boolean;
    numLikes: number;
    userId: UserDocument['id'];
    parentUser: SimpleUser; // user info about parent comment
    otherComments: Array<{
        user: SimpleUser; // who wrote the comment
        toUser: SimpleUser; // written to whom
        numLikes: CommentDocument['numLikes'];
        content: CommentDocument['content'];
        state: CommentDocument['state'];
        createdOn: CommentDocument['createdOn'];
    }>;
    state: CommentState;
    isReviewed: ReviewState;
    createdOn: Date;
    updatedOn: Date;
};

const commentSchema = new instance.Schema({
    articleId: { type: mongoose.Schema.Types.ObjectId, required: true },
    content: { type: String, required: true, validate: /\S+/ },
    isPinned: { type: Boolean, default: false },
    numLikes: { type: Number, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // user info about parent comment
    user: {
        userId: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String, required: true, default: '' },
        type: { type: Number, default: 1 }, // 0: blog: owner, 1: other
        avatar: { type: String, default: 'user' },
    },

    otherComments: [
        {
            // who wrote the comment
            user: {
                userId: { type: mongoose.Schema.Types.ObjectId },
                name: { type: String, required: true, default: '' },
                type: { type: Number, default: 1 }, // 0: blog: owner, 1: other
                avatar: { type: String, default: 'user' },
            },

            // written to whom
            toUser: {
                userId: { type: mongoose.Schema.Types.ObjectId },
                name: { type: String, required: true, default: '' },
                type: { type: Number, default: 1 }, // 0: blog: owner, 1: other
                avatar: { type: String, default: 'user' },
            },

            numLikes: { type: Number, default: 0 },
            content: { type: String, required: true, validate: /\S+/ },
            state: { type: Number, default: 1 }, // 0: pending, 1: approved, -1: deleted, -2: spam
            createdOn: { type: Date, default: Date.now },
        },
    ],

    state: { type: Number, default: 1 }, // 0: pending, 1: approved, -1: deleted, -2: spam

    /*
    1: yes, 2: no
    new comments need to be reviewed by blog owner
    to prevent spam comments
    */
    isReviewed: { type: Number, default: 2 },

    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

/*
configure auto-incrementing id
*/
commentSchema.plugin(autoIncrement.plugin, {
    model: 'Comment',
    field: 'id',
    startAt: 1,
    incrementBy: 1,
});

export const Comment = instance.model<CommentDocument>('Comment', commentSchema);

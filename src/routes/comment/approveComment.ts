import { Response } from 'express';
import { AugmentedRequest } from 'global';
import { ObjectId } from 'mongodb';

import { Article } from '../../models/article';
import { Comment, CommentDocument } from '../../models/comment';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { commentId }: { commentId: ObjectId } = req.body;

    if (!commentId) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.COMMENT_ID_NOT_PROVIDED,
        });
    }

    let commentExists: boolean;
    try {
        commentExists = await Comment.exists({ _id: commentId });
    } catch (err) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.COMMENT_ID_NOT_FOUND,
        });
    }
    if (!commentExists) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.COMMENT_ID_NOT_FOUND,
        });
    }

    const pendingComment: CommentDocument = await Comment.findById(commentId);
    const articleId = pendingComment.article;
    const isAuthor: boolean = await Article.exists({
        author: req.verifiedUser._id,
        _id: articleId,
    });
    if (isAuthor === false) {
        throw new ServerError({ statusCode: 401, message: MESSAGES.UNAUTHORIZED });
    }

    await Comment.updateOne({ _id: commentId }, { isApproved: true });
    const approvedComment: CommentDocument = await Comment.findById(
        commentId
    ).populate('user');

    res.status(200).json({ comment: approvedComment });
};

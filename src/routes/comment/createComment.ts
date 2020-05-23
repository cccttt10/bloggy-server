import { Response } from 'express';
import { AugmentedRequest } from 'global';
import { ObjectId } from 'mongodb';

import { Article } from '../../models/article';
import { Comment, CommentDocument, IComment } from '../../models/comment';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const {
        articleId,
        content,
    }: { articleId: ObjectId; content: string } = req.body;

    if (content === null || content === undefined || typeof content !== 'string') {
        throw new ServerError({ statusCode: 400, message: MESSAGES.EMPTY_COMMENT });
    }

    if (!articleId) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.ARTICLE_ID_NOT_PROVIDED,
        });
    }

    let articleExists: boolean;
    try {
        articleExists = await Article.exists({ _id: articleId });
    } catch (err) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.ARTICLE_ID_NOT_FOUND,
        });
    }
    if (!articleExists) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.ARTICLE_ID_NOT_FOUND,
        });
    }

    const commentInfo: IComment = {
        article: articleId,
        content,
        user: req.verifiedUser._id,
    };
    const newComment: CommentDocument = await new Comment(commentInfo).save();
    await Article.updateOne(
        { _id: articleId },
        { $push: { comments: newComment._id } }
    );

    res.status(201).json({ comment: newComment });
};

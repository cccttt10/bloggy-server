import { Response } from 'express';
import { AugmentedRequest } from 'global';
import { ObjectId } from 'mongodb';

import { Article, ArticleDocument } from '../../models/article';
import { CommentDocument } from '../../models/comment';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { articleId }: { articleId: ObjectId } = req.body;
    const isVisitor: boolean =
        typeof req.body.isVisitor === 'boolean' ? req.body.isVisitor : true;

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

    const article: ArticleDocument = await Article.findById(articleId).populate({
        path: 'comments',
        populate: { path: 'user' },
    });
    let comments: CommentDocument[] = article.comments;

    if (isVisitor === true) {
        comments = comments.filter((comment: CommentDocument): boolean => {
            return comment.isApproved === true;
        });
    }

    res.status(200).json({ count: comments.length, commentList: comments });
};

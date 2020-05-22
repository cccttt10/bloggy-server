import { Request, Response } from 'express';

import { Article, ArticleDocument } from '../../models/article';
import { CommentDocument } from '../../models/comment';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: Request, res: Response): Promise<void> => {
    const { _id, isVisitor } = req.body;

    if (!_id) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.ARTICLE_ID_NOT_PROVIDED,
        });
    }

    let articleExists: boolean;
    try {
        articleExists = await Article.exists({ _id });
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

    const article: ArticleDocument = await Article.findById(_id)
        .populate('comments')
        .populate('categories');
    if (isVisitor === true) {
        if (article.isDraft === true) {
            throw new ServerError({
                statusCode: 401,
                message: MESSAGES.UNAUTHORIZED,
            });
        }
        article.meta.numViews = article.meta.numViews + 1;
    }
    await Article.updateOne({ _id }, { meta: article.meta });

    if (isVisitor === true) {
        article.comments = article.comments.filter(
            (comment: CommentDocument): boolean => {
                return comment.isApproved;
            }
        );
    }

    res.status(200).json({ article });
};

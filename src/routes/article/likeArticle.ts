import { Request, Response } from 'express';

import { Article, ArticleDocument } from '../../models/article';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.body;

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

    const article: ArticleDocument = await Article.findById(_id);
    article.meta.numLikes = article.meta.numLikes + 1;
    const updateArticle: ArticleDocument = await Article.updateOne(
        { _id },
        { meta: article.meta }
    );

    res.status(200).json({ article: updateArticle });
};

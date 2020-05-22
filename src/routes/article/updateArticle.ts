import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Article, ArticleDocument } from '../../models/article';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { _id, updatedFields } = req.body;

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

    const newArticle: ArticleDocument = await Article.findOneAndUpdate(
        _id,
        { ...updatedFields, updatedOn: Date.now() },
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({ article: newArticle });
};

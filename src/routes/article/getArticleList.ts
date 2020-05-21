import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Article, ArticleDocument } from '../../models/article';
import { User } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { user } = req.body;

    if (!user) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_PROVIDED,
        });
    }

    let userExists: boolean;
    try {
        userExists = await User.exists({ _id: user });
    } catch (err) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_FOUND,
        });
    }
    if (!userExists) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_FOUND,
        });
    }

    const articles: ArticleDocument[] = await Article.find({ author: user });
    res.status(200).json({ count: articles.length, articleList: articles });
};

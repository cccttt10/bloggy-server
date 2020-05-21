import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Article } from '../../models/article';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { _id } = req.body;

    if (!_id) {
        throw new ServerError({
            message: MESSAGES.ARTICLE_ID_NOT_PROVIDED,
            statusCode: 400,
        });
    }

    let articleExists: boolean;
    try {
        articleExists = await Article.exists({
            _id: _id,
            author: req.verifiedUser._id,
        });
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

    await Article.deleteOne({ _id: _id, author: req.verifiedUser._id });
    res.sendStatus(204);
};

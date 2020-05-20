import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Article } from '../../models/article';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { _id } = req.body._id;

    if (!_id) {
        throw new ServerError({
            message: MESSAGES.ARTICLE_ID_NOT_PROVIDED,
            statusCode: 400,
        });
    }

    await Article.deleteOne({ _id });
    res.sendStatus(202);
};

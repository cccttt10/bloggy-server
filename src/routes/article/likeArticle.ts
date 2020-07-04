import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Article, ArticleDocument } from '../../models/article';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
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

    const alreadyLiked: boolean = await Article.exists({
        _id,
        likedBy: req.verifiedUser._id,
    });
    if (alreadyLiked === true) {
        throw new ServerError({ statusCode: 400, message: MESSAGES.ALREADY_LIKED });
    }

    await Article.updateOne(
        { _id },
        { $inc: { 'meta.numLikes': 1 }, $push: { likedBy: req.verifiedUser._id } }
    );

    const updatedArticle: ArticleDocument = await Article.findById(_id).populate(
        'comments categories author'
    );
    res.status(200).json({ article: updatedArticle });
};

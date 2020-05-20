import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Article, ArticleDocument, IArticle } from '../../models/article';
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

    const title = req.body.title ? req.body.title : 'Untitled Blog';
    const description = req.body.description
        ? req.body.description
        : 'This is a blog post.';
    const content = req.body.content ? req.body.content : 'No content yet.';
    const wordCount =
        req.body.content && typeof req.body.content === 'string'
            ? req.body.content.length
            : 0;
    const imgUrl = req.body.imgUrl ? req.body.imgUrl : '';
    const isDraft = req.body.isDraft ? req.body.isDraft : true;
    const categories = req.body.categories ? req.body.categories : [];
    const articleInfo: IArticle = {
        title,
        author: req.verifiedUser._id,
        description,
        content,
        wordCount,
        imgUrl,
        isDraft,
        categories,
    };
    const newArticle: ArticleDocument = await Article.findOneAndUpdate(
        _id,
        articleInfo,
        {
            new: true,
            runValidators: true,
        }
    );

    res.status(200).json({ article: newArticle });
};

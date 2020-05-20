import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Article, ArticleDocument, IArticle } from '../../models/article';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const title = req.body.title ? req.body.title : 'Untitled Blog';
    const author = req.verifiedUser._id;
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
        author,
        description,
        content,
        wordCount,
        imgUrl,
        isDraft,
        categories,
    };
    const newArticle: ArticleDocument = await new Article(articleInfo).save();
    res.status(201).json({ article: newArticle });
};

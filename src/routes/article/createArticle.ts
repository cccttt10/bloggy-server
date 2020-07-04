import { Response } from 'express';
import { AugmentedRequest } from 'global';
import { ObjectId } from 'mongodb';

import { Article, ArticleDocument, IArticle } from '../../models/article';
import { DEFAULT_IMG_URL, MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const title: string = req.body.title ? req.body.title : 'Untitled Blog';
    const author: ObjectId = req.verifiedUser._id;
    const description: string = req.body.description
        ? req.body.description
        : 'This is a blog post.';
    const content: string = req.body.content ? req.body.content : 'No content yet.';
    const wordCount: number =
        req.body.content && typeof req.body.content === 'string'
            ? req.body.content.length
            : 0;
    const imgUrl: string =
        typeof req.body.imgUrl === 'string' && req.body.imgUrl !== ''
            ? req.body.imgUrl
            : DEFAULT_IMG_URL;
    const isDraft: boolean =
        typeof req.body.isDraft === 'boolean' ? req.body.isDraft : true;
    const isAboutPage: boolean =
        typeof req.body.isAboutPage === 'boolean' ? req.body.isAboutPage : false;
    const aboutPageExists: boolean = await Article.exists({
        author: author,
        isAboutPage: true,
    });
    if (aboutPageExists === true && isAboutPage === true) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.ABOUT_PAGE_ALREADY_EXISTS,
        });
    }
    const categories: ObjectId[] = req.body.categories ? req.body.categories : [];
    const articleInfo: IArticle = {
        title,
        author,
        description,
        content,
        wordCount,
        imgUrl,
        isDraft,
        isAboutPage,
        categories,
    };
    const newArticle: ArticleDocument = await new Article(articleInfo).save();
    const savedArticle: ArticleDocument = await Article.findById(
        newArticle._id
    ).populate('comments categories');

    res.status(201).json({ article: savedArticle });
};

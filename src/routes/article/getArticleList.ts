import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Article, ArticleDocument, IArticle } from '../../models/article';
import { CommentDocument } from '../../models/comment';
import { User } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { user } = req.body;
    const isVisitor: boolean =
        typeof req.body.isVisitor === 'boolean' ? req.body.isVisitor : true;

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

    let articles: ArticleDocument[];

    // pagination
    const page = req.body.pagination?.page * 1 || 1; // convert string to number
    const limit = req.body.pagination?.limit * 1 || 5;
    const skip = (page - 1) * limit;

    // filter
    const filter = req.body.filter;
    if (filter) {
        const isAboutPage: IArticle['isAboutPage'] = filter.isAboutPage;
        const isDraft: IArticle['isDraft'] = filter.isDraft;
        const keyword: string = filter.keyword;
        articles = await Article.find({
            author: user,
            isAboutPage,
            isDraft: isDraft,
            $text: { $search: `\"${keyword}\"` },
        })
            .skip(skip)
            .limit(limit)
            .populate('comments')
            .populate('categories');
    }
    // no filter
    else {
        articles = await Article.find({
            author: user,
        })
            .skip(skip)
            .limit(limit)
            .populate('comments')
            .populate('categories');
    }

    if (isVisitor === true) {
        // filter out draft articles
        articles = articles.filter((article: ArticleDocument): boolean => {
            return article.isDraft === false;
        });
        // filter out unapproved comments
        for (const article of articles) {
            article.comments = article.comments.filter(
                (comment: CommentDocument): boolean => {
                    return comment.isApproved === true;
                }
            );
        }
    }
    res.status(200).json({ count: articles.length, articleList: articles });
};

import { Response } from 'express';
import { AugmentedRequest } from 'global';
import { FilterQuery } from 'mongoose';

import { Article, ArticleDocument } from '../../models/article';
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

    // filter
    const filter = req.body.filter;
    if (filter) {
        let queryObject: FilterQuery<ArticleDocument>;
        queryObject.author = user;
        if (typeof filter.isAboutPage === 'boolean') {
            queryObject.isAboutPage = filter.isAboutPage;
        }
        if (typeof filter.isDraft === 'boolean') {
            queryObject.isDraft = filter.isDraft;
        }
        if (typeof filter.keyword === 'string') {
            queryObject.$text = { $search: `\"${filter.keyword}\"` };
        }
        if (typeof filter.categoryId === 'string') {
            queryObject.categories = filter.categoryId;
        }
        articles = await Article.find(queryObject).populate('comments categories');
    } else {
        // no filter
        articles = await Article.find({
            author: user,
        }).populate('comments categories');
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

    const totalCount = articles.length;

    // pagination
    if (req.body.pagination) {
        const page = req.body.pagination.page * 1 || 0; // convert string to number
        const limit = req.body.pagination.limit * 1 || 5;
        const skip = page * limit;
        articles = articles.slice(skip, skip + limit);
    }

    res.status(200).json({ count: totalCount, articleList: articles });
};

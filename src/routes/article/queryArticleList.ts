import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Article } from '../../models/article';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

function queryHelper(req: AugmentedRequest) {
    const { _id } = req.body.id;
    const filter = req.body.filter;
    const pagination = req.body.pagination;

    if (!_id) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_FOUND,
        });
    }

    if (filter && !filter.isAboutPage) {
        throw new ServerError({
            statusCode: 400,
            message: 'queryArticleList: filter invalid',
        });
    }

    if (pagination && !pagination.limit && !pagination.offset) {
        throw new ServerError({
            statusCode: 400,
            message: 'queryArticleList: pagination invalid',
        });
    }

    const query = [];
    query.push({ $match: { $and: [{ _id: _id }] } });

    if (filter) {
        query.push({ $match: { $and: [{ isAboutPage: filter.isAboutPage }] } });
        if (filter.isDraft) {
            query.push({ $match: { $and: [{ isDraft: filter.isDraft }] } });
        }
        if (filter.keyword) {
            query.push({ $match: { $and: [{ isDraft: filter.keyword }] } });
        }
    }

    if (pagination) {
        query.push({ $skip: pagination.limit });
        query.push({ $skip: pagination.offset });
    }

    return query;
}

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    console.log('>> in queryArticleList, req is', req.body);

    const query = queryHelper(req);

    console.log('>>> query:', query);

    await Article.aggregate(query)
        .then(obj => {
            console.log('>>> response:', obj);
            res.status(200).json();
        })
        .catch(error => {
            console.error('>>> error', error);
            res.status(500).json();
        });
    // const filteredArticle: ArticleDocument = await Article.findById({
    //     $filter: {
    //         input: [_id, filter, pagination],
    //         as: 'filter',
    //         cond: {},
    //     },
    // });
    // const queryAriticleListResponseBody = {
    //     count: filteredArticle,
    //     articleList: filteredArticle,
    // };
};

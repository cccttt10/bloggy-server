import { tryAsync } from '../../util/util';
import createArticle from './createArticle';
import deleteAllArticles from './deleteAllArticles';
import deleteArticle from './deleteArticle';
import getArticle from './getArticle';
import getArticleList from './getArticleList';
import likeArticle from './likeArticle';
import queryArticleList from './queryArticleList';
import updateArticle from './updateArticle';

export default {
    createArticle: tryAsync(createArticle),
    deleteAllArticles: tryAsync(deleteAllArticles),
    deleteArticle: tryAsync(deleteArticle),
    getArticle: tryAsync(getArticle),
    getArticleList: tryAsync(getArticleList),
    likeArticle: tryAsync(likeArticle),
    updateArticle: tryAsync(updateArticle),
    queryArticleList: tryAsync(queryArticleList),
};

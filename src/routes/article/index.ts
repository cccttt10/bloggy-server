import { tryAsync } from '../../util/util';
import createArticle from './createArticle';
import deleteAllArticles from './deleteAllArticles';
import getArticle from './getArticle';
import getArticleList from './getArticleList';
import likeArticle from './likeArticle';
import updateArticle from './updateArticle';

export default {
    createArticle: tryAsync(createArticle),
    deleteAllArticles: tryAsync(deleteAllArticles),
    getArticle: tryAsync(getArticle),
    getArticleList: tryAsync(getArticleList),
    likeArticle: tryAsync(likeArticle),
    updateArticle: tryAsync(updateArticle),
};

import { Express } from 'express';

import article from './article/index';
import category from './category/index';
import { verifySudo, verifyUser } from './user/auth';
import user from './user/index';

const setUpRoutes = (app: Express): void => {
    app.post('/createArticle', verifyUser, article.createArticle);
    app.post('/deleteAllArticles', verifySudo, article.deleteAllArticles);
    app.post('/getArticle', article.getArticle);
    app.post('/getArticleList', article.getArticleList);
    app.post('/likeArticle', verifyUser, article.likeArticle);
    app.post('/updateArticle', verifyUser, article.updateArticle);

    app.post('/createCategory', verifyUser, category.createCategory);
    app.post('/deleteAllCategories', verifySudo, category.deleteAllCategories);
    app.post('/deleteCategory', verifyUser, category.deleteCategory);
    app.post('/getCategoryList', category.getCategoryList);

    app.post('/deleteAllUsers', verifySudo, user.deleteAllUsers);
    app.post('/getUser', user.getUser);
    app.post('/login', user.login);
    app.get('/logout', user.logout);
    app.post('/register', user.register);
};

export default setUpRoutes;

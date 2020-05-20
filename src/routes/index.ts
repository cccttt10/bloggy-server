import { Express } from 'express';

import category from './category/index';
import { verifySudo, verifyUser } from './user/auth';
import user from './user/index';

const setUpRoutes = (app: Express): void => {
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

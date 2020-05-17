import { Express } from 'express';

import category from './category/index';
import user from './user/index';
import { verifyUser } from './user/token';

const setUpRoutes = (app: Express): void => {
    app.post('/createCategory', verifyUser, category.createCategory);
    app.post('/deleteAllCategories', category.deleteAllCategories);

    app.post('/deleteAllUsers', user.deleteAllUsers);
    app.post('/getUser', user.getUser);
    app.post('/login', user.login);
    app.get('/logout', user.logout);
    app.post('/register', user.register);
};

export default setUpRoutes;

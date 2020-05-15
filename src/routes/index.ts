import { Express } from 'express';

import { tryAsync } from '../util/util';
import * as user from './user';

const setUpRoutes = (app: Express): void => {
    app.post('/loginOAuth', tryAsync(user.loginOAuth));
    app.post('/login', tryAsync(user.login));
    app.get('/currentUser', tryAsync(user.currentUser));
    app.post('/logout', tryAsync(user.logout));
    app.post('/loginAdmin', tryAsync(user.loginAdmin));
    app.post('/register', tryAsync(user.register));
    app.post('/delUser', tryAsync(user.delUser));
    app.get('/getUserList', tryAsync(user.getUserList));
};

export default setUpRoutes;

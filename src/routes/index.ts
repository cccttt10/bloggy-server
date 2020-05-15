import { Express } from 'express';

import * as user from './user';

module.exports = (app: Express): void => {
    app.post('/loginOAuth', user.loginOAuth);
    app.post('/login', user.login);
    app.get('/currentUser', user.currentUser);
    app.post('/logout', user.logout);
    app.post('/loginAdmin', user.loginAdmin);
    app.post('/register', user.register);
    app.post('/delUser', user.delUser);
    app.get('/getUserList', user.getUserList);
};

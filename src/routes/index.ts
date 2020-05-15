import { Express } from 'express';

import user from './user/index';

const setUpRoutes = (app: Express): void => {
    // app.get('/currentUser', user.currentUser);
    app.post('/deleteAllUsers', user.deleteAllUsers);
    // app.post('/delUser', user.delUser);
    // app.get('/getUserList', user.getUserList);
    app.post('/login', user.login);
    // app.post('/loginAdmin', user.loginAdmin);
    // app.post('/logout', user.logout);
    app.post('/register', user.register);
};

export default setUpRoutes;

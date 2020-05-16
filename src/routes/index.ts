import { Express } from 'express';

import user from './user/index';

const setUpRoutes = (app: Express): void => {
    app.post('/deleteAllUsers', user.deleteAllUsers);
    app.post('/getUser', user.getUser);
    app.post('/login', user.login);
    app.get('/logout', user.logout);
    app.post('/register', user.register);
};

export default setUpRoutes;

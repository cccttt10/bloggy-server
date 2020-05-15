import { Request, Response } from 'express';

import { respondToClient } from '../../util/util';

/*
current user in admin view
*/
export default (req: Request, res: Response): void => {
    const user = req.session.userInfo;
    if (user) {
        user.avatar =
            'https://avatars0.githubusercontent.com/u/45834557?s=460&u=74ce16476d1ac6c1f51af66a6f246aee78dfc920&v=4';
        user.notifyCount = 0;
        user.address = 'BC';
        user.country = 'Canada';
        user.group = 'chuntonggao';
        (user.title = '交互专家'), (user.signature = '窗外潇潇的雨幕里');
        user.tags = [];
        respondToClient(res, 200, 0, '', user);
    } else {
        respondToClient(res, 200, 1, 'Please login again.', user);
    }
};

import consola from 'consola';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

import * as CONFIG from '../../app.config';
import { User } from '../../models/user';
import { respondToClient } from '../../util/util';

export default (req: Request, res: Response): void => {
    const { code } = req.body;
    if (!code) {
        respondToClient(res, 400, 2, 'code missing');
        return;
    }
    const path = CONFIG.GITHUB.accessTokenUrl;
    const params = {
        clientId: CONFIG.GITHUB.clientId,
        clientSecret: CONFIG.GITHUB.clientSecret,
        code: code,
    };

    fetch(path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    })
        .then(res1 => {
            return res1.text();
        })
        .then(body => {
            const args = body.split('&');
            const arg = args[0].split('=');
            const accessToken = arg[1];
            consola.info(`accessToken is ${accessToken}`);
            return accessToken;
        })
        .then(async token => {
            const url = CONFIG.GITHUB.userUrl + '?access_token=' + token;
            consola.info(`url is ${url}`);
            await fetch(url)
                .then(res2 => {
                    return res2.json();
                })
                .then(response => {
                    if (response.id) {
                        // check if user is already in db
                        User.findOne({ githubId: response.id })
                            .then(userInfo => {
                                if (userInfo) {
                                    // provision session if login successful
                                    req.session.userInfo = userInfo;
                                    respondToClient(
                                        res,
                                        200,
                                        0,
                                        'Third-party OAuth login successful.',
                                        userInfo
                                    );
                                } else {
                                    const newUser = {
                                        githubId: response.id,
                                        email: response.email,
                                        password: response.login,
                                        type: 2,
                                        avatar: response.avatar_url,
                                        name: response.login,
                                        location: response.location,
                                    };
                                    // save user to db
                                    const user = new User(newUser);
                                    user.save().then(data => {
                                        req.session.userInfo = data;
                                        respondToClient(
                                            res,
                                            200,
                                            0,
                                            'Third-party OAuth login successful.',
                                            data
                                        );
                                    });
                                }
                            })
                            .catch(err => {
                                consola.error(err);
                                respondToClient(res);
                                return;
                            });
                    } else {
                        respondToClient(
                            res,
                            400,
                            1,
                            'Third-party OAuth login failed.',
                            response
                        );
                    }
                });
        })
        .catch(e => {
            consola.error(e);
        });
};

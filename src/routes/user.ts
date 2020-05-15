/* eslint-disable max-lines */
import consola from 'consola';
import { Request, Response } from 'express';
import fetch from 'node-fetch';

import * as CONFIG from '../app.config';
import { User, UserDocument } from '../models/user';
import { md5, MD5_SUFFIX, respondToClient } from '../util/util.js';

export const loginOAuth = (req: Request, res: Response): void => {
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

export const login = (req: Request, res: Response): void => {
    const { email, password } = req.body;

    if (!email) {
        respondToClient(res, 400, 2, 'Email cannot be empty.');
        return;
    }

    if (!password) {
        respondToClient(res, 400, 2, 'Password cannot be empty.');
        return;
    }

    User.findOne({
        email,
        password: md5(password + MD5_SUFFIX),
    })
        .then(userInfo => {
            if (userInfo) {
                // provision session if login successful
                req.session.userInfo = userInfo;
                respondToClient(res, 200, 0, 'Login successful.', userInfo);
            } else {
                respondToClient(res, 400, 1, 'Email or password is wrong.');
            }
        })
        .catch(err => {
            consola.error(err);
            respondToClient(res);
        });
};

/*
authentication
*/
export const userInfo = (req: Request, res: Response): void => {
    if (req.session.userInfo) {
        respondToClient(res, 200, 0, '', req.session.userInfo);
    } else {
        respondToClient(res, 200, 1, 'Please login again', req.session.userInfo);
    }
};

/*
current user in admin view
*/
export const currentUser = (req: Request, res: Response): void => {
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

export const logout = (req: Request, res: Response): void => {
    if (req.session.userInfo) {
        req.session.userInfo = null; // delete session
        respondToClient(res, 200, 0, 'Logout successful.');
    } else {
        respondToClient(res, 200, 1, 'You have not logged out yet.');
    }
};

export const loginAdmin = (req: Request, res: Response): void => {
    const { email, password } = req.body;

    if (!email) {
        respondToClient(res, 400, 2, 'Email cannot be empty.');
        return;
    }

    if (!password) {
        respondToClient(res, 400, 2, 'Password cannot be empty.');
        return;
    }

    User.findOne({
        email,
        password: md5(password + MD5_SUFFIX),
    })
        .then(userInfo => {
            if (userInfo) {
                if (userInfo.type === 0) {
                    // provision session if login successful
                    req.session.userInfo = userInfo;
                    respondToClient(res, 200, 0, 'Login successful', userInfo);
                } else {
                    respondToClient(
                        res,
                        403,
                        1,
                        'Only blog owners can access this page.'
                    );
                }
            } else {
                respondToClient(res, 400, 1, 'Email or password is worng.');
            }
        })
        .catch(err => {
            consola.error(err);
            respondToClient(res);
        });
};

export const register = (req: Request, res: Response): void => {
    const { name, password, phone, email, bio, type } = req.body;
    if (!email) {
        respondToClient(res, 400, 2, 'Email cannot be empty.');
        return;
    }

    const reg = new RegExp(
        '^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'
    );
    if (!reg.test(email)) {
        respondToClient(res, 400, 2, 'Email has wrong format.');
        return;
    }

    if (!name) {
        respondToClient(res, 400, 2, 'Name cannot be empty');
        return;
    }

    if (!password) {
        respondToClient(res, 400, 2, 'Password cannot be empty.');
        return;
    }

    // check if user is already in db
    User.findOne({ email: email })
        .then(data => {
            if (data) {
                respondToClient(res, 200, 1, 'User already exists.');
                return;
            }
            // save user to db
            const newUser = new User({
                email,
                name,
                password: md5(password + MD5_SUFFIX),
                phone,
                type,
                bio,
            });
            newUser.save().then(data => {
                respondToClient(res, 200, 0, 'Registration successful', data);
            });
        })
        .catch(err => {
            consola.error(err);
            respondToClient(res);
            return;
        });
};

export const delUser = (req: Request, res: Response): void => {
    const { id } = req.body;
    User.deleteMany({ _id: id })
        .then(result => {
            if (result.n === 1) {
                respondToClient(res, 200, 0, 'User successfully deleted.');
            } else {
                respondToClient(res, 200, 1, 'User does not exist.');
            }
        })
        .catch(err => {
            consola.error(err);
            respondToClient(res);
        });
};

export const getUserList = (
    req: Request & { query: { keyword: string; pageNum: string; pageSize: string } },
    res: Response
): void => {
    const keyword = req.query.keyword || '';
    const pageNum = parseInt(req.query.pageNum) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    let conditions = {};
    if (keyword) {
        const reg = new RegExp(keyword, 'i');
        conditions = {
            $or: [{ name: { $regex: reg } }, { email: { $regex: reg } }],
        };
    }
    const skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
    const responseData: { count: number; list: UserDocument[] } = {
        count: 0,
        list: [],
    };
    User.countDocuments({}, (err, count) => {
        if (err) {
            consola.error(err);
        } else {
            responseData.count = count;
            const fields = {
                _id: 1,
                email: 1,
                name: 1,
                avatar: 1,
                phone: 1,
                bio: 1,
                type: 1,
                createdOn: 1,
            };
            const options = {
                skip: skip,
                limit: pageSize,
                sort: { createdOn: -1 },
            };
            User.find(conditions, fields, options, (error, result) => {
                if (err) {
                    consola.error(err);
                } else {
                    responseData.list = result;
                    respondToClient(res, 200, 0, 'success', responseData);
                }
            });
        }
    });
};

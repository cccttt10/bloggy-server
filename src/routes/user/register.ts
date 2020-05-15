import consola from 'consola';
import { Request, Response } from 'express';

import { User, UserDocument } from '../../models/user';
import { md5, MD5_SUFFIX, respondToClient } from '../../util/util';

export default (req: Request, res: Response): void => {
    const { name, password, phone, email, bio } = req.body;

    if (!email) {
        respondToClient(res, 400, 2, 'Email cannot be empty.');
        return;
    }

    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
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
                respondToClient(res, 400, 2, 'User already exists.');
                return;
            }
            // save user to db
            const newUser = new User({
                email,
                name,
                password: md5(password + MD5_SUFFIX),
                phone,
                bio,
            } as UserDocument);
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

import { Request, Response } from 'express';

import { User, UserDocument } from '../../models/user';
import { md5, MD5_SUFFIX, ServerError } from '../../util/util';
import { sendToken } from './token';

export default async (req: Request, res: Response): Promise<void> => {
    const { name, password, phone, email, bio } = req.body;

    if (!email) {
        throw new ServerError({
            message: 'Email cannot be empty.',
            statusCode: 400,
        });
    }

    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!reg.test(email)) {
        throw new ServerError({
            message: 'Email has invalid format.',
            statusCode: 400,
        });
    }

    if (!name) {
        throw new ServerError({ message: 'Name cannot be empty.', statusCode: 400 });
    }

    if (!password) {
        throw new ServerError({
            message: 'Password cannot be empty.',
            statusCode: 400,
        });
    }

    // check if user is already in db
    const user: UserDocument = await User.findOne({ email: email });
    if (user) {
        throw new ServerError({ message: 'User already exists.', statusCode: 400 });
    }

    // save new user to db
    const newUser: UserDocument = new User({
        email,
        name,
        password: md5(password + MD5_SUFFIX),
        phone,
        bio,
    } as UserDocument);
    await newUser.save();
    sendToken({
        user: newUser,
        statusCode: 200,
        res: res,
    });
};

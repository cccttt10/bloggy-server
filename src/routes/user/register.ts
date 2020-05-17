import { Request, Response } from 'express';
import validator from 'validator';

import { IUser, User, UserDocument } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { md5, MD5_SUFFIX, ServerError } from '../../util/util';
import { sendToken } from './token';

export default async (req: Request, res: Response): Promise<void> => {
    const { name, password, phone, email, bio }: IUser = req.body;

    if (!email) {
        throw new ServerError({
            message: MESSAGES.EMPTY_EMAIL,
            statusCode: 400,
        });
    }

    if (!validator.isEmail(email)) {
        throw new ServerError({
            message: MESSAGES.INVALID_EMAIL,
            statusCode: 400,
        });
    }

    if (!name) {
        throw new ServerError({ message: MESSAGES.EMPTY_NAME, statusCode: 400 });
    }

    if (!password) {
        throw new ServerError({
            message: MESSAGES.EMPTY_PASSWORD,
            statusCode: 400,
        });
    }

    // check if user is already in db
    const user: UserDocument = await User.findOne({ email: email });
    if (user) {
        throw new ServerError({
            message: MESSAGES.DUPLICATE_EMAIL,
            statusCode: 400,
        });
    }

    // save new user to db
    const userInfo: IUser = {
        email,
        name,
        password: md5(password + MD5_SUFFIX),
        phone,
        bio,
    };
    await new User(userInfo).save();
    const newUser: UserDocument = await User.findOne({ email: email });
    sendToken({
        user: newUser,
        statusCode: 201,
        res: res,
    });
};

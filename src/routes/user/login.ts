import { Request, Response } from 'express';

import { User, UserDocument } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { md5, MD5_SUFFIX, ServerError } from '../../util/util';
import { sendToken } from './auth';

export default async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email) {
        throw new ServerError({
            message: MESSAGES.EMPTY_EMAIL,
            statusCode: 400,
        });
    }

    if (!password) {
        throw new ServerError({
            message: MESSAGES.EMPTY_PASSWORD,
            statusCode: 400,
        });
    }

    const user: UserDocument = await User.findOne({
        email,
        password: md5(password + MD5_SUFFIX),
    });

    if (!user) {
        throw new ServerError({
            message: MESSAGES.WRONG_CREDENTIALS,
            statusCode: 400,
        });
    }

    sendToken({
        user: user,
        statusCode: 200,
        res: res,
    });
};

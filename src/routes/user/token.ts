import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserDocument } from '../../models/user';
import { respondToClient } from '../../util/util';

const ONE_DAY = 24 * 60 * 60 * 1000;
const createToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '20s',
    });
};

export const sendToken = ({
    user,
    statusCode,
    res,
    message = 'success',
}: {
    user: UserDocument;
    statusCode: number;
    res: Response;
    message?: string;
}): void => {
    const token = createToken(user._id);

    const cookieOptions: { expires: Date; httpOnly: boolean; secure?: boolean } = {
        expires: new Date(Date.now() + ONE_DAY),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    res.cookie('jwt', token, cookieOptions);

    // Remove password from response
    user.password = undefined;

    respondToClient(res, statusCode, 0, message, { user });
};

import { Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserDocument } from '../../models/user';

const ONE_DAY = 24 * 60 * 60 * 1000;
const createToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
    });
};

export const sendToken = ({
    user,
    statusCode,
    res,
}: {
    user: UserDocument;
    statusCode: number;
    res: Response;
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

    // remove password from response
    user.password = undefined;

    res.status(statusCode).json({ user: user });
};

import { NextFunction, Request, Response } from 'express';
import { AugmentedRequest } from 'global';
import jwt, { Secret, VerifyOptions } from 'jsonwebtoken';
import { promisify } from 'util';

import { User, UserDocument } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { ServerError, tryAsync } from '../../util/util';

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
    res.status(statusCode).json({ user: user });
};

export const verifyUser = tryAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        /*
        1) get token and check if it's there
        */
        let token: string;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            throw new ServerError({
                statusCode: 401,
                message: MESSAGES.NOT_LOGGED_IN,
            });
        }

        /*
        2) verify token
        */
        const promisifiedVerify: (
            token: string,
            secretOrPublicKey: Secret,
            options?: VerifyOptions
        ) => object | string = promisify(jwt.verify);
        interface DecodedToken {
            id: string;
        }
        const decoded: DecodedToken = (await promisifiedVerify(
            token,
            process.env.JWT_SECRET
        )) as DecodedToken;

        /*
        3 ) check if user still exists
        */
        const verifiedUser: UserDocument = await User.findById(decoded.id);
        if (!verifiedUser) {
            throw new ServerError({
                statusCode: 401,
                message: MESSAGES.NO_USER_FOR_THIS_TOKEN,
            });
        }

        // grant access to protected route
        (req as AugmentedRequest).verifiedUser = verifiedUser;

        next();
    }
);

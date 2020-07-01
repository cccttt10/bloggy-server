import { CookieOptions, NextFunction, Request, Response } from 'express';
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
    origin,
    user,
    statusCode,
    res,
}: {
    origin: string;
    user: UserDocument;
    statusCode: number;
    res: Response;
}): void => {
    const token = createToken(user._id);
    let cookieOptions: CookieOptions;
    if (process.env.NODE_ENV === 'development') {
        cookieOptions = {
            expires: new Date(Date.now() + ONE_DAY),
            httpOnly: false,
            secure: false,
        };
    } else if (process.env.NODE_ENV === 'production') {
        let domain = '';
        if (
            origin === 'https://bloggy-reader.netlify.app' ||
            origin === 'https://bloggy-publisher.netlify.app'
        ) {
            domain = origin;
        }
        cookieOptions = {
            expires: new Date(Date.now() + ONE_DAY),
            httpOnly: false,
            secure: true,
            sameSite: 'none',
            domain: domain,
            path: '/',
        };
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

export const verifySudo = tryAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await new Promise(resolve => resolve()); // to comply with Promise<void> return type
        if (
            !req.body.sudoSecret ||
            req.body.sudoSecret !== process.env.SUDO_SECRET
        ) {
            throw new ServerError({
                message: MESSAGES.SUDO_ACCESS_ONLY,
                statusCode: 401,
            });
        }
        next();
    }
);

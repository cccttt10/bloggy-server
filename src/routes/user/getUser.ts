import { Request, Response } from 'express';

import { User, UserDocument } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.body;

    if (!_id) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_PROVIDED,
        });
    }

    let user: UserDocument;
    try {
        user = await User.findOne({ _id: _id });
    } catch (err) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_FOUND,
        });
    }
    if (!user) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_FOUND,
        });
    }

    res.status(200).json({ user: user });
};

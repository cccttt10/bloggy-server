import { Request, Response } from 'express';

import { User, UserDocument } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body;
    if (!id) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_PROVIDED,
        });
    }
    const user: UserDocument = await User.findOne({ id: id });
    if (!user)
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_FOUND,
        });
    res.status(200).json({ user: user });
};

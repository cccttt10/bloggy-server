import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { User, UserDocument } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { _id } = req.verifiedUser._id;

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

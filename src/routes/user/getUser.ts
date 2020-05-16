import { Request, Response } from 'express';

import { User, UserDocument } from '../../models/user';
import { ServerError } from '../../util/util';

export default async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body;
    if (!id) {
        throw new ServerError({
            statusCode: 400,
            message: 'Please provide use id.',
        });
    }
    const user: UserDocument = await User.findOne({ id: id });
    if (!user)
        throw new ServerError({
            statusCode: 400,
            message: 'User id does not exist.',
        });
    res.status(200).json({ user: user });
};

import { Request, Response } from 'express';

import { User } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: Request, res: Response): Promise<void> => {
    if (!req.body.sudoSecret || req.body.sudoSecret !== process.env.SUDO_SECRET) {
        throw new ServerError({
            message: MESSAGES.SUDO_ACCESS_ONLY,
            statusCode: 401,
        });
    }
    await User.deleteMany({});
    res.sendStatus(202);
};

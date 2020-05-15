import { Request, Response } from 'express';

import { User } from '../../models/user';
import { ServerError } from '../../util/util';

export default async (req: Request, res: Response): Promise<void> => {
    if (!req.body.sudoSecret || req.body.sudoSecret !== process.env.SUDO_SECRET) {
        throw new ServerError({
            message: 'You do not have privilege to delete all users',
            statusCode: 400,
        });
    }
    await User.deleteMany({});
    res.status(202).json({});
};

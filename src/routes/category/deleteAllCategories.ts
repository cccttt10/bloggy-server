import { Request, Response } from 'express';

import { Category } from '../../models/category';
import { ServerError } from '../../util/util';

export default async (req: Request, res: Response): Promise<void> => {
    if (!req.body.sudoSecret || req.body.sudoSecret !== process.env.SUDO_SECRET) {
        throw new ServerError({
            message: 'You do not have privilege to delete all categories',
            statusCode: 400,
        });
    }
    await Category.deleteMany({});
    res.status(202).json({});
};

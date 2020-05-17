import { Response } from 'express';
import { AugmentedRequest } from 'global';
import { ObjectId } from 'mongodb';

import { Category, ICategory } from '../../models/category';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { user, name }: ICategory = req.body;

    if (!user) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_PROVIDED,
        });
    }

    if (!name) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.CATEGORY_NAME_NOT_PROVIDED,
        });
    }

    if ((req.verifiedUser._id as ObjectId).toHexString() !== user) {
        throw new ServerError({
            statusCode: 401,
            message: MESSAGES.UNAUTHORIZED,
        });
    }

    const categoryAlreadyExists: boolean = await Category.exists({
        name: name,
        user: user,
    });
    if (!categoryAlreadyExists) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.CATEGORY_NOT_FOUND,
        });
    }

    await Category.deleteOne({ name: name, user: user });
    res.sendStatus(202);
};

import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Category, CategoryDocument, ICategory } from '../../models/category';
import { User } from '../../models/user';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { user }: ICategory = req.body;

    if (!user) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_PROVIDED,
        });
    }

    let userExists: boolean;
    try {
        userExists = await User.exists({ _id: user });
    } catch (err) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_FOUND,
        });
    }
    if (!userExists) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.USER_ID_NOT_FOUND,
        });
    }

    const categoryList: CategoryDocument[] = await Category.find({ user: user });
    res.status(200).send({ categoryList });
};

import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Category, ICategory } from '../../models/category';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { name }: ICategory = req.body;

    if (!name) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.CATEGORY_NAME_NOT_PROVIDED,
        });
    }

    const categoryAlreadyExists: boolean = await Category.exists({
        name: name,
        user: req.verifiedUser._id,
    });
    if (!categoryAlreadyExists) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.CATEGORY_NOT_FOUND,
        });
    }

    await Category.deleteOne({ name: name, user: req.verifiedUser._id });
    res.sendStatus(204);
};

import { Response } from 'express';
import { AugmentedRequest } from 'global';
import { ObjectId } from 'mongodb';

import { Category, CategoryDocument, ICategory } from '../../models/category';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { name, description, user, createdOn, updatedOn }: ICategory = req.body;

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
    if (categoryAlreadyExists) {
        throw new ServerError({
            statusCode: 400,
            message: MESSAGES.DUPLICATE_CATEGORY,
        });
    }

    const categoryInfo: ICategory = {
        name,
        description,
        user,
        createdOn,
        updatedOn,
    };
    await new Category(categoryInfo).save();
    const newCategory: CategoryDocument = await Category.findOne({
        name: name,
        user: user,
    });
    res.status(201).json({ category: newCategory });
};

import { Response } from 'express';
import { AugmentedRequest } from 'global';

import { Category, CategoryDocument, ICategory } from '../../models/category';
import { MESSAGES } from '../../util/constants';
import { ServerError } from '../../util/util';

export default async (req: AugmentedRequest, res: Response): Promise<void> => {
    const { name, description }: ICategory = req.body;

    const categoryAlreadyExists: boolean = await Category.exists({
        name: name,
        user: req.verifiedUser._id,
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
        user: req.verifiedUser._id,
    };
    await new Category(categoryInfo).save();
    const newCategory: CategoryDocument = await Category.findOne({
        name: name,
        user: req.verifiedUser._id,
    });
    res.status(201).json({ category: newCategory });
};

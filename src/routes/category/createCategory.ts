import { Request, Response } from 'express';

import { Category, CategoryDocument, ICategory } from '../../models/category';
import { ServerError } from '../../util/util';

export default async (req: Request, res: Response): Promise<void> => {
    const { name, description, user, createdOn, updatedOn }: ICategory = req.body;

    const categoryAlreadyExists: boolean = await Category.exists({
        name: name,
        user: user,
    });
    if (categoryAlreadyExists) {
        throw new ServerError({
            statusCode: 400,
            message: 'This user already has this category.',
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

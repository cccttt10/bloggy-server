import { Request, Response } from 'express';

import { Category, CategoryDocument, ICategory } from '../../models/category';

export default async (req: Request, res: Response): Promise<void> => {
    const { name, description, user, createdOn, updatedOn }: ICategory = req.body;
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
    res.status(201).json({ newCategory });
};

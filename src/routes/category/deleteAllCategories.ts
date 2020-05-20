import { Request, Response } from 'express';

import { Category } from '../../models/category';

export default async (req: Request, res: Response): Promise<void> => {
    await Category.deleteMany({});
    res.sendStatus(204);
};

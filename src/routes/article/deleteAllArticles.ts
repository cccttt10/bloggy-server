import { Request, Response } from 'express';

import { Article } from '../../models/article';

export default async (req: Request, res: Response): Promise<void> => {
    await Article.deleteMany({});
    res.sendStatus(204);
};

import { Request, Response } from 'express';

import { Comment } from '../../models/comment';

export default async (req: Request, res: Response): Promise<void> => {
    await Comment.deleteMany({});
    res.sendStatus(204);
};

import { Request, Response } from 'express';

import { User } from '../../models/user';

export default async (req: Request, res: Response): Promise<void> => {
    await User.deleteMany({});
    res.sendStatus(204);
};

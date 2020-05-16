import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
    await new Promise(resolve => resolve()); // to comply with Promise<void> return type
    res.cookie('jwt', '', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({});
};

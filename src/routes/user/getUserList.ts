import consola from 'consola';
import { Request, Response } from 'express';

import { User, UserDocument } from '../../models/user';
import { respondToClient } from '../../util/util';

export default (
    req: Request & { query: { keyword: string; pageNum: string; pageSize: string } },
    res: Response
): void => {
    const keyword = req.query.keyword || '';
    const pageNum = parseInt(req.query.pageNum) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    let conditions = {};
    if (keyword) {
        const reg = new RegExp(keyword, 'i');
        conditions = {
            $or: [{ name: { $regex: reg } }, { email: { $regex: reg } }],
        };
    }
    const skip = pageNum - 1 < 0 ? 0 : (pageNum - 1) * pageSize;
    const responseData: { count: number; list: UserDocument[] } = {
        count: 0,
        list: [],
    };
    User.countDocuments({}, (err, count) => {
        if (err) {
            consola.error(err);
        } else {
            responseData.count = count;
            const fields = {
                _id: 1,
                email: 1,
                name: 1,
                avatar: 1,
                phone: 1,
                bio: 1,
                type: 1,
                createdOn: 1,
            };
            const options = {
                skip: skip,
                limit: pageSize,
                sort: { createdOn: -1 },
            };
            User.find(conditions, fields, options, (error, result) => {
                if (err) {
                    consola.error(err);
                } else {
                    responseData.list = result;
                    respondToClient(res, 200, 0, 'success', responseData);
                }
            });
        }
    });
};

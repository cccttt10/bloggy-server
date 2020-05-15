import crypto from 'crypto';
import { Response } from 'express';

export const MD5_SUFFIX = 'chuntonggao*&^%$#';

export const md5 = (pwd: crypto.BinaryLike): string => {
    const md5 = crypto.createHash('md5');
    return md5.update(pwd).digest('hex');
};

export const respondToClient = (
    res: Response,
    httpCode = 500,
    code = 3,
    message = 'server side exception',
    data = {}
): void => {
    const responseData = {
        code: code,
        message: message,
        data: data,
    };
    res.status(httpCode).json(responseData);
};

// format as 2018-12-12 12:12:00
export const timestampToTime = (timestamp: string | number | Date): string => {
    const date = new Date(timestamp);
    const Y = date.getFullYear() + '-';
    const M =
        (date.getMonth() + 1 < 10
            ? '0' + (date.getMonth() + 1)
            : date.getMonth() + 1) + '-';
    const D =
        date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
    const h =
        date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
    const m =
        date.getMinutes() < 10
            ? '0' + date.getMinutes() + ':'
            : date.getMinutes() + ':';
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
};
